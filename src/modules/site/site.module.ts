import { Module } from "@nestjs/common";
import { SiteService } from "./site.service";
import { SiteController } from "./site.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SiteEntity } from "./entities/site.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SiteEntity])],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService]
})
export class SiteModule {
}
