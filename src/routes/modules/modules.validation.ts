// module.validation.ts
import { body } from 'express-validator';

// Validation rules for module creation
export const validateModuleCreation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('contentText').notEmpty().withMessage('Content text is required'),
  body('video').notEmpty().withMessage('Video file is required'),

];


export const validateModuleEdit = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('contentText')
    .optional()
    .isString()
    .withMessage('Content text must be a string'),
];