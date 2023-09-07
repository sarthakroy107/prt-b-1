import mongoose from "mongoose";

const tweetSchema =  new mongoose.Schema({
    body: {
        type: String,
    },
    files: [{
        type: String,
    }],
    author: {
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
    retweet:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true})

module.exports = mongoose.model("Tweet", tweetSchema);