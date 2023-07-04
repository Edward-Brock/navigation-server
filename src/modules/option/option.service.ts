import { Injectable } from "@nestjs/common";
import { CreateOptionDto } from "./dto/create-option.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OptionEntity } from "./entities/option.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly optionEntityRepository: Repository<OptionEntity>
  ) {
  }

  /**
   * 设置后台控制面板进入密码
   * Method: POST
   * Body: x-www-form-urlencode
   * Key: password
   * Value: Your password
   * @param body
   */
  async setPassword(body: object) {
    const salt = await bcrypt.genSalt();
    const password = body["password"];
    const hash = await bcrypt.hash(password, salt);
    console.log(hash);
    return this.update("admin_panel_password", { option_value: hash });
  }

  /**
   * 验证后台控制面板进入密码
   * Method: GET
   * @param password
   */
  async getPassword(password: string) {
    const hash = await this.findOne("admin_panel_password");
    const isMatch = await bcrypt.compare(password, hash.option_value);
    if (isMatch) {
      return {
        code: 200,
        state: "success"
      };
    } else {
      return {
        code: 404,
        state: "error",
        message: "密码验证失败"
      };
    }
  }

  create(createOptionDto: CreateOptionDto) {
    return this.optionEntityRepository.save(createOptionDto);
  }

  findAll() {
    return this.optionEntityRepository.find();
  }

  findOne(option_name: string) {
    return this.optionEntityRepository.findOneBy({ option_name });
  }

  async update(option_name: string, updateOptionDto: UpdateOptionDto) {
    const data = await this.findOne(option_name);
    return this.optionEntityRepository.update(data["option_id"], updateOptionDto);
  }

  remove(id: number) {
    return this.optionEntityRepository.delete(id);
  }
}
