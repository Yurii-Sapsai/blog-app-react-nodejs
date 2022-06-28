import express from "express";
import mongoose from "mongoose";


import { registerValidation, loginValidation } from './validations/auth.js'
import { postCreateValidation } from './validations/post.js'

import checkAuth from './services/checkAuth.js'

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'



const app = express()
app.use(express.json())



app.get('/', (req, res) => {
    res.send('hello world!')
})

app.post('/auth/register', registerValidation, UserController.register)
app.post('/auth/login', loginValidation , UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)





mongoose.connect('mongodb+srv://yuri:tl4uTly7B29DLCHO@nodejs-basics.tdevg.mongodb.net/blog')
    .then(() => console.log('db OK!'))
    .catch((err) => console.log('db ERROR!', err))



app.listen(4444, (error) => {
    if (error) {
        return console.log(error)
    }
    console.log("Server start!")
})