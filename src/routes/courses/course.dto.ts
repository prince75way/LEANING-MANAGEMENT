// course.dto.ts
import { BaseSchema } from "../../common/dto/base.dto";
export interface CourseDTO extends BaseSchema {
    title: string;
    description: string;
    instructor: Object;  
    price: number;
    modules: string[]; 
    category: string;   
    image?: string;
    enrolledStudents:string[]     
  }
  