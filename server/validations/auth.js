import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Email is not valid').isEmail(),
    body('password', 'Min 6 symbol').isLength({ min: 6 }),
    body('fullName', 'Please enter your name').isLength({ min: 3 }),
    body('avatarUrl', 'URL is not valid').optional().isURL()
]