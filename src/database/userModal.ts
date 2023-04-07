import { NextFunction } from 'express';
import mongoose from 'mongoose';
import { genSalt, hash } from 'bcrypt';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (next: NextFunction) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        const salt = await genSalt(10);
        const hashedPassword = await hash(user.password, salt);
        user.password = hashedPassword;
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;