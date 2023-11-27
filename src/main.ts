import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigsService } from './configs/configs.service';
import { CONSTANTS } from './constants';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { server } = app.get(ConfigsService);

  // CORS
  const corsOption: CorsOptions = CONSTANTS.enableCors
    ? {
        origin: '*',
        credentials: true,
      }
    : {};

  app.enableCors(corsOption);
  app.use(cookieParser());

  // Set global prefix
  app.setGlobalPrefix(CONSTANTS.globalPrefix);

  // Validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger
  const { swagger } = CONSTANTS;
  const config = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swagger.prefix, app, document);

  // Initialize rawBody
  app.use(
    express.json({
      limit: '5mb',
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString();
      },
    }),
  );

  await app.listen(server.port);
}
bootstrap();
