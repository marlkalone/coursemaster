import { Controller, Get, Post, Body, Headers, Param } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEnrollmentApiResponseDto } from './dto/create-enrollment-response.dto';
import { GetUserEnrollmentApiResponseDto } from './dto/get-user-enrollments-response.dto';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @ApiOperation({
    summary: 'Rota para matricular um usuário em um curso',
    description: `
    Esta rota permite matricular um usuário em um curso a partir do id de ambos.
    Certifique-se de enviar todos os campos obrigatórios no corpo da requisição.
    O cabeçalho "timezone" deve conter o fuso horário do cliente para ajustar datas.
    `,
  })  
  @ApiHeader({
    name: 'timezone',
    description: `
    Fuso horário do cliente (ex: America/Sao_Paulo)
    Headers: { "timezone": "America/Sao_Paulo" }
    `,
    required: true,
    example: 'America/Sao_Paulo',
  })
  @ApiResponse({
    status: 201,
    description: 'Matricula um usuario em um curso',
    type: CreateEnrollmentApiResponseDto,
  })
  @Post()
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @Headers('timezone') clientTimeZone: string,
  ) {

    if (!clientTimeZone) {
      clientTimeZone = 'America/Sao_Paulo';
    }

    return await this.enrollmentService.create(createEnrollmentDto, clientTimeZone);
  }

  @ApiOperation({
    summary: 'Rota para obter as matrículas de um usuário',
    description: `
    Esta rota retorna as matrículas de um determinado usuário através do seu id.
    Certifique-se de enviar todos os campos obrigatórios no corpo da requisição.
    O cabeçalho "timezone" deve conter o fuso horário do cliente para ajustar datas.
    `,
  })  
  @ApiHeader({
    name: 'timezone',
    description: `
    Fuso horário do cliente (ex: America/Sao_Paulo)
    Headers: { "timezone": "America/Sao_Paulo" }
    `,
    required: true,
    example: 'America/Sao_Paulo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista as matrículas de um usuário através do ID',
    type: GetUserEnrollmentApiResponseDto,
  })
  @Get(':id')
  async findByUser(
    @Param('id') id: string,
    @Headers('timezone') clientTimeZone: string,
  ) {

    if (!clientTimeZone) {
      clientTimeZone = 'America/Sao_Paulo';
    }

    return await this.enrollmentService.findByUser(+id, clientTimeZone);
  }
}