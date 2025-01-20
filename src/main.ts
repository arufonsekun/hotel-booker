import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Hotel Booker API')
    .setDescription('The Hotel Booker API description')
    .setVersion('1.0.0')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // transform request payload into DTOs
      whitelist: true, // drop any adicional properties not includes in DTO
      forbidNonWhitelisted: true, // return an error when a non-whitelisted property is found
    }),
  );

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
