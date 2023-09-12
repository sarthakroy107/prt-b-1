import { Request, Response } from "express";
import User from "../models/User";
import Tweet from "../models/Tweet";
import { tweetTypeDef } from "../config/typeConfig";
import mongoose, { CallbackError } from "mongoose";

export const likeTweets = async (req: Request, res: Response) => {
    try {
        const { tweetId }: { tweetId: mongoose.Schema.Types.ObjectId | string } = req.body;
        //@ts-ignore
        const user: {id: string, email: string} = req.user
        console.log(user, tweetId);
        const tweet: tweetTypeDef | null = await Tweet.findById(tweetId);

        if(!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found"
            });
        }

        if(tweet.likes.includes(tweetId)) {
            return res.status(501).json({
                success: false,
                message: "Tweet is already liked by the user"
            });
        }

        const acccount = await User.findById(user.id);

        if(!acccount) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            });
        }

        if(acccount.likes.includes(tweetId)) {
            return res.status(500).json({
                success: false,
                message: "User already liked the tweet"
            });
        }

        acccount.likes.push(tweetId);
        tweet.likes.push(acccount._id);
        acccount.save();
        tweet.save();

        return res.status(200).json({
            success: true,
            message: "Like added succesfully"
        })

        
    } catch (error) {

        return res.status(402).json({
            success: false,
            message: "Something went wrong in likeTweet"
        })
    }
}


export const unlikeTweets = async (req: Request, res: Response) => {
    try {
        const { tweetId }: { tweetId: mongoose.Schema.Types.ObjectId | string } = req.body;
        //@ts-ignore
        const user = await req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to unlike tweets"
            });
        }

        const isLiked = await User.findById(user.id).select("likes");
        if(!isLiked) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (!isLiked.likes.includes(tweetId)) {
            return res.status(400).json({
                success: false,
                message: "You have not liked this tweet"
            });
        }

        await User.updateOne({ _id: user.id }, { $pull: { likes: tweetId } });
        await Tweet.updateOne({ _id: tweetId }, { $pull: { likes: user.id } });

        return res.status(200).json({
            success: true,
            message: "Tweet unliked successfully"
        });

    } catch (error) {
        
        return res.status(402).json({
            success: false,
            message: "Something went wrong in unlikeTweet"
        })
    }
}