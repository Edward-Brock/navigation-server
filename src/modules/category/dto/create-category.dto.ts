export class CreateCategoryDto {
  id: string;
  name: string;
  description: string;
  pid: number;
  order_by: number;
  visibility: boolean;
  create_time: Date;
  update_time: Date;
  del_flag: boolean;
}
