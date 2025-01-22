import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendResponse } from '../../utils/response.helper';
import { createCourseService, enrollInCourseService,getAllCoursesService, editCourseService, deleteCourseService, getCourseById } from './course.service'; // Import the services

/**
 * Handles course creation
 * @function createCourse
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - Resolves with a successful response
 * @throws {Error} - Rejects with an error if course creation fails
 */
export const createCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const courseData = req.body;
  const course = await createCourseService(courseData); 
  sendResponse(res, 201, true, 'Course created successfully', course);
});

/**
 * Handles enrolling a student in a course
 * @function enrollInCourse
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - Resolves with a successful response
 * @throws {Error} - Rejects with an error if course enrollment fails
 */
export const enrollInCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId, courseId } = req.body;
  const course = await enrollInCourseService(userId, courseId); 
  sendResponse(res, 200, true, 'Student enrolled successfully', course);
});

/**
 * Handles editing a course
 * @function editCourse
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - Resolves with a successful response
 * @throws {Error} - Rejects with an error if course editing fails
 */
export const editCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  const updatedData = req.body;
  const updatedCourse = await editCourseService(courseId, updatedData); 
  sendResponse(res, 200, true, 'Course updated successfully', updatedCourse);
});

/**
 * Handles deleting a course
 * @function deleteCourse
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - Resolves with a successful response
 * @throws {Error} - Rejects with an error if course deletion fails
 */
export const deleteCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  const deletedCourse = await deleteCourseService(courseId); 
  sendResponse(res, 200, true, 'Course deleted successfully', { courseId });
});

/**
 * Get all courses
 * @route GET /api/courses
 * @access Public (or restrict based on your requirements)
 */
export const getAllCourses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const courses = await getAllCoursesService(); 
    sendResponse(res, 200, true, 'Courses fetched successfully', courses);
  });