import { ApiProperty } from '@nestjs/swagger';
import { CreateEnrollmentResponseDto } from './enrollment.dto';

export class CreateEnrollmentApiResponseDto {
  @ApiProperty({ example: 'Operação realizada com sucesso.' })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ type: CreateEnrollmentResponseDto })
  data: CreateEnrollmentResponseDto;
}
