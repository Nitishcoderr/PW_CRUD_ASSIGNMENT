const mongoose = require('mongoose')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'user name is Required'],
        minLength: [5, 'Name must be 5 char'],
        maxLenght: [20, 'Name must be less than 20 character'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'User Email is Required'],
        unique: true,
        lowercase: true,
        unique: [true, 'Already registered']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    forgetPasswordToken: {
        type: String,
    },
    forPasswordExpiryDate: {
        type: Date
    }
}, { timestamps: true })

// incrypting password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10);
    return next()
})

// Creating jwttoken 
userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            {
                id: this._id,
                email: this.email
            },
            process.env.SECRET,
            { expiresIn: "24h" }
        )
    }
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel;