"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 25
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    profileImageUrl: {
        type: String,
        default: "https://static.animecorner.me/2023/01/onimai-episode-2-1.jpg"
    },
    banner: {
        type: String,
        default: "https://pbs.twimg.com/profile_banners/1658081615069999104/1691591327/1500x500"
    },
    bio: {
        type: String,
        maxLength: 100
    },
    tweets: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tweet"
        }],
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tweet"
        }],
    replies: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tweet"
        }],
    blue: {
        type: Boolean,
        default: false
    },
    followers: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    following: [{
            type: mongoose_1.default.Schema.Types.ObjectId
        }],
    token: {
        type: String,
        default: "dummy_string"
    },
    tweetCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
