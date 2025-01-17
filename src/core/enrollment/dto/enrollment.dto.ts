import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentCourseDto } from './enrollment-course.dto';
import { EnrollmentUserDto } from './enrollment-user.dto';

export class CreateEnrollmentResponseDto {
  @ApiProperty({ example: 4 })
  id: number;

  @ApiProperty({ example: '2025-01-17T10:23:10-03:00' })
  enrolled_at: string;

  @ApiProperty({ type: EnrollmentUserDto })
  user: EnrollmentUserDto;

  @ApiProperty({ type: EnrollmentCourseDto })
  course: EnrollmentCourseDto;
}
