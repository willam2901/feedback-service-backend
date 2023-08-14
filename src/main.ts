import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cowsay from 'cowsay';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from './app/utils/validation-options';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // try {
  //   const microservice = await NestFactory.createMicroservice(AppModule, {
  //     name: 'FEEDBACK_SERVICE',
  //     transport: Transport.REDIS,
  //     options: {
  //       url: `${process.env.REDIS_URL}`,
  //     },
  //   });
  //   await microservice.listen();
  // } catch (e) {
  //   console.log(e);
  // }

  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        host: '178.128.220.73',
        port: 6379,
      },
    });
  await microserviceApp.listen();

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get('app.prefix'), {
    exclude: ['/'],
  });

  const options = new DocumentBuilder()
    .setTitle(config.get('app.name'))
    .setDescription(config.get('app.description'))
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('app.doc'), app, document);

  /**
   * Validation Pipe for formatting validation error
   */
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  /**
   * Enable cookie parser
   */
  app.use(cookieParser());

  /**
   * Enable cors
   */
  app.enableCors({
    origin: true,
    credentials: true,
  });

  /**
   * boot the app porting the config.port
   */
  const port = config.get('app.port');
  await app.listen(port);
  // await repl(AppModule);

  /**
   * Print the application name and environment.
   */
  const appUrl = config.get('app.url');
  const docSuffix = config.get('app.doc');
  const say = cowsay.say({
    text: `App is running at ${appUrl} | Doc: ${appUrl}/${docSuffix}`,
  });
  console.log(say);
}
bootstrap();
