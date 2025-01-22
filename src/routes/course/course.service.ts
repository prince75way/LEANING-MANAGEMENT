import { v4 as uuidv4, parse } from 'uuid';

import { AppDataSource } from '../../services/databasetypeorm'; 
import { Course } from './course.entity'; 
import { CourseDTO } from './course.dto';
import { addCourseToUserProgressService } from '../user/user.service';

/**
 * Creates a new course in the database.
 * @param {CourseDTO} courseData - The new course data
 * @returns {Promise<Course>} - The newly created course
 */
export const createCourseService = async (courseData: CourseDTO) => {
  const courseRepository = AppDataSource.getRepository(Course); 
  const newCourse = courseRepository.create(courseData); 
  await courseRepository.save(newCourse); 
  return newCourse;
};

/**
 * Enroll a user in a course and update both the course and user data.
 * @param {string} userId - The ID of the student.
 * @param {string} courseId - The ID of the course to enroll in.
 * @returns {Promise<CourseDTO>} - The updated course data
 */





export const enrollInCourseService = async (userId: string, courseId: string): Promise<CourseDTO> => {
  const courseRepository = AppDataSource.getRepository(Course);

  // Parse the strings to UUID format
  const courseUUID = courseId; // Use the courseId string directly
  const userUUID = userId; // Use the userId string directly
  
  // Fetch the course by UUID
  const course = await courseRepository.findOne({
    where: { id: courseUUID },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check if the student is already enrolled in the course
  if (course.enrolledStudents && course.enrolledStudents.includes(userUUID)) {
    throw new Error('Student is already enrolled in this course');
  }


  const userProgress = await addCourseToUserProgressService(userUUID, courseId); 

  if (!course.enrolledStudents) {
    course.enrolledStudents = []; 
  }
  course.enrolledStudents.push(userUUID); 

  const updatedCourse = await courseRepository.save(course);

  const updatedCourseDTO: CourseDTO = {
    id: updatedCourse.id,
    title: updatedCourse.title,
    description: updatedCourse.description,
    instructor: updatedCourse.instructor,
    price: updatedCourse.price,
    modules: updatedCourse.modules,
    category: updatedCourse.category,
    enrolledStudents: updatedCourse.enrolledStudents,
  };

  return updatedCourseDTO;
};



/**
 * Updates a course with new data.
 * @param {string} courseId - The ID of the course to update.
 * @param {Partial<CourseDTO>} updatedData - The data to update the course with.
 * @returns {Promise<CourseDTO>} - The updated course
 */
export const editCourseService = async (courseId: string, updatedData: Partial<CourseDTO>) => {
  const courseRepository = AppDataSource.getRepository(Course); 

  const course = await courseRepository.findOne({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Merge updated data into the existing course
  Object.assign(course, updatedData);

  // Save the updated course
  const updatedCourse = await courseRepository.save(course);

  return updatedCourse;
};

/**
 * Deletes a course by its ID.
 * @param {string} courseId - The ID of the course to delete.
 * @returns {Promise<CourseDTO>} - The deleted course
 */
export const deleteCourseService = async (courseId: string) => {
  const courseRepository = AppDataSource.getRepository(Course); 

  const course = await courseRepository.findOne({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  await courseRepository.remove(course);

  return course; 
};

/**
 * Fetches a course by its ID and populates the modules.
 * @param {string} courseId - The ID of the course to fetch.
 * @returns {Promise<Course | null>} - The course document with populated modules or null if not found.
 */
export const getCourseById = async (courseId: string) => {
  const courseRepository = AppDataSource.getRepository(Course); // Get the repository for the Course entity

  const course = await courseRepository.findOne({
    where: { id: courseId },
    relations: ['modules'], 
  });

  if (!course) {
    throw new Error('Course not found');
  }

  return course;
};

/**
 * Adds a module to a course.
 * @param {string} courseId - The ID of the course to add the module to.
 * @param {string} moduleId - The ID of the module to add to the course.
 * @returns {Promise<Course>} - The updated course with the new module.
 */
export const addModuleToCourseService = async (courseId: string, moduleId: string) => {
  const courseRepository = AppDataSource.getRepository(Course); // Get the repository for the Course entity

  const course = await courseRepository.findOne({
    where: { id: courseId },
    relations: ['modules'], // Fetch the current modules of the course
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Add the module to the course's modules array
  course.modules.push(moduleId);

  // Save the updated course
  const updatedCourse = await courseRepository.save(course);

  return updatedCourse;
};


/**
 * Fetches all courses from the database.
 * @returns {Promise<Course[]>} - List of all courses
 */
export const getAllCoursesService = async (): Promise<Course[]> => {
    const courseRepository = AppDataSource.getRepository(Course); 
    const courses = await courseRepository.find(); 
    return courses;
  };