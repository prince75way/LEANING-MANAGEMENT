import { DataSource } from "typeorm";
import { Course } from "../routes/course/course.entity";
import { Instructor } from "../routes/instructor/instructor.entity";
import { User } from "../routes/user/user.entity";
import { Module } from "../routes/module/module.entity";
import { CourseProgress } from "../routes/user/courseprogressentity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "learningmanagement",
  synchronize: false, 
  logging: true,
  entities: [Course, Instructor, User, Module, CourseProgress], 
  migrations: ["src/migrations/**/*.ts"], 
  subscribers: [],
});
