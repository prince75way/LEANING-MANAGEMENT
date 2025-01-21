import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { createModuleService, deleteModuleService, editModuleService, addModuleToCourseService } from './modules.services';
import { uploadVideoToCloudinary } from './cloudinary';
import { validateToken } from '../../utils/validate.token';
import { sendResponse } from '../../utils/response.helper';
import { Instructor } from '../instructor/instructor.schema';
import Course from '../courses/course.schema';
import Module from './modules.schema';
/**
 * Controller to create a new module.
 * 
 * @async
 * @function createModule
 * @param {Request} req - The request object containing the module data and courseId.
 * @param {Response} res - The response object used to send the response.
 * 
 * @returns {Promise<void>} Sends a success or error response.
 */
export const createModule = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return sendResponse(res, 401, false, 'Authorization token is required');
  }

  await validateToken(token);
  const instructor = await Instructor.findOne({ refreshToken: token });
  if (!instructor) {
    return sendResponse(res, 403, false, 'Access denied. Only instructors can add modules.');
  }

  const { title, description, contentText } = req.body;
  const { courseId } = req.params;
  const video = req.file;

  if (!video) {
    return sendResponse(res, 400, false, 'Video file is required');
  }

  const cloudinaryVideoUrl = await uploadVideoToCloudinary(video);
  const moduleData = { title, description, contentText, videoUrl: cloudinaryVideoUrl, courseId };
  
  const newModule = await createModuleService(moduleData) as { _id: string };
  
  await addModuleToCourseService(courseId, newModule._id.toString());

  return sendResponse(res, 201, true, 'Module created successfully', newModule);
});

/**
 * Controller to delete a module.
 * 
 * @async
 * @function deleteModule
 * @param {Request} req - The request object containing the moduleId.
 * @param {Response} res - The response object used to send the response.
 * 
 * @returns {Promise<void>} Sends a success or error response.
 */
export const deleteModule = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { moduleId } = req.params;
  
  await deleteModuleService(moduleId);

  await Course.updateMany({ modules: moduleId }, { $pull: { modules: moduleId } });

  return sendResponse(res, 200, true, 'Module deleted successfully');
});

/**
 * Controller to edit a module.
 * 
 * @async
 * @function editModule
 * @param {Request} req - The request object containing the module data and moduleId.
 * @param {Response} res - The response object used to send the response.
 * 
 * @returns {Promise<void>} Sends a success or error response.
 */
export const editModule = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return sendResponse(res, 401, false, 'Authorization token is required');
  }

  await validateToken(token);
  const instructor = await Instructor.findOne({ refreshToken: token });
  if (!instructor) {
    return sendResponse(res, 403, false, 'Access denied. Only instructors can edit modules.');
  }

  const { moduleId } = req.params;
  const { title, description, contentText } = req.body;
  const video = req.file;

  const updateData: Partial<{ title: string, description: string, contentText: string, videoUrl: string }> = {
    title, description, contentText,
  };

  if (video) {
    const cloudinaryVideoUrl = await uploadVideoToCloudinary(video);
    updateData.videoUrl = cloudinaryVideoUrl;
  }

  const updatedModule = await editModuleService(moduleId, updateData);

  return sendResponse(res, 200, true, 'Module updated successfully', updatedModule);
});





/**
 * Retrieves modules for a specific course.
 * 
 * @async
 * @function getModulesByCourse
 * @param {Request} req - The request object containing the courseId in the params.
 * @param {Response} res - The response object used to send the retrieved modules.
 * 
 * @returns {Promise<void>} Sends a response with the list of modules or an error message if not found.
 */
export const getModulesByCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;

  // Find modules by courseId
  const modules = await Module.find({ courseId });

  if (!modules || modules.length === 0) {
    res.status(404).json({ message: 'No modules found for this course' });
  } else {
    res.status(200).json(modules);
  }
});

