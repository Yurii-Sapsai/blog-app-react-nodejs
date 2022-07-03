import { body } from "express-validator";

export const postCreateValidation = [
    body('title', 'Please enter a title').isLength({ min: 3 }).isString(),
    body('text', 'Please enter text').isLength({ min: 10 }).isString(),
    body('tags', 'Invalid Tag Format (specify array)').optional().isString(),
    body('imageUrl', 'URL is not valid').optional().isString()
];