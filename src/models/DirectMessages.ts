import mongoose from "mongoose";

const DirectMessageSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }]
}, {timestamps: true});

const DirectMessage = mongoose.model("DirectMessage", DirectMessageSchema);
export default DirectMessage;