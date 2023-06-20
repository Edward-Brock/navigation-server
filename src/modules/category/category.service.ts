import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>
  ) {
  }

  create(createCategoryDto: CreateCategoryDto) {
    const category = new CategoryEntity();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    category.pid = createCategoryDto.pid;
    return this.categoryEntityRepository.save(category);
  }

  findAll() {
    return this.categoryEntityRepository.find();
  }

  findOne(id: number) {
    return this.categoryEntityRepository.findOneBy({ id });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    updateCategoryDto.update_time = new Date();
    return this.categoryEntityRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    let del_info = await this.categoryEntityRepository.findOneBy({ id });
    del_info.del_flag = true;
    del_info.delete_time = new Date();
    return {
      code: 200,
      state: "success",
      message: "分类信息删除成功"
    };
  }
}
