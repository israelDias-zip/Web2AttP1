import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { User } from "./Users";

@Entity('situations')
export class Situation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  nameSituation!: string

  @OneToMany(() => User, (user) => user.situation)
    users!: User[]

  @Column({type: 'timestamp', default: ()=>'CURRENT_TIMESTAMP'})
  createdAt!: Date;

  @Column({type: 'timestamp', default: ()=>'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt!: Date;
}