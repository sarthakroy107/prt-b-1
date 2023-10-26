import mongoose from "mongoose";

const retweetSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tweet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
        required: true
    },
}, { timestamps: true });

const Retweet = mongoose.model("Retweet", retweetSchema);
export default Retweet;