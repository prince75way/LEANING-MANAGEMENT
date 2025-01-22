import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { ModuleDTO } from './module.dto';  // Assuming this is your DTO

@Entity('modules')
export class Module implements ModuleDTO {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  contentText: string;

  @Column({ type: 'varchar', length: 255 })
  videoUrl: string;

  @Column({type:'text'})
  courseId: string;  // Many modules belong to one course
}
