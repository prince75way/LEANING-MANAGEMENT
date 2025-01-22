import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from '../course/course.entity';  // Assuming you have a Course entity
import bcrypt from 'bcrypt';
import { InstructorDTO } from './instructor.dto';  // Assuming this is your DTO file

@Entity('instructors')
export class Instructor implements InstructorDTO {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column('simple-array')
  qualifications: string[];

  @Column({ type: 'varchar', length: 255 })
  experience: string;

  @Column({ type: 'varchar', nullable: true })
  accessToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;



  // Pre-save hook for hashing passwords - use lifecycle hooks
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Method for comparing passwords
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
