"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeTweets = exports.likeTweets = void 0;
const User_1 = __importDefault(require("../models/User"));
const Tweet_1 = __importDefault(require("../models/Tweet"));
const likeTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.body;
        //@ts-ignore
        const user = req.user;
        console.log(user, tweetId);
        const tweet = yield Tweet_1.default.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found"
            });
        }
        if (tweet.likes.includes(tweetId)) {
            return res.status(501).json({
                success: false,
                message: "Tweet is already liked by the user"
            });
        }
        const acccount = yield User_1.default.findById(user.id);
        if (!acccount) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            });
        }
        if (acccount.likes.includes(tweetId)) {
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
        });
    }
    catch (error) {
        return res.status(402).json({
            success: false,
            message: "Something went wrong in likeTweet"
        });
    }
});
exports.likeTweets = likeTweets;
const unlikeTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.body;
        //@ts-ignore
        const user = yield req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to unlike tweets"
            });
        }
        const isLiked = yield User_1.default.findById(user.id).select("likes");
        if (!isLiked) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (!isLiked.likes.includes(tweetId)) {
            return res.status(400).json({
                success: false,
                message: "You have not liked this tweet"
            });
        }
        yield User_1.default.updateOne({ _id: user.id }, { $pull: { likes: tweetId } });
        yield Tweet_1.default.updateOne({ _id: tweetId }, { $pull: { likes: user.id } });
        return res.status(200).json({
            success: true,
            message: "Tweet unliked successfully"
        });
    }
    catch (error) {
        return res.status(402).json({
            success: false,
            message: "Something went wrong in unlikeTweet"
        });
    }
});
exports.unlikeTweets = unlikeTweets;
