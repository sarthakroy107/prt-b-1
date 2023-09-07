"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tweetSchema = new mongoose_1.default.Schema({
    body: {
        type: String,
    },
    files: [{
            type: String,
        }],
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    replies: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Reply"
        }],
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    retweet: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model("Tweet", tweetSchema);
