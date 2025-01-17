import { ApiProperty } from "@nestjs/swagger";

export class CourseResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
  
    @ApiProperty({ example: 'Nodejs Avançado' })
    title: string;
  
    @ApiProperty({
      example:
        'Este curso avançado explora tópicos complexos do Node.js, como escalabilidade, clusters, streams...',
    })
    description: string;
  
    @ApiProperty({ example: 60 })
    hours: number;
  
    @ApiProperty({ example: '2025-01-17T08:22:20-03:00' })
    created_at: string;
  }