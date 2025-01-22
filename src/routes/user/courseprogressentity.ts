import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Course } from '../course/course.entity';
  
  @Entity('course_progress')
  export class CourseProgress {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => User, (user) => user.courseProgress, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @ManyToOne(() => Course, { eager: true }) // Adjust eager loading as needed
    @JoinColumn({ name: 'courseId' })
    courseId: Course;
  
    @Column('simple-array')
    watchedModules: string[];
  }
  