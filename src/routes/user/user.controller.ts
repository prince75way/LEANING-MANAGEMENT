import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'; // Import asyncHandler
import {
  signupService,
  loginService,
  refreshAccessToken,
  updateUserProgressService,
  getUserProgressService,
} from './user.service';
import { sendResponse } from '../../utils/response.helper';
import { validateToken } from '../../utils/validate.token';



/**
 * Handles sign up of a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>} - resolves with a successful response
 */
export const signupController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await signupService(req.body);
  sendResponse(res, 201, true, 'User signed up successfully', user);
});




/**
 * Handles login of an existing user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>} - resolves with a successful response
 */
export const loginController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const tokens = await loginService(req.body);
  sendResponse(res, 200, true, 'User logged in successfully', tokens);
});






/**
 * Updates the watched modules for a given course
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {string} courseId - course ID from request params
 * @param {string} moduleId - module ID from request body
 * @param {string} tokenId - user's token ID from request body
 * @returns {Promise<void>} - resolves with a successful response
 */
export const updateWatchedModules = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  const { moduleId, tokenId } = req.body; // moduleId provided in request body
  const userId = await validateToken(tokenId);

  const result = await updateUserProgressService(userId.userId, courseId, moduleId);
  sendResponse(res, 200, true, 'Progress updated successfully', result);
});






/**
 * Retrieves the progress of the user for all enrolled courses.
 * @param {Request} req - The request object containing the user's token.
 * @param {Response} res - The response object to send back the user progress.
 * @returns {Promise<void>} - Resolves with the user's progress details.
 */
export const getUserProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.body.token;
  const userId = await validateToken(token);
  const progress = await getUserProgressService(userId.userId);

  sendResponse(res, 200, true, 'User progress retrieved successfully', progress);
});







/**
 * Refreshes the access token using the provided refresh token.
 * @param {Request} req - The request object containing the refresh token.
 * @param {Response} res - The response object to send back the new access token.
 * @returns {Promise<void>} - Resolves when the access token is refreshed successfully.
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    sendResponse(res, 401, false, 'Refresh token is required');
    return;
  }

  const newAccessToken = await refreshAccessToken(refreshToken);
  sendResponse(res, 200, true, 'Access token refreshed successfully', { accessToken: newAccessToken });
});

