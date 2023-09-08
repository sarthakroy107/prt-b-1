import mongoose from "mongoose";
import User from "./User";
import { UserResolvers } from "../graphql/user/resolvers";
// import User from "./User";

const tweetSchema =  new mongoose.Schema({
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

tweetSchema.pre("save", async function(next) {
    console.log("IN POST MIDDLEWARE");
    try {
        
        const user = await User.findById(this.author);
        console.log("User: ", user)
    
        if (user) {
          user.tweetCount += 1;
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
        const tweet = await this.findOne().populate('author')
        if(tweet && tweet.author) {
            const user = await User.findById(tweet?.author);
            if(user) {
                user.tweetCount -= 1;
                await user.save();
            }
        }
        next();
    } catch (error) {
        next(error as Error);
    }
})

const Tweet =   mongoose.model("Tweet", tweetSchema);
export default Tweet