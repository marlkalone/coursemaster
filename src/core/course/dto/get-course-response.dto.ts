import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from './course-response.dto';

export class GetCoursesApiResponseDto {
  @ApiProperty({ example: 'Operação realizada com sucesso.' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: [CourseResponseDto] })
  data: CourseResponseDto[];
}
