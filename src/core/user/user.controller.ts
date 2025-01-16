import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FindByEmailDto } from './dto/find-by-email.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Rota para cadastrar usuários' })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Headers('timezone') clientTimeZone: string,
  ): Promise<{}> {
    const findByEmailDto: FindByEmailDto = { email: createUserDto.email };
    
    const emailExists = await this.userService.findByEmail(findByEmailDto);

    if (emailExists) {
        throw new ConflictException('Email already exists');
    }

    if (!clientTimeZone) {
      clientTimeZone = 'America/Sao_Paulo';
    }
  
    return this.userService.createUser(createUserDto, clientTimeZone);

  }

  @ApiOperation({summary: 'Rota para obter um usuário pelo id'})
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('timezone') clientTimeZone: string
  ) {
    
    if (!clientTimeZone) {
      clientTimeZone = 'America/Sao_Paulo';
    }

    return this.userService.findOne(+id, clientTimeZone);
  }
}
