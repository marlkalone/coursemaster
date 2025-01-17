import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentCourseDto {
  @ApiProperty({ example: 2, description: 'ID do curso' })
  id: number;

  @ApiProperty({ example: 'Nodejs Basico', })
  title: string;

  @ApiProperty({
    example:
      'Este curso avançado explora tópicos complexos do Node.js, como escalabilidade, clusters, streams, balanceamento de carga e otimização de desempenho.',
  })
  description: string;

  @ApiProperty({ example: 60 })
  hours: number;

  @ApiProperty({ example: '2025-01-17T10:18:03-03:00' })
  created_at: string;
}
