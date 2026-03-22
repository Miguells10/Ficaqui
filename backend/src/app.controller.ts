import { Controller, Post, Get, Body, Param, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';
import { GroqService } from './groq.service';
import { ChatDto, CheckInDto } from './app.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@ApiTags('Ficaqui API')
@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groqService: GroqService
  ) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar mensagem para o Chat assistente LLM' })
  @ApiResponse({ status: 201, description: 'Retorna a resposta do assistente (Llama/Groq) e persiste no Postgres.' })
  async handleChat(@Body() dto: ChatDto, @Request() req: any) {
    try {
      const realUserId = req.user.id;

      // Save user message
      await this.prisma.chatMessage.create({
        data: {
          content: dto.message,
          role: 'user',
          userId: realUserId
        }
      });

      // Llama RAG Context Fetching
      const userProfile = await this.prisma.user.findUnique({
        where: { id: realUserId },
        select: { id: true, name: true, centrocoinsBalance: true, role: true }
      });

      const history = await this.prisma.chatMessage.findMany({
        where: { userId: realUserId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { role: true, content: true }
      });

      // Busca de Produtos do Banco (RAG Simples usando filtro de keywords do input)
      const keywords = dto.message.split(' ').filter(w => w.length > 3);
      const productData = await this.prisma.product.findMany({
        where: {
          OR: keywords.length > 0 ? keywords.map(kw => ({ name: { contains: kw, mode: 'insensitive' } })) : undefined
        },
        include: { store: true },
        take: 3
      });

      // Busca de Lojas Próximas para mapeamento (Urban Awareness)
      const storeData = await this.prisma.store.findMany({
        take: 5,
        select: { id: true, name: true, category: true, latitude: true, longitude: true }
      });

      const reply = await this.groqService.getChatCompletion(
        dto.message,
        userProfile,
        storeData,
        productData,
        history.reverse()
      );

      // Save assistant message
      await this.prisma.chatMessage.create({
        data: {
          content: reply,
          role: 'assistant',
          userId: realUserId
        }
      });

      return { reply };
    } catch (e) {
      console.error(e);
      throw new HttpException('Erro interno do servidor ao processar o chat', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('checkin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar Check-in no mapa pelo QR Code' })
  @ApiResponse({ status: 201, description: 'Gamificação: Realiza Check-in e credita moedas CentroCoins.' })
  async checkIn(@Body() dto: CheckInDto, @Request() req: any) {
    try {
      const realUserId = req.user.id;

      // Create CheckIn record
      await this.prisma.checkIn.create({
        data: {
          location: dto.location,
          coinsEarned: dto.coinsEarned,
          userId: realUserId
        }
      });

      // B2G Audit: Create Transaction and update balance safely in a Prisma Transaction
      const [transaction, user] = await this.prisma.$transaction([
        this.prisma.transaction.create({
          data: {
            userId: realUserId,
            amount: dto.coinsEarned,
            description: `Check-in em ${dto.location}`,
            type: 'EARN'
          }
        }),
        this.prisma.user.update({
          where: { id: realUserId },
          data: { centrocoinsBalance: { increment: dto.coinsEarned } }
        })
      ]);

      return { success: true, totalCoins: user.centrocoinsBalance };
    } catch (e) {
      throw new HttpException('Erro ao realizar Check-in', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Obter saldo de moedas do usuário pelo ID' })
  async getUser(@Param('id') userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, centrocoinsBalance: true }
    });
    if (!user) throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    return user;
  }
}
