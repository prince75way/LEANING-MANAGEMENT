
export class CourseDTO {

  id?: string;

  title: string;

  description: string;

  instructor: string; 

  price: number;

  modules: string[];

  category: string;

  enrolledStudents?: string[];

}
