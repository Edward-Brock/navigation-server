import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("option")
export class OptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: "配置ID"
  })
  option_id: number;
  @Column({
    comment: "配置名称"
  })
  option_name: string;
  @Column({
    comment: "分类属性"
  })
  option_value: string;
}
