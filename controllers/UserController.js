import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../models/user.js';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            userName: req.body.fullName,
            role: 'user',
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash, 
            
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
            _id: user._id
            }, 
            'secret',
            {
                expiresIn: '30d',
            }
        )

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'registration failed'
        })
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if( !user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if( !isPasswordValid) {
            return res.status(404).json({
                message: 'password is incorrect'
            });
        }

        const token = jwt.sign(
            {
            _id: user._id
            }, 
            'secret',
            {
                expiresIn: '30d',
            }
        )

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'authorization failed'
        })
    }
};

export const currentUser =  async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

        res.json({
            message: 'success'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'No access'
        })
    }
};