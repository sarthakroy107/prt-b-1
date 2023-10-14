import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true});

const Follows = mongoose.model("Follows", FollowSchema);
export default Follows;