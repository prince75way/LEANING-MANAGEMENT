// module.routes.ts
import express from 'express';
import * as controller from './modules.controller';
import * as validation from './modules.validation';
import {upload} from './multer.config'

const router = express.Router();

// Route for creating a module
router.post('/create/:courseId', validation.validateModuleCreation,upload.single('video'), controller.createModule);

router.delete('/:moduleId', controller.deleteModule);

// Route for editing a module
router.put('/:moduleId', validation.validateModuleEdit, upload.single('video'), controller.editModule);

router.get('/:courseId', controller.getModulesByCourse);

export default router;
