import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';


import UserSchema from '../models/User.js';

export const register = async (req, res) => {

    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc = new UserSchema({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarURL: req.body.avatarURL,
            passwordHash: hash
        })
        const user = await doc.save();

        const token = jwt.sign(
            {
                id: user._id
            },
            "secret123456",
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to register',
        })
    }
}

export const login = async (req, res) => {

    try {
        const user = await UserSchema.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'Login or password is wrong!'
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPassword) {
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

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to login',
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserSchema.findOne({_id: req.userId});
        if (!user) {
            return res.status(404).json({
                message: 'Login or password is wrong!'
            })
        }

        const { passwordHash, ...userData } = user._doc;
        res.json(userData);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'No access',
        })
    }
}