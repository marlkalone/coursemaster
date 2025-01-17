import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCoursesApiResponseDto } from './dto/get-course-response.dto';
import { CreateCourseApiResponseDto } from './dto/create-course-response.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({
    summary: 'Rota para cadastrar um curso',
    description: `
    Esta rota permite cadastrar um novo curso na plataforma.
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
    description: 'Matrícula criada com sucesso.',
    type: CreateCourseApiResponseDto,
  })
  @ApiBody({
    description: 'Corpo da requisição para criar um novo curso',
    schema: {
      example: {
        title: 'Curso Nodejs Avançado',
        description: `Este curso avançado explora tópicos complexos do Node.js, como escalabilidade, clusters, streams, 
        balanceamento de carga e otimização de desempenho.`,
        hours: 60,
      },
    },
  })
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Headers('timezone') clientTimeZone: string,
  ) {

    if (!clientTimeZone) {
      clientTimeZone = 'America/Sao_Paulo';
    }

    return this.courseService.create(createCourseDto, clientTimeZone);
  }

  @ApiOperation({
    summary: 'Rota para obter todos os cursos cadastrados',
    description: `
    Esta rota retorna todos os cursos cadastrados.
    Certifique-se de enviar todos os campos obrigatórios no corpo da requisição.
    O cabeçalho "timezone" deve conter o fuso horário do cliente para ajustar datas.
    `,
  })  
  @ApiHeader({
    name: 'timezone',
    description: 'Fuso horário do cliente (ex: America/Sao_Paulo)',
    required: true,
    example: 'America/Sao_Paulo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cursos retornada com sucesso.',
    type: GetCoursesApiResponseDto,
  })
  @Get()
  async findAll(    
    @Headers('timezone') clientTimeZone: string,
  ) {

    if (!clientTimeZone) {
      clientTimeZone = 'America/Sao_Paulo';
    }

    return this.courseService.findAll(clientTimeZone);
  }
}
