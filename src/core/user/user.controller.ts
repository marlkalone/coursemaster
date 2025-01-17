import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { CreateUserApiResponseDto } from './dto/create-user-response.dto';
import { GetUserResponseDto } from './dto/user-with-enrollments.response.dto';
import { GetUserApiResponseDto } from './dto/get-user-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Rota para cadastrar um usuário',
    description: `
    Esta rota permite cadastrar um novo usuário na plataforma.
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
    description: 'Cria um novo usuário com as informações enviadas',
    type: CreateUserApiResponseDto,
  })
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

  @ApiOperation({
    summary: 'Rota para buscar um usuário pelo ID',
    description: `
    Esta rota permite buscar um usuário a partir do seu ID.
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
    description: 'Busca um usuário pelo ID e retorna todas as suas informações',
    type: GetUserApiResponseDto,
  })
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
