import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { User } from '@prisma/client';
import { convertDateToTimeZone } from '../../utils/convertDateToTimeZone';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto, clientTimeZone: string): Promise<{}> {
    const data = {
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    }

    const usuario = await this.prisma.user.create({
      data,
    }) as User;

    const date = await convertDateToTimeZone(usuario.created_at, clientTimeZone);

    const user = {
      usuario: usuario.id,
      email: usuario.email,
      criado_em: date,
    }

    return user;
  }

  async findOne(id: number, clientTimeZone: string): Promise<{} | null>{
    const userdb = await this.prisma.user.findUnique({ where: { id } }) as User;

    if(!userdb) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user = {
      ...userdb,
      created_at: await convertDateToTimeZone(userdb.created_at, clientTimeZone)
    }

    return user;
  }

  async findByEmail(findByEmail: FindByEmailDto): Promise<User | void>  {
    const email = findByEmail.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  async findAll(clientTimeZone: string) {
    const users = await this.prisma.user.findMany() as User[];

    return users.map((user) => ({
      ...user,
      created_at: convertDateToTimeZone(user.created_at, clientTimeZone),
    }));
  }

  private async hashPassword(password: string): Promise<string>{
    return await bcrypt.hash(password, 10)
  }
}
