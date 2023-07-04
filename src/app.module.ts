import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SiteModule } from "./modules/site/site.module";
import { CategoryModule } from "./modules/category/category.module";
import { DeviceGateway } from "./modules/device/device.gateway";
import { OptionModule } from "./modules/option/option.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.development", ".env.production"]
    }),
    TypeOrmModule.forRootAsync({
      // 引入
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql", // 数据库类型
        host: configService.get("DB_HOST", "localhost"), // 主机，默认为localhost
        port: configService.get<number>("DB_PORT", 3306), // 端口号
        username: configService.get("DB_USERNAME", "root"), // 用户名
        password: configService.get("DB_PASSWORD", "123456"), // 密码
        database: configService.get("DB_DATABASE", "test"), // 数据库名
        timezone: "+08:00", // 服务器上配置的时区
        synchronize: true, // 根据实体自动创建数据库表， 生产环境建议关闭
        // entities: ['dist/**/*.entity{ .ts,.js}'], // 数据表实体
        autoLoadEntities: true
      })
    }),
    SiteModule,
    CategoryModule,
    OptionModule
  ],
  controllers: [AppController],
  providers: [AppService, DeviceGateway]
})
export class AppModule {
}
