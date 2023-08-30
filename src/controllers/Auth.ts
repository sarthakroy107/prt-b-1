import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../models/User";


export const userLogin = async (req: Request, res: Response) => {
    const {email, password}: {email: string, password: string} = req.body;

    try {
        console.log("userLogin called")
        const account = await User.findOne({email});
        if(!account) throw new Error("User not found");
        if(!bcrypt.compare(password, account.password)) return new Error("Password do not match");
        const payload = {
            email: account.email,
            id: account._id
        }
        try {
            console.log(process.env.JWT_SECRET)
            const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "72h" });
            account.token = token;
            const options = {
                expires: new Date(Date.now() + 24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options)
            return res.status(200).json({
                success: true,
                message: "Token send, check"
            })
        } catch (error) {
            throw new Error("Token generation failed");
        }

    } catch (error) {
        console.log(error)
    }
}