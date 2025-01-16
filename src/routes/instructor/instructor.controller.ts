import { Request, Response } from 'express';
import { onboardInstructorService } from './instructor.service';
import { sendResponse } from '../../utils/response.helper';

export const onboardInstructorController = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructor = await onboardInstructorService(req.body);
    sendResponse(res, 201, true, 'Instructor onboarded successfully', instructor);
  } catch (error: any) {
    sendResponse(res, 500, false, 'Failed to onboard instructor', { error: error.message });
  }
};
