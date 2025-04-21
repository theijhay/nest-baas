import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BackendValidationPipe } from './pipes/backend-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new BackendValidationPipe());

  // Use Helmet for security protection
  app.use(helmet());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Nest BaaS API')
    .setDescription('API documentation for nest-baas')
    .setVersion('1.0')
    .addBearerAuth({
      type: "http",
      scheme: "Bearer",
      bearerFormat: "JWT",
      description: "Enter JWT auth token",
      in: "header",
    })
    .addTag("Nest BaaS docs")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  const PORT = Number(process.env.PORT) || 3000;
  const nodeEnv = process.env.NODE_ENV || "development";

  await app.listen(PORT, () =>
    console.log(`Application running in ${nodeEnv} mode on port ${PORT}`)
  );
}

bootstrap();
