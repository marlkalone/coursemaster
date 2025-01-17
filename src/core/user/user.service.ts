import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { convertDateToTimeZone } from '../../utils/convertDateToTimeZone';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto, clientTimeZone: string): Promise<{}> {
    const data = {
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    }

    const userdb = await this.prisma.user.create({
      data,
    }) as User;

    const date = await convertDateToTimeZone(userdb.created_at, clientTimeZone);

    const user = {
      id: userdb.id,
      email: userdb.email,
      name: userdb.name,
      created_at: date,
    }

    return user;
  }

  async findOne(id: number, clientTimeZone: string): Promise<{} | null>{
    const userdb = await this.prisma.user.findUnique({ 
      where: { id }, 
      include: { 
        enrollments: { 
          include: { 
            course: true 
          } 
        } 
      },
      omit: { password: true } 
      //Por segurança, as senhas são omitidas
    });

    if(!userdb) {
      throw new NotFoundException(`Usuário com o ID ${id} não encontrado`);
    }

    const userCreatedAt = convertDateToTimeZone(userdb.created_at, clientTimeZone);

    const enrollments = userdb.enrollments.map((enrollment) => {
      const enrollmentDate = convertDateToTimeZone(enrollment.enrolled_at, clientTimeZone);
      const courseCreatedAt = convertDateToTimeZone(enrollment.course.created_at, clientTimeZone);

      return {
        ...enrollment,
        enrolled_at: enrollmentDate,
        course: {
          ...enrollment.course,
          created_at: courseCreatedAt,
        },
      };
    });

    return {
      ...userdb,
      created_at: userCreatedAt,
      enrollments,
    };
  }

  async findByEmail(findByEmail: FindByEmailDto): Promise<User | void>  {
    const email = findByEmail.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  private async hashPassword(password: string): Promise<string>{
    return await bcrypt.hash(password, 10)
  }
}
