import { Request, Response } from 'express';
import { createModuleService } from './modules.services';  // Service to handle the business logic
import { uploadVideoToCloudinary } from './cloudinary'; // Helper to upload video to Cloudinary
import { validateToken } from '../../utils/validate.token'; // Helper to validate token and extract user info
import { sendResponse } from '../../utils/response.helper'; // Response helper
import { Instructor } from '../instructor/instructor.schema';
import Module from './modules.schema';
import Course from '../courses/course.schema';

export const createModule = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate JWT token to ensure the user is an instructor
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header
    if (!token) {
      return sendResponse(res, 401, false, 'Authorization token is required');
    }

    const decodedToken = await validateToken(token);

    const instructor=await Instructor.findOne({refreshToken:token})
    // console.log("Inststructor is: ",instructor)
    if (!instructor) {
      return sendResponse(res, 403, false, 'Access denied. Only instructors can add modules.');
    }

    // Destructure data from the request body
    const { title, description, contentText } = req.body;
    const { courseId } = req.params;
    const video = req.file;  // The video file uploaded via multipart form-data
    // console.log("Vide is: ",video);
    // console.log("req.body is: ",req.body,title,description,contentText,courseId);
    // Check if video file is provided
    if (!video) {
      return sendResponse(res, 400, false, 'Video file is required');
    }

    // Upload video to Cloudinary and get the video URL
    const cloudinaryVideoUrl = await uploadVideoToCloudinary(video);

    // Prepare module data
    const moduleData = {
      title,
      description,
      contentText,
      videoUrl: cloudinaryVideoUrl,  // Cloudinary URL for the video
      courseId,
    };

    // Call the service to create a module
    const newModule = await createModuleService(moduleData) as { _id: string };

    // Adding the module to the course

    const course = await Course.findById(courseId);
    if (!course) {
      return sendResponse(res, 404, false, 'Course not found');
    }
    course.modules.push(newModule._id.toString());
    await course.save();

    // Send a success response with the created module data
    return sendResponse(res, 201, true, 'Module created successfully', newModule);
  } catch (error: any) {
    // Handle any errors that occur during module creation
    console.error(error);
    return sendResponse(res, 500, false, 'Error creating module', error.message);
  }
};




// DELETE MODULE CODE

// Controller to delete a module
export const deleteModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;  // Extract moduleId from the request params

    // Find and delete the module
    const module = await Module.findByIdAndDelete(moduleId);
    
    if (!module) {
      return sendResponse(res, 404, false, 'Module not found');
    }

    // Optionally, remove the module reference from the course
    await Course.updateMany(
      { modules: moduleId },
      { $pull: { modules: moduleId } }
    );

    // Send success response
    return sendResponse(res, 200, true, 'Module deleted successfully');
  } catch (error: any) {
    console.error(error);
    return sendResponse(res, 500, false, 'Error deleting module', error.message);
  }
};



// Controller to edit a module
export const editModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header
    if (!token) {
      return sendResponse(res, 401, false, 'Authorization token is required');
    }

    const decodedToken = await validateToken(token);

    const instructor=await Instructor.findOne({refreshToken:token})
    // console.log("Inststructor is: ",instructor)
    if (!instructor) {
      return sendResponse(res, 403, false, 'Access denied. Only instructors can add modules.');
    }

    const { moduleId } = req.params;  // Extract moduleId from the request params
    const { title, description, contentText } = req.body;  // Extract data from the request body
    const video = req.file;  // Extract video file (if provided)

    // Find the module to be updated
    const module = await Module.findById(moduleId);
    
    if (!module) {
      return sendResponse(res, 404, false, 'Module not found');
    }

    // Update module details
    module.title = title || module.title;
    module.description = description || module.description;
    module.contentText = contentText || module.contentText;

    // If a new video is uploaded, upload it to Cloudinary and update the video URL
    if (video) {
      const cloudinaryVideoUrl = await uploadVideoToCloudinary(video);
      module.videoUrl = cloudinaryVideoUrl;
    }

    // Save the updated module
    await module.save();

    // Send success response
    return sendResponse(res, 200, true, 'Module updated successfully', module);
  } catch (error: any) {
    console.error(error);
    return sendResponse(res, 500, false, 'Error updating module', error.message);
  }
};
