import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from './course-response.dto';

export class CreateCourseApiResponseDto {
  @ApiProperty({ example: 'Operação realizada com sucesso.' })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ type: [CourseResponseDto] })
  data: CourseResponseDto;
}
