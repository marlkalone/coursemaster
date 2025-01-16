import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateEnrollmentDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    course_id: number;
}
