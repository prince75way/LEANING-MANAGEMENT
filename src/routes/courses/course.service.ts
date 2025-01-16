// course.service.ts
import Course from './course.schema';
import { CourseDTO } from './course.dto';

import User from '../user/user.schema';

export const createCourseService = async (courseData: CourseDTO) => {
  const newCourse = new Course(courseData);
  await newCourse.save();
  return newCourse;
};


export const enrollInCourseService = async (userId: string, courseId: string) => {
  // Find the course by courseId
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Check if the student is already enrolled in the course
  if (course.enrolledStudents.includes(userId)) {
    throw new Error('Student is already enrolled in this course');
  }
  const user=await User.findById(userId);

  if(!user){
    throw new Error('User not found');
  }

   await user.courseProgress.push({ courseId: courseId, watchedModules: [] });
   await user.save()

  // Enroll the student by adding their ID to the enrolledStudents array
  course.enrolledStudents.push(userId);




  // Save the updated course document
  const updatedCourse = await course.save();


  // Return the updated course
  return updatedCourse;
};



// Service to edit a course
export const editCourseService = async (courseId: string, updatedData: CourseDTO) => {
  try {
    // Find the course by ID and update it
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

    if (!updatedCourse) {
      throw new Error('Course not found');
    }

    return updatedCourse;
  } catch (error:any) {
    throw new Error(error.message || 'Error updating the course');
  }
};

// Service to delete a course
export const deleteCourseService = async (courseId: string) => {
  try {
    // Find the course by ID and delete it
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      throw new Error('Course not found');
    }

    return deletedCourse;
  } catch (error:any) {
    throw new Error(error.message || 'Error deleting the course');
  }
};
