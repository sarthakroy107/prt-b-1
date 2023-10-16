import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    
}, {timestamps: true});

const Follows = mongoose.model("Follows", FollowSchema);
export default Follows;