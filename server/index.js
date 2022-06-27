import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

import { registerValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'

import UserSchema from './models/User.js'


mongoose.connect('mongodb+srv://yuri:tl4uTly7B29DLCHO@nodejs-basics.tdevg.mongodb.net/blog')
    .then(() => console.log('db OK!'))
    .catch((err) => console.log('db ERROR!', err))


const app = express()
app.use(express.json())



app.get('/', (req, res) => {
    res.send('hello world!')
})

app.post('/auth/register', registerValidation, async (req, res) => {

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc = new UserSchema({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarURL: req.body.avatarURL,
            passwordHash: hash
        })
        const user = await doc.save()

        const token = jwt.sign(
            {
                id: user._id
            },
            "secret123456",
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc
        res.json({
            ...userData,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to register',
        })
    }
})


app.post('/auth/login', async (req, res) => {

    try {
        const user = await UserSchema.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                message: 'Login or password is wrong!'
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if(!isValidPassword){
            return res.status(400).json({
                message: 'Login or password is wrong!'
            })
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            "secret123456",
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc
        res.json({
            ...userData,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Failed to login',
        })
    }
})

app.get('auth/me', async(req, res) => {

    try{

    }catch(error){

    }
})


app.listen(4444, (error) => {
    if (error) {
        return console.log(error)
    }
    console.log("Server start!")
})