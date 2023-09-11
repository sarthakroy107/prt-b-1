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
exports.likedTweets = void 0;
const User_1 = __importDefault(require("../models/User"));
const likedTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetId } = req.body;
        //@ts-ignore
        const user = console.log(req.user);
        console.log(tweetId);
        const result = yield User_1.default.findOneAndUpdate({ _id: user.id }, { $inc: { likes: 1 } }, { new: true });
        if (!result) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: false,
            message: "Like added succesfully"
        });
    }
    catch (error) {
    }
});
exports.likedTweets = likedTweets;
