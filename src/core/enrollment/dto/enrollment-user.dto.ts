import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentUserDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'Usuário Teste' })
  name: string;

  @ApiProperty({ example: 'teste2@gmail.com' })
  email: string;

  @ApiProperty({ example: '2025-01-17T08:18:22-03:00' })
  created_at: string;
}
