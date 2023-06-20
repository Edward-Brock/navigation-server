export class CreateSiteDto {
  id: number;
  pid: number;
  name: string;
  description: string;
  url: string;
  logo: string;
  visit_num: number;
  visibility: boolean;
  del_flag: boolean;
  create_time: Date;
  update_time: Date;
}
