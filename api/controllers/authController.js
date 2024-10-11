import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// export const signup = async (req, res, next) => {

export const register = async (req, res, next) => {

    try {

        const { username, email, password } = req.body;
        const checkEmail = await User.findOne({ email: email })
        if(checkEmail){
            return next(errorHandler(409," Email already exist "))
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User ({ username, email, password: hashedPassword });
        await newUser.save(); 
    
        res.status(200)
        .json({ message: "User created successfully"});

    } catch (error) {
        next(error);
    }
};

// export const signin = async (req, res, next) => {
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if(!validUser) {
            return next(errorHandler(404, "User not found"));
        };

        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) {
            return next(errorHandler(401, "Wrong Credentials"));
        }

        const token = jwt.sign({ id: validUser._id}, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc; //make password hidden
        const expiryDate = new Date(Date.now() + 3600000); //1 hour
        res
        .cookie('access_token', token, { httpOnly: true, expires:expiryDate })
        .status(200)
        .json(rest)
        // .json({ message: "Logged in successfully"})
      

    } catch (error) {
        next(error);
    }

};