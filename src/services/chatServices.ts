import mongoose from "mongoose";
import {  chatObjectTypeDef, conversationTypeDef } from "../config/typeConfig";

export const format_conversation_details = (conversation: any, from_user_id: string, latest_message: any): conversationTypeDef => {
    console.log(conversation, from_user_id);
    const object: conversationTypeDef = {
        conversation_id:       conversation._id,
        to_user_id:            conversation.members[0]._id,
        to_user_display_name:  conversation.members[0].name,
        to_user_profile_image: conversation.members[0].profileImageUrl,
        to_user_blue:          conversation.members[0].blue,
        to_user_username:      conversation.members[0].username,
        from_user_id:          new mongoose.Types.ObjectId(from_user_id),
        latest_message_text:   latest_message.text === undefined ? null : latest_message.text,
        latest_message_files:  latest_message.files === undefined ? null : latest_message.files,
        latest_message_date:   latest_message.createdAt,
    }
    return object;
};

export const formated_chats = (chats: any[]): chatObjectTypeDef[] => {
    let formated_chats: chatObjectTypeDef[] = [];

    for(const chat of chats) {
        const formated_chat: chatObjectTypeDef = {
            _id:        chat._id,
            sender_id:  chat.sender,
            text:       chat.text === undefined ? null : chat.text,
            files:      chat.files === undefined ? [] : chat.files,
            created_at: chat.createdAt,
        }
        formated_chats.push(formated_chat)
    }

    return formated_chats;
}