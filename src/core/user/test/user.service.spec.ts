import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '@prisma/client';

jest.mock('../../../utils/convertDateToTimeZone', () => ({
  convertDateToTimeZone: jest.fn().mockImplementation((date, tz) => {
    // Aqui podemos retornar sempre uma string fixa ou simulada
    return `2025-01-16T09:40:18-03:00`;
  }),
}));

// Importa a função mockada para poder avaliar se foi chamada, etc.
import { UserService } from '../user.service';
import { convertDateToTimeZone } from '../../../utils/convertDateToTimeZone';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  // Criamos um mock para o PrismaService
  // Precisamos apenas dos métodos que o UserService usa: user.create, user.findUnique, user.findMany
  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock, // injetamos o mock
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    // Limpar contadores e implementações dos mocks a cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('deve criar usuário e retornar objeto com id, email e data formatada', async () => {
      const dto = { name: 'Karl', email: 'karl@example.com', password: '123456' };
      const clientTimeZone = 'America/Sao_Paulo';

      // Simulamos o prisma.user.create
      // Repare que 'created_at' é Date (ou string). Vamos usar a data atual como exemplo
      const mockCreatedUser: User = {
        id: 1,
        name: 'Karl',
        email: 'karl@example.com',
        password: 'hashedpass',
        created_at: new Date('2025-01-16T12:00:00Z'),
      };

      prismaMock.user.create.mockResolvedValueOnce(mockCreatedUser);

      // Act
      const result = await service.createUser(dto, clientTimeZone);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Karl',
          email: 'karl@example.com',
          // password deve ter sido "hasheado", mas aqui basta sabermos que passamos algo
        }),
      });

      // Verifica se a função de conversão de data foi chamada
      expect(convertDateToTimeZone).toHaveBeenCalledWith(mockCreatedUser.created_at, clientTimeZone);
      
      // Verifica retorno
      expect(result).toEqual({
        usuario: 1,
        email: 'karl@example.com',
        criado_em: '2025-01-16T09:40:18-03:00', 
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar usuário com data ajustada ao timezone', async () => {
      // Arrange
      const clientTimeZone = 'America/Fortaleza';
      const mockUserDb: User = {
        id: 2,
        name: 'Joao',
        email: 'joao@example.com',
        password: 'hashedpass',
        created_at: new Date('2025-01-16T12:00:00Z'),
      };

      prismaMock.user.findUnique.mockResolvedValueOnce(mockUserDb);

      // Act
      const result = await service.findOne(2, clientTimeZone);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(convertDateToTimeZone).toHaveBeenCalledWith(mockUserDb.created_at, clientTimeZone);

      // A resposta deve conter as propriedades do mockUserDb + created_at convertido
      expect(result).toEqual({
        ...mockUserDb,
        created_at: '2025-01-16T09:40:18-03:00',
      });
    });

    it('deve retornar undefined ou erro se usuário não existe', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne(999, 'UTC')).rejects.toThrow(NotFoundException);  
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário se email existir', async () => {
      // Arrange
      const mockUserDb: User = {
        id: 10,
        name: 'Ana',
        email: 'ana@example.com',
        password: 'hashedpass',
        created_at: new Date(),
      };
      prismaMock.user.findUnique.mockResolvedValueOnce(mockUserDb);

      // Act
      const result = await service.findByEmail({ email: 'ana@example.com' });

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'ana@example.com' } });
      expect(result).toEqual(mockUserDb);
    });

    it('deve retornar undefined se email não existir', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValueOnce(undefined);

      // Act
      const result = await service.findByEmail({ email: 'inexistente@example.com' });

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários, datas ajustadas ao timezone', async () => {
      // Arrange
      const clientTimeZone = 'America/Sao_Paulo';
      const mockUsersDb: User[] = [
        {
          id: 1,
          name: 'Karl',
          email: 'karl@example.com',
          password: 'hashed',
          created_at: new Date('2025-01-16T12:00:00Z'),
        },
        {
          id: 2,
          name: 'Joao',
          email: 'joao@example.com',
          password: 'hashed2',
          created_at: new Date('2025-01-16T15:00:00Z'),
        },
      ];
      prismaMock.user.findMany.mockResolvedValueOnce(mockUsersDb);

      // Act
      const result = await service.findAll(clientTimeZone);

      // Assert
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
      expect(convertDateToTimeZone).toHaveBeenCalledTimes(mockUsersDb.length); // duas vezes
      // Verifica se o retorno mapeou as datas corretamente
      expect(result).toEqual([
        {
          ...mockUsersDb[0],
          created_at: '2025-01-16T09:40:18-03:00',
        },
        {
          ...mockUsersDb[1],
          created_at: '2025-01-16T09:40:18-03:00',
        },
      ]);
    });
  });
});
