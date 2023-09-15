"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tweetSchema = new mongoose_1.default.Schema({
    author_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
        }],
    retweets: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
        }],
    replies: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
        }],
    quotetweets: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    hashtags: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
        }],
    in_reply: {
        type: Boolean,
        default: false,
    },
    in_reply_to_tweet_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
    },
    in_reply_to_user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
const Tweet = mongoose_1.default.model("Tweet", tweetSchema);
exports.default = Tweet;
