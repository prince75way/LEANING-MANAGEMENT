// course.routes.ts
import express from 'express';
import * as courseController from './course.controller';
import * as courseValidation from './course.validation';
import { validateRequest } from '../../common/middlewares/validation.middleware';
const router = express.Router();

// Route for creating a course
router.post('/create', courseValidation.validateCourseCreation,validateRequest, courseController.createCourse);

//Route to enrol to a course
router.post('/enroll', courseValidation.enrollValidationRules,validateRequest,courseController.enrollInCourse);

// Route to edit a course
router.put('/edit/:courseId', courseValidation.validateEditCourse, validateRequest, (req: express.Request, res: express.Response, next: express.NextFunction) => courseController.editCourse(req, res).then(() => next()).catch(next))

// Route to delete a course
router.delete('/:courseId', (req, res, next) => courseController.deleteCourse(req, res).then(() => next()).catch(next));


export default router;
