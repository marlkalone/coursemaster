import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { customCss } from './utils/cssDocs';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIGURAÇÃO DO SWAGGER
  const config = new DocumentBuilder()
  .setTitle('Course Master API')
  .setDescription('Documentação da API')
  .setVersion('0.0.1')
  .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',apiReference({
      theme: 'purple',
      darkMode: false,
      hideModels: true,
      hideDownloadButton: true,
      spec: {
        content: document,
      },
      customCss: customCss,
  }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, api-key',
    credentials: true
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();