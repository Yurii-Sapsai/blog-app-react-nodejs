import express from "express";
import mongoose from "mongoose";
import multer from 'multer';

import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/post.js';

import checkAuth from './services/checkAuth.js';
import handleValidationErrors from "./services/handleValidationErrors.js";

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';



const app = express();
app.use(express.json());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
})
const upload = multer({ storage });


app.get('/', (req, res) => {
    res.send('hello world!');
})

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.use('/uploads', express.static('uploads'));





mongoose.connect('mongodb+srv://yuri:tl4uTly7B29DLCHO@nodejs-basics.tdevg.mongodb.net/blog')
    .then(() => console.log('db OK!'))
    .catch((err) => console.log('db ERROR!', err))



app.listen(4444, (error) => {
    if (error) {
        return console.log(error);
    }
    console.log("Server start!");
})