// course.dto.ts
import { BaseSchema } from "../../common/dto/base.dto";
export interface CourseDTO extends BaseSchema {
    title: string;
    description: string;
    instructor: Object;  // Reference to the instructor's ID
    price: number;
    modules: string[];  // Array of module IDs that belong to this course
    category: string;   // e.g., Programming, Design
    image?: string;
    enrolledStudents:string[]     // Optional image field for the course
  }
  