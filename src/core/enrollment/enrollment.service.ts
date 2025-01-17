import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { convertDateToTimeZone } from '../../utils/convertDateToTimeZone';
import { UserEnrollments } from './entities/userEnrollments.entity';

@Injectable()
export class EnrollmentService {
  constructor (private prisma: PrismaService) {}

  async create(createEnrollmentDto: CreateEnrollmentDto, clientTimeZone: string): Promise<{}> {
    const { user_id, course_id } = createEnrollmentDto;
    
    // Verificar se o usuário e o curso existem
    const userExists = await this.prisma.user.findUnique({ where: { id: user_id } });
    const courseExists = await this.prisma.course.findUnique({ where: { id: course_id } });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    if (!courseExists) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }

    const enrollmentdb = await this.prisma.enrollment.create({
      data: {
        user_id: user_id,
        course_id: course_id,
      }, include: { course: true, user: true },
    });

    const enrollmentDate = convertDateToTimeZone(enrollmentdb.enrolled_at, clientTimeZone);
    const userCreatedAt = convertDateToTimeZone(enrollmentdb.user.created_at, clientTimeZone);
    const courseCreatedAt = convertDateToTimeZone(enrollmentdb.course.created_at, clientTimeZone);

    const enrollment = {
      enrollment: {
        id: enrollmentdb.id,
        enrolled_at: enrollmentDate,
        user: {
          id: enrollmentdb.user.id,
          name: enrollmentdb.user.name,
          email: enrollmentdb.user.email,
          created_at: userCreatedAt,
        },
        course: {
          id: enrollmentdb.course.id,
          title: enrollmentdb.course.title,
          description: enrollmentdb.course.description,
          hours: enrollmentdb.course.hours,
          created_at: courseCreatedAt,
        },
      },
    };

    return enrollment;
  }

  async findByUser(user_id: number, clientTimeZone: string): Promise<UserEnrollments[] | {}> {

    const enrollmentsDb = await this.prisma.enrollment.findMany({
      where: { user_id },
      include: { 
        course: true, 
        user: true
      },
    });

    const enrollments = enrollmentsDb.map((enrollment) => {
      const enrollmentDate = convertDateToTimeZone(enrollment.enrolled_at, clientTimeZone);
      const userCreatedAt = convertDateToTimeZone(enrollment.user.created_at, clientTimeZone);
      const courseCreatedAt = convertDateToTimeZone(enrollment.course.created_at, clientTimeZone);
  
      return {
        enrollment: {
          id: enrollment.id,
          enrolled_at: enrollmentDate,
          user: {
            id: enrollment.user.id,
            name: enrollment.user.name,
            email: enrollment.user.email,
            created_at: userCreatedAt,
          },
          course: {
            id: enrollment.course.id,
            title: enrollment.course.title,
            description: enrollment.course.description,
            hours: enrollment.course.hours,
            created_at: courseCreatedAt,
          }
        }
      };
    });
  
    return enrollments;
  }
}
