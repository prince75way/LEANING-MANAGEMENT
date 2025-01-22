import { onboardInstructorValidation } from './instructor.validation';
import express from 'express';
import { onboardInstructorController } from './instructor.controller';
import { validateRequest } from '../../common/middlewares/validation.middleware'
const router = express.Router();


router.post('/onboard', onboardInstructorValidation, validateRequest, onboardInstructorController);

export default router;