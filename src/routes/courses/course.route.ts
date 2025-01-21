// course.routes.ts
import express from 'express';
import * as courseController from './course.controller';
import * as courseValidation from './course.validation';
import { validateRequest } from '../../common/middlewares/validation.middleware';
const router = express.Router();

router.post('/', courseValidation.validateCourseCreation,validateRequest, courseController.createCourse);


router.post('/enroll', courseValidation.enrollValidationRules,validateRequest,courseController.enrollInCourse);


router.put('/:courseId', courseValidation.validateEditCourse, validateRequest, 
    courseController.editCourse)


router.delete('/:courseId', courseController.deleteCourse);

router.get('/', courseController.getAllCourses);



export default router;
