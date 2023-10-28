import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://192.168.159.25:3000",
      "http://192.168.59.185:3000"
    ],
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.use(
    session({
      secret: "mjw",
      rolling: true,
      cookie: {
        maxAge: 60000,
      },
      saveUninitialized: true,
      resave: true
    })
  )
  await app.listen(8080);
}

bootstrap();
