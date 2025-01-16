import { IsEmail, IsNotEmpty } from "class-validator";

export class FindByEmailDto{
    @IsNotEmpty()
    @IsEmail({}, { message: 'Enter a valid email' })
    email: string
}