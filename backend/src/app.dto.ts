import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class ChatDto {
  @ApiProperty({ example: 'Onde tem panela?', description: 'Texto do usuário enviado no chat' })
  @IsString()
  message: string;
  
  @ApiProperty({ example: 'uuid-do-usuario', description: 'ID único do usuário logado' })
  @IsString()
  userId: string;
}

export class CheckInDto {
  @ApiProperty({ example: 'uuid-do-usuario' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'Loja do Seu João' })
  @IsString()
  location: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  coinsEarned: number;
}
