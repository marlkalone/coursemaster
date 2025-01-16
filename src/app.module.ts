import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './core/user/user.module';
import { CourseModule } from './core/course/course.module';
import { EnrollmentModule } from './core/enrollment/enrollment.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './utils/response.interceptor';

@Module({
  imports: [PrismaModule, UserModule, CourseModule, EnrollmentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    }
  ],
})
export class AppModule {}
