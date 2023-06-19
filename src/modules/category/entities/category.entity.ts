import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("category")
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: "分类ID"
  })
  id: string;
  @Column({
    comment: "分类名称"
  })
  name: string;
  @Column({
    comment: "分类描述",
    nullable: true
  })
  description: string;
  @Column({
    comment: "上级直属分类ID"
  })
  pid: string;
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
