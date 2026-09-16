import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Situation } from "./Situations";

@Entity('users')
export class User {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string

  @Column({unique: true})
  email!: string

  @ManyToOne(() => Situation, (situation) => situation.users)
  @JoinColumn({name: 'situation_id'})
  situation!: Situation;

  @Column({type: 'timestamp', default: ()=>'CURRENT_TIMESTAMP'})
  createdAt!: Date;

  @Column({type: 'timestamp', default: ()=>'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt!: Date;
}