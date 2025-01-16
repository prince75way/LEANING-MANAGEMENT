import { body } from 'express-validator';

export const userSignupValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['student', 'instructor'])
    .withMessage('Role must be either "student" or "instructor"'),
];


export const userLoginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];


export const validateUpdateWatchedModules = [ 
  body('moduleId').isString()
];

export const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];