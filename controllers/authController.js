const userModel = require("../model/userSchema");
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

const signup = async (req, res, next) => {
    // data coming from body 
    const { name, email, password, confirmPassword } = req.body
    console.log(name, email, password, confirmPassword);

    // Validating 

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }

    // Email validating
    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valide email id'
        })
    }

    // Password validator
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Enter same password'
        })
    }

    // Storing the data in database
    try {
        const userInfo = userModel(req.body);
        const result = await userInfo.save()

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists with provided email id'
            })
        }
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


// Signin

const signin = async (req, res) => {
    const { email, password } = req.body;
    // Validating email password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Every field is mandatory'
        })
    }

    // Identifying that user is in databaase on not
    try {
        const user = await userModel.findOne({
            email
        }).select('+password')
        if (!user || !( await bcrypt.compare(password,user.password)))  {
            return res.status(400).json({
                success: false,
                message: 'Invallid credentials'
            })
        }

        // Generating token
        const token = user.jwtToken();
        user.password = undefined;

        // Generating cookie
        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        };
        res.cookie("token", token, cookieOption);
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

const getUser = async (req,res,next)=>{
    const userId = req.user.id

    try {
        const user = await userModel.findById(userId)
        return res.status(200).json({
            success:true,
            data:user
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

const logout = (req,res) =>{
    try {
        const cookieOption = {
            expires:new Date(),
            httpOnly:true
        }
        res.cookie('token',null,cookieOption)
        res.status(200).json({
            success:true,
            message:"Logged Out"
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}


module.exports = {
    signup, signin, getUser,logout
}