import mongoose from "mongoose";

const tweetSchema =  new mongoose.Schema({
    body: {
        type: String,
    },
    retweeted_from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet", 
        default: null
    },
    parent_tweet:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
        default: null,
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
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Tweet", tweetSchema);