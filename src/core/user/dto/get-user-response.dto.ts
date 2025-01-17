import { ApiProperty } from '@nestjs/swagger';
import { GetUserResponseDto } from './user-with-enrollments.response.dto';

export class GetUserApiResponseDto {
  @ApiProperty({ example: 'Operação realizada com sucesso.' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: GetUserResponseDto })
  data: GetUserResponseDto;
}
