import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Rota para cadastrar um curso' })
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

  @ApiOperation({ summary: 'Rota para obter todos os cursos cadastrados' })
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
