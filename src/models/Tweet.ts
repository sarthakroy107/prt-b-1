import mongoose from "mongoose";
import User from "./User";
import { tweetTypeDef } from "../config/typeConfig";

const tweetSchema =  new mongoose.Schema<tweetTypeDef>({
    category: {
        type:String,
        enum: ['tweet'],
        required: true,
        default: 'tweet'
    },
    body: {
        type: String,
    },
    files: [{
        type: String,
    }],
    author: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    visibilty: {
        type: String,
        enum: ["visible", "deleted", "hidden"],
        requied: true,
        default: "visible"
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
    viewsCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
}, {timestamps: true})


tweetSchema.pre("save", async function(next) {
    console.log("IN POST MIDDLEWARE");
    try {
        
        const user = await User.findById(this.author);
        console.log("User: ", user)
    
        if(user && !user.tweets.includes(this._id)) {
          user.tweetCount += 1;
          user.tweets.push(this._id)
          await user.save();
        }
        next();
      } catch (error) {
        next(error as Error);
      }
})

tweetSchema.pre('deleteOne', async function(next) {
    console.log("IN POST MIDDLEWARE, deleteOne");

    try {
        const tweetId = await this.getFilter()._id;
        const tweet = await Tweet.findById(tweetId).populate('author');

        if (tweet && tweet.author) {
            const user = tweet.author;

            //@ts-ignore
            user.tweets.pull(tweet._id);
            //@ts-ignore
            user.tweetCount -= 1;
            //@ts-ignore
            await user.save();
        }
        next();
    } catch (error) {
        next(error as Error);
    }
})

const Tweet = mongoose.model<tweetTypeDef>("Tweet", tweetSchema);
export default Tweet