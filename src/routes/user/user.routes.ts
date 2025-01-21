import { validateRequest } from './../../common/middlewares/validation.middleware';
import express, { RequestHandler } from 'express';
import * as validation from './user.validation';
import * as controller from './user.controller';





const router = express.Router();


router.post('/signup', validation.userSignupValidation, validateRequest, controller.signupController);


router.post('/login', validation.userLoginValidation, validateRequest, controller.loginController);

// Request to update the watched modules
router.post('/watchedmodule/:courseId', validation.validateUpdateWatchedModules, validateRequest, controller.updateWatchedModules);

// Route to get the user progress
router.get('/progress', controller.getUserProgress);

// To refresh the tokens with the refresh-token
router.post('/refresh-token', validation.validateRefreshToken, controller.refreshToken as unknown as RequestHandler);



export default router;
