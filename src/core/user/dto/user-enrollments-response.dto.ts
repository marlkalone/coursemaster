import { ApiProperty } from "@nestjs/swagger";
import { UserCourseResponseDto } from "./user-course-response.dto";

export class UserEnrollmentsResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
  
    @ApiProperty({ example: 1 })
    user_id: number;
  
    @ApiProperty({ example: 2 })
    course_id: number;

    @ApiProperty({ example: '2025-01-17T08:22:20-03:00' })
    enrolled_at: string;

    @ApiProperty({ type: [UserCourseResponseDto] })
    course: UserCourseResponseDto;
  }