import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '@prisma/client';

jest.mock('../../../utils/convertDateToTimeZone', () => ({
  convertDateToTimeZone: jest.fn().mockImplementation((date, tz) => {
    // Aqui podemos retornar sempre uma string fixa ou simulada
    return `2025-01-16T05:00:00-03:00`;
  }),
}));

// Importa a função mockada para poder avaliar se foi chamada, etc.
import { UserService } from '../user.service';
import { convertDateToTimeZone } from '../../../utils/convertDateToTimeZone';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

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
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('deve criar usuário e retornar objeto formatado sem a senha', async () => {
      const dto = { name: 'Karl', email: 'karl@example.com', password: '123456' };
      const clientTimeZone = 'America/Sao_Paulo';

      const mockCreatedUser: User = {
        id: 1,
        name: 'Karl',
        email: 'karl@example.com',
        password: 'hashedpass',
        created_at: new Date('2025-01-16T08:00:00Z'),
      };

      prismaMock.user.create.mockResolvedValueOnce(mockCreatedUser);

      const result = await service.createUser(dto, clientTimeZone);

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Karl',
          email: 'karl@example.com',
        }),
      });

      expect(convertDateToTimeZone).toHaveBeenCalledWith(
        mockCreatedUser.created_at,
        clientTimeZone,
      );

      expect(result).toEqual({
        id: 1,
        email: 'karl@example.com',
        name: 'Karl',
        created_at: '2025-01-16T05:00:00-03:00',
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar usuário com matrículas formatadas e datas ajustadas', async () => {
      const clientTimeZone = 'America/Fortaleza';
      const mockUserDb = {
        id: 2,
        name: 'Joao',
        email: 'joao@example.com',
        password: 'hashedpass',
        created_at: new Date('2025-01-16T08:00:00Z'),
        enrollments: [
          {
            id: 10,
            enrolled_at: new Date('2025-01-16T08:00:00Z'),
            course: {
              id: 20,
              title: 'Node.js Avançado',
              description: 'Curso Avançado',
              hours: 60,
              created_at: new Date('2025-01-16T08:00:00Z'),
            },
          },
        ],
      };

      prismaMock.user.findUnique.mockResolvedValueOnce(mockUserDb);

      const result = await service.findOne(2, clientTimeZone);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
        include: {
          enrollments: {
            include: { course: true },
          },
        },
      });

      expect(result).toEqual({
        id: 2,
        name: 'Joao',
        email: 'joao@example.com',
        created_at: '2025-01-16T05:00:00-03:00',
        enrollments: [
          {
            id: 10,
            enrolled_at: '2025-01-16T05:00:00-03:00',
            course: {
              id: 20,
              title: 'Node.js Avançado',
              description: 'Curso Avançado',
              hours: 60,
              created_at: '2025-01-16T05:00:00-03:00',
            },
          },
        ],
      });
    });

    it('deve lançar NotFoundException se usuário não for encontrado', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne(999, 'UTC')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário se email existir', async () => {
      const mockUserDb: User = {
        id: 10,
        name: 'Ana',
        email: 'ana@example.com',
        password: 'hashedpass',
        created_at: new Date(),
      };
      prismaMock.user.findUnique.mockResolvedValueOnce(mockUserDb);

      const result = await service.findByEmail({ email: 'ana@example.com' });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'ana@example.com' },
      });
      expect(result).toEqual(mockUserDb);
    });

    it('deve retornar undefined se email não existir', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(undefined);

      const result = await service.findByEmail({ email: 'inexistente@example.com' });

      expect(result).toBeUndefined();
    });
  });
});
