//models/user.js
import mongoose from 'mongoose'
import Joi from 'joi'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 100

    }
})

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(4).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(6).max(100).required()
    })
    return schema.validate(user)
}
const User = mongoose.model('User', userSchema)

export { validateUser, User } ;

