import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  tableName: string;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
