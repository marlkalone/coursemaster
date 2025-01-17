import { ApiProperty } from '@nestjs/swagger';
import { CreateEnrollmentResponseDto } from './enrollment.dto';

export class GetUserEnrollmentApiResponseDto {
  @ApiProperty({ example: 'Operação realizada com sucesso.' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: [CreateEnrollmentResponseDto] })
  data: [CreateEnrollmentResponseDto];
}
