import mongoose from "mongoose";

const DirectMessageSchema = new mongoose.Schema({
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }]
}, {timestamps: true});

const DirectMessage = mongoose.model("DirectMessage", DirectMessageSchema);
export default DirectMessage;