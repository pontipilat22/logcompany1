import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Swagger API documentation
    const config = new DocumentBuilder()
        .setTitle('LogComp API')
        .setDescription('Система управления логистикой')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Авторизация')
        .addTag('orders', 'Заявки на перевозку')
        .addTag('users', 'Пользователи')
        .addTag('locations', 'Адреса и точки')
        .addTag('documents', 'Документы')
        .addTag('tracking', 'GPS трекинг')
        .addTag('warehouse', 'Управление складом')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 LogComp API running on http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
