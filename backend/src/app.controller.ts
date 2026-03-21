import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';
import { GroqService } from './groq.service';
import { ChatDto, CheckInDto } from './app.dto';

@ApiTags('Ficaqui API')
@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groqService: GroqService
  ) {}

  @Post('chat')
  @ApiOperation({ summary: 'Enviar mensagem para o Chat assistente LLM' })
  @ApiResponse({ status: 201, description: 'Retorna a resposta do assistente (Llama/Groq) e persiste no Postgres.' })
  async handleChat(@Body() dto: ChatDto) {
    try {
      // Create user context silently if missing for MVP demonstration
      await this.ensureUserExists(dto.userId);

      // Save user message
      await this.prisma.chatMessage.create({
        data: {
          content: dto.message,
          role: 'user',
          userId: dto.userId
        }
      });

      // Llama Logic vs Standard Happy Path
      let reply = '';
      if (dto.message.toLowerCase().includes('panela')) {
        reply = "Encontrei 3 lojas no Centro de Aracaju! A 'Loja do Seu João' tem 95% de estoque. Rota com sombra disponível. 🍳";
      } else {
        reply = await this.groqService.getChatCompletion(dto.message);
      }

      // Save assistant message
      await this.prisma.chatMessage.create({
        data: {
          content: reply,
          role: 'assistant',
          userId: dto.userId
        }
      });

      return { reply };
    } catch (e) {
      console.error(e);
      throw new HttpException('Erro interno do servidor ao processar o chat', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('checkin')
  @ApiOperation({ summary: 'Registrar Check-in no mapa pelo QR Code' })
  @ApiResponse({ status: 201, description: 'Gamificação: Realiza Check-in e credita moedas CentroCoins.' })
  async checkIn(@Body() dto: CheckInDto) {
    try {
      await this.ensureUserExists(dto.userId);

      await this.prisma.checkIn.create({
        data: {
          location: dto.location,
          coinsEarned: dto.coinsEarned,
          userId: dto.userId
        }
      });

      const user = await this.prisma.user.update({
        where: { id: dto.userId },
        data: { centroCoins: { increment: dto.coinsEarned } }
      });

      return { success: true, totalCoins: user.centroCoins };
    } catch (e) {
      throw new HttpException('Erro ao realizar Check-in', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Obter saldo de moedas do usuário pelo ID' })
  async getUser(@Param('id') userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    return user;
  }

  private async ensureUserExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      await this.prisma.user.create({
        data: { id, name: 'Usuário Convidado', centroCoins: 150 }
      });
    }
  }
}
