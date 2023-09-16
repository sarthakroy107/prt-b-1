import mongoose from "mongoose";
import { tweetTypeDef } from "../config/typeConfig";

const tweetSchema =  new mongoose.Schema<tweetTypeDef>({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        default: ""
    },
    files: [{
        type: String,
        default: []
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    retweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    quotetweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    hashtags: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    in_reply: {
        type: Boolean,
        default: false,
    },
    in_reply_to_tweet_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    in_reply_to_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    possibly_sensitive: {
        type: Boolean,
        default: false,
        required: true,
    },
    private: {
        type: Boolean,
        default: false,
        required: true,
    },
    viewsCount: {
        type: Number,
        default: 0,
        required: true,
    }


}, {timestamps: true})

const Tweet = mongoose.model<tweetTypeDef>("Tweet", tweetSchema);
export default Tweet