import { ApiProperty } from "@nestjs/swagger";
import { UserEnrollmentsResponseDto } from "./user-enrollments-response.dto";

export class GetUserResponseDto {
    @ApiProperty({ example: 1 })
    id: number;
  
    @ApiProperty({ example: 'user@gmail.com' })
    email: string;
  
    @ApiProperty({ example:'Usuário de Teste', })
    name: string;
  
    @ApiProperty({ example: '2025-01-17T08:22:20-03:00' })
    created_at: string;

    @ApiProperty({ type: [UserEnrollmentsResponseDto] })
    enrollments: UserEnrollmentsResponseDto[];
  }