import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Enter a valid email' })
    readonly email: string;

    @IsString()
    @MinLength(5, { message: 'A senha deve ter ao menos 5 caractéres' })
    @MaxLength(20, { message: 'A senha deve ter no máximo 20 caractéres' })
    @Matches(/^.*$/)
    readonly password: string;
    
}