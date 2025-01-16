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
      },
    });

    const enrollment = {
      ...enrollmentdb,
      enrolled_at: await convertDateToTimeZone(enrollmentdb.enrolled_at, 'America/Sao_Paulo'),
    }

    return enrollment;
  }

  async findByUser(userId: number, clientTimeZone: string): Promise<UserEnrollments[]> {

    const enrollmentsdb = await this.prisma.user.findMany({
      include: { 
        enrollments: { 
          include: { 
            course: true 
          } 
        } 
      },
      where: { id: userId },
    });

    const enrollments = enrollmentsdb.map((user) => {
      const userCreatedAt = convertDateToTimeZone(user.created_at, clientTimeZone);

      const enrollments = user.enrollments.map((en) => {
        
        const enrollmentDate = convertDateToTimeZone(en.enrolled_at, clientTimeZone);
        const courseDate = convertDateToTimeZone(en.course.created_at, clientTimeZone);

        return {
          ...en,
          enrolled_at: enrollmentDate,
          course: {
            ...en.course,
            created_at: courseDate,
          },
        };
      });

      return {
        ...user,
        created_at: userCreatedAt,
        enrollments,
      };
    });

    return enrollments;
  }
}
