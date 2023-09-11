import { NextFunction, Request, Response } from "express";
import { Jwt } from "jsonwebtoken";
import { verifyJWT } from "../services/JWT";
require('dotenv').config();

export const auth = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header("Authorization")!.replace("Bearer ", "");
        if(!token) {
            return res.status(402).json({
                success: false,
                message: "Header not found"
            })
        }
        //@ts-ignore
        req.user = await verifyJWT(token);
        next();
    }catch(err) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong in express middleware"
        })
    }
}   