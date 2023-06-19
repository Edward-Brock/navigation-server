import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("site")
export class SiteEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: "网站ID"
  })
  id: number;
  @Column({
    comment: "网站名称"
  })
  name: string;
  @Column({
    comment: "网站描述",
    nullable: true
  })
  description: string;
  @Column({
    comment: "网站网址"
  })
  url: string;
  @Column({
    comment: "网站 Logo",
    nullable: true
  })
  logo: string;
  @Column({
    comment: "网站访问数",
    type: "int",
    default: 0
  })
  visit_num: number;
  @Column({
    comment: "网站可见性",
    default: true
  })
  visibility: boolean;
  @Column({
    comment: "网站删除标志",
    default: false
  })
  del_flag: boolean;
}
