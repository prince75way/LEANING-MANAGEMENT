
import { Schema, model } from 'mongoose';
import { CourseDTO } from './course.dto';  

const courseSchema = new Schema<CourseDTO>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true },  
  price: { type: Number, required: true },
  modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }], 
  category: { type: String },
  image: { type: String },  // Optional image field for the course
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }]  
}, { timestamps: true });

const Course = model<CourseDTO>('Course', courseSchema);
export default Course;
