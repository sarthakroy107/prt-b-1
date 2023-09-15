import mongoose from "mongoose";
import User from "./User";
import { tweetTypeDef } from "../config/typeConfig";

const tweetSchema =  new mongoose.Schema<tweetTypeDef>({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
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
    }],
    retweets: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    quotetweets: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    hashtags: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    in_reply: {
        type: Boolean,
        default: false,
        required: true,
    },
    in_reply_to_tweet_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        required: true,
    },
    in_reply_to_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        required: true,
    },
    possibly_sensitive: {
        type: Boolean,
        required: true,
        default: false,
    },
    private: {
        type: Boolean,
        required: true,
        default: false,
    },
    viewsCount: {
        type: Number,
        required: true,
        default: 0
    }


}, {timestamps: true})


tweetSchema.pre("save", async function(next) {
    console.log("IN POST MIDDLEWARE");
    try {
        
        const user = await User.findById(this.author_id);
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

        if (tweet && tweet.author_id) {
            const user = tweet.author_id;

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