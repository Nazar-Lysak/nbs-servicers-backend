import express from 'express';

import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';


import checkAuth from './utils/checkAuth.js';
// import user from './models/user.js';
import * as UserController from './controllers/UserController.js';

mongoose
    .connect('mongodb+srv://nazarlv87:12344321@cluster0.wwqcadm.mongodb.net/services?retryWrites=true&w=majority')
    .then(() => console.log('DB Ok!'))
    .catch((err) => console.log('DB error! ', err));

const app = express();

app.use(express.json());

app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/current-user', checkAuth, UserController.currentUser);

app.get('/', (req, res) => {
    res.send('Hello world');
});







app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    } else {
        console.log('Server OK');
    }
});