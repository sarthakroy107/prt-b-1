import mongoose from "mongoose";

const LikesSchema = new mongoose.Schema({
    tweet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

const Likes = mongoose.model("Likes", LikesSchema);
export default Likes;