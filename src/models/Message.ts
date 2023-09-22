import mongoose from "mongoose";

interface Message {
    conversationId: mongoose.Schema.Types.ObjectId | string;
    sender: mongoose.Schema.Types.ObjectId | string;
    text: string;
    files: string[];
}
const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    text: {
        type: String,
    },
    files: [{
        type: String,
    }],
}, {timestamps: true});

const Message = mongoose.model("Message", MessageSchema);
export default Message;