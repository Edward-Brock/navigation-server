import { CategoryEntity } from "../../category/entities/category.entity";

export class CreateSiteDto {
  id: number;
  name: string;
  description: string;
  url: string;
  logo: string;
  visit_num: number;
  visibility: boolean;
  del_flag: boolean;
  create_time: Date;
  update_time: Date;
  delete_time: Date;
  category: CategoryEntity;
}
