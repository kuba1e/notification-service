import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Setting } from "../types/settings";
import { User } from "./User";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, (user) => user.settings)
  user: string;

  @Column("json")
  chatSetting: Setting;
}
