"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const replySchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        enum: ['quotetweet', 'retweet', 'reply'],
        required: true
    },
    body: {
        type: String,
    },
    files: [{
            type: String,
        }],
    visibility: {
        type: String,
        enum: ["visible", "deleted", "hidden"],
        requied: true,
        default: "visible"
    },
    author: {
        required: true,
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
    quotetweet: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Reply"
        }],
    retweet: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Reply"
        }],
    parentTweet: {
        required: true,
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tweet" || "Reply",
    },
    ogTweet: {
        required: true,
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tweet",
    },
    viewsCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });
const Reply = mongoose_1.default.model("Reply", replySchema);
exports.default = Reply;
