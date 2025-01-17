import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from '../enrollment.service';
import { PrismaService } from '../../../prisma/prisma.service';

jest.mock('../../../utils/convertDateToTimeZone', () => ({
  convertDateToTimeZone: jest.fn().mockImplementation((date, tz) => {
    return `2025-01-16T05:00:00-03:00`;
  }),
}));

describe('EnrollmentService', () => {
  let service: EnrollmentService;

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
      findMany: jest.fn(),
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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma matrícula e retornar o formato correto', async () => {
      const dto = { user_id: 1, course_id: 10 };
      const clientTimeZone = 'America/Sao_Paulo';

      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1 });
      prismaMock.course.findUnique.mockResolvedValueOnce({ id: 10 });

      const mockEnrollment = {
        id: 100,
        user_id: 1,
        course_id: 10,
        enrolled_at: new Date('2025-01-16T08:00:00Z'),
        user: {
          id: 1,
          name: 'Karl',
          email: 'karl@example.com',
          created_at: new Date('2025-01-15T08:00:00Z'),
        },
        course: {
          id: 10,
          title: 'Node.js Avançado',
          description: 'Curso Avançado',
          hours: 60,
          created_at: new Date('2025-01-16T08:00:00Z'),
        },
      };

      prismaMock.enrollment.create.mockResolvedValueOnce(mockEnrollment);

      const result = await service.create(dto, clientTimeZone);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaMock.course.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
      expect(prismaMock.enrollment.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          course_id: 10,
        },
        include: { course: true, user: true },
      });

      expect(result).toEqual({
        enrollment: {
          id: 100,
          enrolled_at: '2025-01-16T05:00:00-03:00',
          user: {
            id: 1,
            name: 'Karl',
            email: 'karl@example.com',
            created_at: '2025-01-16T05:00:00-03:00',
          },
          course: {
            id: 10,
            title: 'Node.js Avançado',
            description: 'Curso Avançado',
            hours: 60,
            created_at: '2025-01-16T05:00:00-03:00',
          },
        },
      });
    });
  });

  describe('findByUser', () => {
    it('deve retornar matrículas no formato correto', async () => {
      const userId = 1;
      const clientTimeZone = 'America/Sao_Paulo';

      const mockEnrollments = [
        {
          id: 1,
          user_id: 1,
          course_id: 10,
          enrolled_at: new Date('2025-01-16T08:00:00Z'),
          user: {
            id: 1,
            name: 'Karl',
            email: 'karl@example.com',
            created_at: new Date('2025-01-15T08:00:00Z'),
          },
          course: {
            id: 10,
            title: 'Node.js Avançado',
            description: 'Curso Avançado',
            hours: 60,
            created_at: new Date('2025-01-16T08:00:00Z'),
          },
        },
      ];

      prismaMock.enrollment.findMany.mockResolvedValueOnce(mockEnrollments);

      const result = await service.findByUser(userId, clientTimeZone);

      expect(prismaMock.enrollment.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: { course: true, user: true },
      });

      expect(result).toEqual([
        {
          enrollment: {
            id: 1,
            enrolled_at: '2025-01-16T05:00:00-03:00',
            user: {
              id: 1,
              name: 'Karl',
              email: 'karl@example.com',
              created_at: '2025-01-16T05:00:00-03:00',
            },
            course: {
              id: 10,
              title: 'Node.js Avançado',
              description: 'Curso Avançado',
              hours: 60,
              created_at: '2025-01-16T05:00:00-03:00',
            },
          },
        },
      ]);
    });
  });
});
