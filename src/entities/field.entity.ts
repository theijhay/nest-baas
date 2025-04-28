import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Collection } from './collection.entity';

@Entity('fields')
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // 'string', 'number', 'boolean', 'text', 'date'

  @ManyToOne(() => Collection, collection => collection.id)
  collection: Collection;
}
