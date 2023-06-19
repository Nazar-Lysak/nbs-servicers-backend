import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true, 
    },
    role: String,
    avatarUrl: String,

}, {
    timestamps: true,
});

export default mongoose.model('user', userSchema);