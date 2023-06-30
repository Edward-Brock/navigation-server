import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.urlencoded({ extended: true }));
  app.enableCors();
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const http_port = configService.get("SERVER_PORT");
  const wss_port = configService.get("WEBSOCKET_SERVER_PORT");
  await app.listen(http_port);
  console.log(`
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  Navigation Server HTTP 服务已启动：http://localhost:${http_port}
  Navigation Server WebSocket 服务已启动：http://localhost:${wss_port}
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  `);
}

bootstrap();
