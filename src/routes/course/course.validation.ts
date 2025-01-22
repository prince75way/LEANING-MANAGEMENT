
import { body } from 'express-validator';


export const validateCourseCreation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('instructor').notEmpty().withMessage('Instructor ID is required'),
  body('category').notEmpty().withMessage('Category is required'),

];


export const enrollValidationRules = [
    body('userId')
      .notEmpty().withMessage('User ID is required')
      .isString().withMessage('User ID must be a string'),
    body('courseId')
      .notEmpty().withMessage('Course ID is required')
      .isString().withMessage('Course ID must be a string')
  ];


export const validateEditCourse = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('image').optional().isString().withMessage('Image must be a string'),
  body('modules').optional().isArray().withMessage('Modules must be an array'),
];