"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formated_chats = exports.format_conversation_details = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const format_conversation_details = (conversation, from_user_id, latest_message) => {
    console.log(conversation, from_user_id);
    const object = {
        conversation_id: conversation._id,
        to_user_id: conversation.members[0]._id,
        to_user_display_name: conversation.members[0].name,
        to_user_profile_image: conversation.members[0].profileImageUrl,
        to_user_blue: conversation.members[0].blue,
        to_user_username: conversation.members[0].username,
        from_user_id: new mongoose_1.default.Types.ObjectId(from_user_id),
        latest_message_text: latest_message.text === undefined ? null : latest_message.text,
        latest_message_files: latest_message.files === undefined ? null : latest_message.files,
        latest_message_date: latest_message.createdAt,
    };
    return object;
};
exports.format_conversation_details = format_conversation_details;
const formated_chats = (chats) => {
    let formated_chats = [];
    for (const chat of chats) {
        const formated_chat = {
            _id: chat._id,
            sender_id: chat.sender,
            text: chat.text === undefined ? null : chat.text,
            files: chat.files === undefined ? [] : chat.files,
            created_at: chat.createdAt,
        };
        formated_chats.push(formated_chat);
    }
    return formated_chats;
};
exports.formated_chats = formated_chats;
