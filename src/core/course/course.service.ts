import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { convertDateToTimeZone } from '../../utils/convertDateToTimeZone';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, clientTimeZone: string): Promise<{}> {
    const coursedb = await this.prisma.course.create({
      data: createCourseDto,
    }) as Course;
    
    const date = await convertDateToTimeZone(coursedb.created_at, clientTimeZone);

    const course = {
      ...coursedb,
      created_at: date
    }

    return course
    
  }

  async findAll(clientTimeZone: string) {
    const coursesdb = await this.prisma.course.findMany() as Course[];

    return coursesdb.map((course) => ({
      ...course,
      created_at: convertDateToTimeZone(course.created_at, clientTimeZone),
    }));
  }
}
