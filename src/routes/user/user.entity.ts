import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import bcrypt from 'bcrypt';
  import { CourseProgress } from './courseprogressentity';  // Assuming you have a separate entity for CourseProgress
  import { UserDTO } from './user.dto';  // DTO file for User
  
  @Entity('users')
  export class User implements UserDTO {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'varchar', unique: true, length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    role: string;
  
    @Column({ type: 'varchar', length: 255 })
    password: string;
  
    @Column({ type: 'varchar', nullable: true })
    accessToken: string | null;
  
    @Column({ type: 'varchar', nullable: true })
    refreshToken: string | null;
  
    @OneToMany(() => CourseProgress, (progress) => progress.user, { cascade: true })
    courseProgress: CourseProgress[];
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: string;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: string;
  
    // Hook to hash password before insert or update
    @BeforeInsert()
    async hashPassword() {
      if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    }
  
    // // Method for comparing passwords
    async comparePassword(candidatePassword: string): Promise<boolean> {
      return bcrypt.compare(candidatePassword, this.password);
    }
  }
  