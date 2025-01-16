// course.controller.ts
import { Request, Response } from 'express';
import { createCourseService } from './course.service';
import { sendResponse } from '../../utils/response.helper';  // Response helper for standardized responses
import { enrollInCourseService } from './course.service';
import * as courseService from './course.service';  

export const createCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    const course = await createCourseService(courseData);
    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error:any) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};




// Controller to handle enrolling a student in a course
export const enrollInCourse = async (req: Request, res: Response): Promise<void> => {
  const { userId, courseId } = req.body;  // Student's user ID and course ID from request body

  try {
    // Call the service to enroll the student
    const result = await enrollInCourseService(userId, courseId);

    // Send success response with enrolled course data
    return sendResponse(res, 200, true, 'Student enrolled successfully', result);
  } catch (error: any) {
    console.error(error);
    return sendResponse(res, 500, false, 'Error enrolling in course', error.message);
  }
};




// Controller to edit a course
export const editCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const updatedData = req.body; // The data sent by the user for updating

    const updatedCourse = await courseService.editCourseService(courseId, updatedData);

    return res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error:any) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Controller to delete a course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await courseService.deleteCourseService(courseId);

    return res.status(200).json({
      message: 'Course deleted successfully',
      courseId: courseId,
    });
  } catch (error:any) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
