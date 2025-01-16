import { Controller, Get, Post, Body, Headers, Param } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

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