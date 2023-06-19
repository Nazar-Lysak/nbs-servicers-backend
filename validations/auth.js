import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Your email is incorrect').isEmail(),
    body('password', 'Your password should be at least 5 characters').isLength({ min: 5 }),
    body('fullName', 'Your name should be at least 3 characters').isLength({ min: 3 }),
    body('avatarUrl', 'Link for avatar is incorrect').optional().isURL(),
];