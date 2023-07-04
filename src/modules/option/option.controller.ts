import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { OptionService } from "./option.service";
import { CreateOptionDto } from "./dto/create-option.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";

@Controller("option")
export class OptionController {
  constructor(private readonly optionService: OptionService) {
  }

  @Post("/setPassword")
  setPassword(@Body() body: object) {
    return this.optionService.setPassword(body);
  }

  @Get("/getPassword/:password")
  getPassword(@Param("password") password: string) {
    return this.optionService.getPassword(password);
  }

  @Post()
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionService.create(createOptionDto);
  }

  @Get()
  findAll() {
    return this.optionService.findAll();
  }

  @Get(":option_name")
  findOne(@Param("option_name") option_name: string) {
    return this.optionService.findOne(option_name);
  }

  @Patch(":option_name")
  update(@Param("option_name") option_name: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionService.update(option_name, updateOptionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.optionService.remove(+id);
  }
}
