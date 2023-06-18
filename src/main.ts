import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.urlencoded({ extended: true }));
  app.enableCors();
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get("SERVER_PORT");
  await app.listen(port);
  console.log(`
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  Navigation Server 服务已启动：http://localhost:${port}
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  `);
}

bootstrap();
