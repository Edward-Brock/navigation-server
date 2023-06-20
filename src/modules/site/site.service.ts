import { Injectable } from "@nestjs/common";
import { CreateSiteDto } from "./dto/create-site.dto";
import { UpdateSiteDto } from "./dto/update-site.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SiteEntity } from "./entities/site.entity";
import { Repository } from "typeorm";
import { CategoryEntity } from "../category/entities/category.entity";

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly siteEntityRepository: Repository<SiteEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>
  ) {
  }

  /**
   * 网站添加
   * 先从分类表中查找当前 pid 是否存在
   * 不存在 - 返回报错
   * 存在 - 正常保存
   * @param createSiteDto
   */
  async create(createSiteDto: CreateSiteDto) {
    // 通过分类表查找是否存在当前分类 pid
    const is_category = await this.categoryEntityRepository.findOneBy({ pid: Number(createSiteDto.pid) });
    if (!is_category) {
      return {
        code: 404,
        state: "error",
        message: "当前分类不存在"
      };
    }
    // 对网站进行添加保存操作
    const site_info = await this.siteEntityRepository.save(createSiteDto);
    createSiteDto.create_time = new Date();
    return {
      code: 200,
      state: "success",
      message: "添加网站成功",
      site_info
    };
  }

  findAll() {
    return `This action returns all site`;
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}
