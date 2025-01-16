import { validateRequest } from './../../common/middlewares/validation.middleware';
import express, { RequestHandler } from 'express';
import * as validation from './user.validation';
import * as controller from './user.controller';





const router = express.Router();

// POST /api/user/signup
router.post('/signup', validation.userSignupValidation, validateRequest, controller.signupController);

// POST /api/user/login
router.post('/login', validation.userLoginValidation, validateRequest, controller.loginController);
// REquest to update the watched modules
router.post('/watchedmodule/:courseId', validation.validateUpdateWatchedModules, validateRequest, controller.updateWatchedModules);

router.get('/progress', controller.getUserProgress);
// Route to refresh the token
router.post('/refresh-token', validation.validateRefreshToken, controller.refreshToken as unknown as RequestHandler);



export default router;
