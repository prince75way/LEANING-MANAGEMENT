import { Request, Response } from 'express';
import { signupService, loginService,refreshAccessToken } from './user.service';
import { sendResponse } from '../../utils/response.helper';
import { updateUserProgressService } from './user.service';
import { validateToken } from '../../utils/validate.token';
import { getUserProgressService } from './user.service';

export const signupController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await signupService(req.body);
    sendResponse(res, 201, true, 'User signed up successfully', user);
  } catch (error: any) {
    sendResponse(res, 500, false, 'Failed to sign up user', { error: error.message });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const tokens = await loginService(req.body);
    sendResponse(res, 200, true, 'User logged in successfully', tokens);
  } catch (error: any) {
    sendResponse(res, 401, false, 'Failed to log in user', { error: error.message });
  }
};



export const updateWatchedModules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { moduleId,tokenId } = req.body;  // moduleId provided in request body
    const userId = await validateToken(tokenId);
    // console.log('userId:', userId);

    const result = await updateUserProgressService(userId.userId, courseId, moduleId);
    sendResponse(res, 200, true, 'Progress updated successfully', result);
  } catch (error: any) {
    console.error('Error updating progress:', error);
    sendResponse(res, 500, false, 'Failed to update progress', error.message);
  }
};


export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.body.token;
    const userId= await validateToken(token);
    const progress = await getUserProgressService(userId.userId);

    sendResponse(res, 200, true, 'User progress retrieved successfully', progress);
  } catch (error: any) {
    console.error(error);
    sendResponse(res, 500, false, 'Error retrieving user progress', error.message);
  }
};




export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const newAccessToken = await refreshAccessToken(refreshToken);
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};