import mongoose from "mongoose";
import { replyTypeDef } from "../config/typeConfig";

const replySchema =  new mongoose.Schema<replyTypeDef>({
    category: {
        type:String,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    quotetweet: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }],
    retweet:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }],
    parentTweet: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet" || "Reply",
    },
    ogTweet: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
    },
    viewsCount: {
        type: Number,
        default: 0
    },
}, {timestamps: true})



const Reply = mongoose.model<replyTypeDef>("Reply", replySchema);
export default Reply