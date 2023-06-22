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
   * 获取所有分类下的各网站信息
   * .innerJoinAndSelect() 如果没有任何数据将不会返回本身信息
   * .leftJoinAndSelect() 即使没有任何数据也会返回本身信息
   */
  async allData() {
    return this.categoryEntityRepository.createQueryBuilder("category")
      .innerJoinAndSelect("category.sites", "site")
      .getMany();
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
    const is_category = await this.categoryEntityRepository.findOneBy({ pid: Number(createSiteDto.category) });
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
    return this.siteEntityRepository.find();
  }

  async findOne(id: number) {
    let visit_num_info = await this.siteEntityRepository.findOneBy({ id });
    if (visit_num_info) {
      console.log(`"site.service" -> ${new Date()}触发访问了 ${visit_num_info.name} ，累计访问数：${visit_num_info.visit_num}`);
      await this.siteEntityRepository.update(id, { visit_num: visit_num_info.visit_num += 1 });
    } else {
      return {
        code: 404,
        state: "error",
        message: "网站不存在"
      };
    }
    return this.siteEntityRepository.findOneBy({ id });
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    updateSiteDto.update_time = new Date();
    return this.siteEntityRepository.update(id, updateSiteDto);
  }

  async remove(id: number) {
    let del_info = await this.siteEntityRepository.findOneBy({ id });
    del_info.del_flag = true;
    del_info.delete_time = new Date();
    return {
      code: 200,
      state: "success",
      message: "网站信息删除成功"
    };
  }
}
