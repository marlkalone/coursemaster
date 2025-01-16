import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from '../course.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { Course } from '@prisma/client';

// Mock da função convertDateToTimeZone
jest.mock('../../../utils/convertDateToTimeZone', () => ({
  convertDateToTimeZone: jest.fn().mockImplementation((date, tz) => {
    // Data mockada para os testes
    return '2025-01-16T09:40:18-03:00';
  }),
}));

import { convertDateToTimeZone } from '../../../utils/convertDateToTimeZone';

// Mock do PrismaService
const prismaMock = {
  course: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um curso e retornar o objeto com data formatada', async () => {
      const dto = {
        title: 'Node.js Avançado',
        description: 'Um curso sobre tópicos avançados de Node.js',
        hours: 60,
      };
      const clientTimeZone = 'America/Sao_Paulo';

      const mockCreatedCourse: Course = {
        id: 1,
        title: 'Node.js Avançado',
        description: 'Um curso sobre tópicos avançados de Node.js',
        hours: 60,
        created_at: new Date('2025-01-16T12:00:00Z'),
      };
      prismaMock.course.create.mockResolvedValueOnce(mockCreatedCourse);

      const result = await service.create(dto, clientTimeZone);

      expect(prismaMock.course.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.course.create).toHaveBeenCalledWith({
        data: dto,
      });

      expect(convertDateToTimeZone).toHaveBeenCalledWith(
        mockCreatedCourse.created_at,
        clientTimeZone,
      );

      expect(result).toEqual({
        ...mockCreatedCourse,
        created_at: '2025-01-16T09:40:18-03:00',
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de cursos com datas formatadas', async () => {
      const clientTimeZone = 'America/Fortaleza';
      const mockCoursesDb: Course[] = [
        {
          id: 1,
          title: 'Node.js Avançado',
          description: 'Curso top',
          hours: 60,
          created_at: new Date('2025-01-16T12:00:00Z'),
        },
        {
          id: 2,
          title: 'NestJS Básico',
          description: 'Curso introdutório NestJS',
          hours: 40,
          created_at: new Date('2025-01-16T15:00:00Z'),
        },
      ];
      prismaMock.course.findMany.mockResolvedValueOnce(mockCoursesDb);

      const result = await service.findAll(clientTimeZone);

      expect(prismaMock.course.findMany).toHaveBeenCalledTimes(1);
      // Verifica se a função convertDateToTimeZone foi chamada para cada curso
      expect(convertDateToTimeZone).toHaveBeenCalledTimes(mockCoursesDb.length);

      // Verifica se o retorno mapeou as datas
      expect(result).toEqual([
        {
          ...mockCoursesDb[0],
          created_at: '2025-01-16T09:40:18-03:00',
        },
        {
          ...mockCoursesDb[1],
          created_at: '2025-01-16T09:40:18-03:00',
        },
      ]);
    });
  });
});
