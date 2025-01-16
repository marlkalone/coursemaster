import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from '../enrollment.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

// Mock da função convertDateToTimeZone
jest.mock('../../../utils/convertDateToTimeZone', () => ({
  convertDateToTimeZone: jest.fn().mockImplementation((date, tz) => {
    // Podemos retornar algo dinâmico ou fixo
    return `mocked-date-${tz}`;
  }),
}));

import { convertDateToTimeZone } from '../../../utils/convertDateToTimeZone';

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  // Criamos um mock para o PrismaService
  // Precisamos dos métodos usados pelo service:
  // 1) user.findUnique (para verificar usuário)
  // 2) course.findUnique (para verificar curso)
  // 3) enrollment.create (para criar matrícula)
  // 4) user.findMany (para findByUser)
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    course: {
      findUnique: jest.fn(),
    },
    enrollment: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);

    // Limpa chamadas anteriores a cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma matrícula se user e course existem', async () => {
      const dto = { user_id: 1, course_id: 10 };
      const clientTimeZone = 'America/Sao_Paulo';

      // Simulamos que o usuário e o curso existem
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1 });
      prismaMock.course.findUnique.mockResolvedValueOnce({ id: 10 });

      // Simulamos a matrícula criada
      const mockEnrollment = {
        id: 100,
        user_id: 1,
        course_id: 10,
        enrolled_at: new Date('2025-01-16T12:00:00Z'),
      };
      prismaMock.enrollment.create.mockResolvedValueOnce(mockEnrollment);

      // Act
      const result = await service.create(dto, clientTimeZone);

      // Assert
      // Verifica se buscamos corretamente user e course
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.course.findUnique).toHaveBeenCalledWith({
        where: { id: 10 },
      });

      // Verifica se criamos a enrollment
      expect(prismaMock.enrollment.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          course_id: 10,
        },
      });

      // Verifica se houve chamada à função de conversão de data
      expect(convertDateToTimeZone).toHaveBeenCalledWith(
        mockEnrollment.enrolled_at,
        'America/Sao_Paulo',
      );

      // Verifica o retorno final
      expect(result).toEqual({
        ...mockEnrollment,
        enrolled_at: 'mocked-date-America/Sao_Paulo',
      });
    });

    it('deve lançar NotFoundException se o usuário não existir', async () => {
      // Arrange
      const dto = { user_id: 999, course_id: 10 };
      prismaMock.user.findUnique.mockResolvedValueOnce(null); // user não existe

      // Act & Assert
      await expect(service.create(dto, 'America/Sao_Paulo')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar NotFoundException se o curso não existir', async () => {
      // Arrange
      const dto = { user_id: 1, course_id: 999 };
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1 }); // user existe
      prismaMock.course.findUnique.mockResolvedValueOnce(null); // course não existe

      // Act & Assert
      await expect(service.create(dto, 'America/Sao_Paulo')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUser', () => {
    it('deve retornar usuários (no caso, só 1), com enrollments convertidas', async () => {
      // Arrange
      const userId = 1;
      const clientTimeZone = 'America/Fortaleza';

      // Simulamos o prisma.user.findMany
      // Ele retorna um array de usuários, cada usuário com 'enrollments'
      // E cada enrollment com 'course'
      const mockData = [
        {
          id: 1,
          name: 'Karl',
          email: 'karl@example.com',
          password: '123',
          created_at: new Date('2025-01-16T12:00:00Z'),
          enrollments: [
            {
              id: 500,
              user_id: 1,
              course_id: 10,
              enrolled_at: new Date('2025-01-16T13:00:00Z'),
              course: {
                id: 10,
                title: 'Node.js Avançado',
                description: 'Curso Avançado',
                hours: 60,
                created_at: new Date('2025-01-16T08:00:00Z'),
              },
            },
          ],
        },
      ];

      prismaMock.user.findMany.mockResolvedValueOnce(mockData);

      // Act
      const result = await service.findByUser(userId, clientTimeZone);

      // Assert
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
        where: { id: userId },
      });

      // Verifica se cada data foi convertida
      // user.created_at
      // enrollment.enrolled_at
      // enrollment.course.created_at
      expect(convertDateToTimeZone).toHaveBeenCalledWith(
        mockData[0].created_at,
        clientTimeZone,
      );
      expect(convertDateToTimeZone).toHaveBeenCalledWith(
        mockData[0].enrollments[0].enrolled_at,
        clientTimeZone,
      );
      expect(convertDateToTimeZone).toHaveBeenCalledWith(
        mockData[0].enrollments[0].course.created_at,
        clientTimeZone,
      );

      // Monta o que esperamos como retorno
      // Lembre que nosso mock "convertDateToTimeZone" retorna "mocked-date-<tz>"
      // Então ficaria "mocked-date-America/Fortaleza" em cada data
      const expected = [
        {
          ...mockData[0],
          created_at: 'mocked-date-America/Fortaleza',
          enrollments: [
            {
              ...mockData[0].enrollments[0],
              enrolled_at: 'mocked-date-America/Fortaleza',
              course: {
                ...mockData[0].enrollments[0].course,
                created_at: 'mocked-date-America/Fortaleza',
              },
            },
          ],
        },
      ];

      expect(result).toEqual(expected);
    });
  });
});
