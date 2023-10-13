import mongoose from "mongoose"
import DirectMessage from "../../models/DirectMessages"
import { chatObjectTypeDef, message_data_type } from "../../config/typeConfig"
import Message from "../../models/Message"

export const checkConversation = async (data: message_data_type): Promise<string> => {
    try {
        const newConversation = await DirectMessage.findOne({ members: { $all: [data.senderId, data.to_user_id] } });
        if(!newConversation) {
            const newConversation = await DirectMessage.create({ members: [data.senderId, data.to_user_id] });
            return newConversation._id.toString();
        }
        console.log(newConversation)
        return newConversation?._id.toString();
    }
    catch(error) {
        //console.log(error)
        throw new Error("Something went wrong in cheackConversation")
    }
}

export const createMessage = async (data: message_data_type) => {
    if( data.conversationId === null ) {
        data.conversationId = await checkConversation(data);
    }
    //console.log(data)
    const newMessage = await Message.create({ conversationId: data.conversationId, sender: data.senderId, text: data.text, files: data.files === undefined ? [] : data.files });
      const createdAtString = newMessage.createdAt.toISOString();

      const formatedMessage: chatObjectTypeDef = {
        _id:        newMessage._id,
        sender_id:  newMessage.sender,
        text:       newMessage.text === undefined ? null : newMessage.text,
        files:      newMessage.files === undefined || newMessage === null ? [] : newMessage.files,
        created_at: Date.parse(createdAtString).toString(),
    }
    return formatedMessage
}