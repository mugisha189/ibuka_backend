import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, IAppConfig, SwaggerConfig } from './config';
import { LoggerService } from './shared/logger/logger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import validationOptions from './common/validator/options.validator';
import * as compression from 'compression';
import * as helmet from 'helmet';
import cluster from 'cluster';
import { HttpExceptionFilter } from './common/http/http-exception.filter';

process.removeAllListeners('warning');
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: false,
    });

    const configService = app.get(ConfigService<ConfigKeyPaths>);
    const { apiPrefix, port } = configService.get<IAppConfig>('app');
    app.use(helmet());
    app.use(compression());
    app.enableCors({
      origin: '*', // Allow all origins
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow all HTTP methods
      allowedHeaders: '*', // Allow all headers
      credentials: true, // Enable cookies (optional)
    });
    app.enableVersioning();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe(validationOptions));
    app.setGlobalPrefix(apiPrefix);
    SwaggerConfig(app, configService);
    try {
      await app.listen(port, async () => {
        app.useLogger(app.get(LoggerService));
        const url = await app.getUrl();
        const { pid } = process;
        const env = cluster?.isPrimary;
        const prefix = env ? 'P' : 'W';
        const logger = new Logger('NestApplication');
        logger.log(`[${prefix + pid}] Server running on ${url}`);
      });
    } catch (error) {
      console.error('Error during app.listen:', error);
    }
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}

bootstrap();
