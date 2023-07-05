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
   * 记录并返回当前项目所记录的分类、网站各项总数（不包含已删除的数据）
   */
  async totalNum() {
    const categoryTotalNum = await this.categoryEntityRepository.count({
      where: { del_flag: false }
    });
    const siteTotalNum = await this.siteEntityRepository.count({
      where: { del_flag: false }
    });
    return [
      { name: "Category Total Number", value: categoryTotalNum },
      { name: "Site Total Number", value: siteTotalNum }
    ];
  }

  /**
   * 获取所有分类下的各网站信息
   * .innerJoinAndSelect() 如果没有任何数据将不会返回本身信息
   * .leftJoinAndSelect() 即使没有任何数据也会返回本身信息
   */
  async allData() {
    /**
     * 获取一级分类下所有二级分类及全部网站信息
     */
    const categoryInfo = await this.categoryEntityRepository.createQueryBuilder("category")
      .innerJoinAndSelect("category.sites", "site")
      /**
       * 过滤以下 where 查找语句条件：
       * 分类删除标记为假，分类可见性为真
       * 网站删除标记为假，网站可见性为真
       */
      .where("category.del_flag = :del_flag", { del_flag: false })
      .andWhere("category.visibility = :visibility", { visibility: true })
      .andWhere("site.del_flag = :del_flag", { del_flag: false })
      .andWhere("site.visibility = :visibility", { visibility: true })
      .getMany();

    return getTree(categoryInfo, 0, []);

    /**
     * 将分类信息内的 pid 与 id 相结合，将二级分类递归到对应一级分类下
     * @param list 需要处理的数组内容
     * @param pid 起始 pid
     * @param data 最终递归完成数组
     */
    function getTree(list, pid, data) {
      // 获取所有一级
      for (let item of list) {
        if (item.pid == pid) {
          data.push(item);
        }
      }
      // 获取子级
      for (let i of data) {
        i.second_category = [];
        getTree(list, i.id, i.second_category); // 递归调用
        if (i.second_category.length == 0) {
          delete i.second_category;
        }
      }
      return data;
    }
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
