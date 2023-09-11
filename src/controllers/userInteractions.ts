import { Request, Response } from "express";
import User from "../models/User";

export const likedTweets =async (req: Request, res: Response) => {
    try {
        const { tweetId } = req.body;

        //@ts-ignore
        const user: {id: string, email: string} = console.log(req.user)
        console.log(tweetId)

        const result = await User.findOneAndUpdate(
            { _id: user.id },
            { $inc: { likes: 1 } },
            { new: true }
          );
          
        if (!result) {
            return res.status(403).json({
              success: false,
              message: "User not found"
            });
        }

        return res.status(200).json({
            success: false,
            message: "Like added succesfully"
        })
    } catch (error) {
        
    }
}