import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    comment: "上级直属分类ID",
    nullable: true
  })
  pid: number;
  @Column({
    comment: "排序ID",
    nullable: true
  })
  order_by: number;
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
  @CreateDateColumn({
    comment: "分类创建时间"
  })
  create_time: Date;
  @UpdateDateColumn({
    comment: "分类更新时间"
  })
  update_time: Date;
}
