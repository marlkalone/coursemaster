import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  imports: [PrismaModule],
})
export class EnrollmentModule {}
