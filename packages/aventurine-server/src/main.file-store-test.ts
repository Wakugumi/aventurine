import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiExceptionFilter } from './engine/filters/api-exception.filter';
import { TypeOrmExceptionFilter } from './engine/filters/typeorm-exception.filter';
import { ApiResponseInterceptor } from './engine/interceptors/api-response.interceptor';
import { FileStoreTestAppModule } from './file-store-test-app.module';

async function bootstrap() {
  const app = await NestFactory.create(FileStoreTestAppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalFilters(new TypeOrmExceptionFilter());

  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const swagger = new DocumentBuilder()
    .setTitle('Aventurine File Store Test API')
    .setDescription('Standalone app for testing storage and file-store module')
    .setVersion('1.0')
    .addTag('file-store-test')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
