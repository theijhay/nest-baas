import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from './users.entity';
  
  @Entity('webhooks')
  export class Webhook {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    url: string;
  
    @Column()
    event: 'create' | 'update' | 'delete';
  
    @Column()
    collection: string;
  
    @ManyToOne(() => User, (user) => user.id)
    user: User;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
