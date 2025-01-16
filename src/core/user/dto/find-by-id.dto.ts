import { IsNotEmpty, IsNumber } from "class-validator";

export class FindByIdDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number
}