export class CreateCategoryDto {
  id: number;
  name: string;
  description: string;
  pid: number;
  order_by: number;
  visibility: boolean;
  del_flag: boolean;
  create_time: Date;
  update_time: Date;
}
