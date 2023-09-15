import mongoose, { Schema } from "mongoose";
import { userTypeDef } from "../config/typeConfig";


const UserSchema: Schema = new mongoose.Schema<userTypeDef>({
    name: {
        type: String,
        required: true,
        maxLength: 25
    },
    email: {
        type: String,
        required: true,
        unique:true,
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
    bio:{
        type: String,
        maxLength: 100
    },
    tweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    }],
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    }],
    blue:{
        type: Boolean,
        default: false
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    token: {
        type: String,
        default: "dummy_string"
    },
}, {timestamps: true})

const User = mongoose.model<userTypeDef>("User", UserSchema);
export default User