import { body } from 'express-validator';

export const onboardInstructorValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('qualifications')
    .isArray({ min: 1 })
    .withMessage('Qualifications must be an array with at least one entry')
    .custom((qualifications) => {
      if (!Array.isArray(qualifications) || qualifications.some(q => typeof q !== 'string')) {
        throw new Error('Each qualification must be a string');
      }
      return true;
    }),

  body('experience')
    .notEmpty()
    .withMessage('Experience is required')
    .isString()
    .withMessage('Experience must be a string'),
];
