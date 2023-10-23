import DirectMessage from "../../models/DirectMessages";
import Message from "../../models/Message";
import User from "../../models/User";
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
import { ObjectId } from "bson";
import { GraphQLError } from 'graphql';
import { format_conversation_details, formated_chats } from "../../services/chatServices";
import { chatObjectTypeDef, chat_sender_TypeDef, conversationTypeDef, userTypeDef } from "../../config/typeConfig";
import { autoCompleteUser } from "../../services/socketIO/user";
import { getUser } from "../../services/userServices";
require('dotenv').config()

const mutation = {
    createUser: async (_: any, { name, email, password, username }: { name: string, email: string, password: string, username: string }) => {
        try {

            const userAlreadyExists = await User.findOne({ email });
            if (userAlreadyExists) throw new GraphQLError("USer already exists");

            const usernameAccountExists = await User.findOne({ username });
            if (usernameAccountExists) throw new GraphQLError("Username alreay taken");

            const encryptedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name, password: encryptedPassword, email, username
            })

            return newUser
        }
        catch (err) {
            return new Error("Something went wrong in signup")
        }
    },


    sendMessage: async (_: any, { receiverId, text, files }: { conversationId: string, receiverId: string, text: string, files: string[] }, context: any) => {
        try {
            let coversation: any = await DirectMessage.findOne({ members: { $all: [receiverId, context.user.id] } });

            if (!coversation) {
                coversation = await DirectMessage.create({ members: [receiverId, context.user.id] })
            }
            const message = await Message.create({ conversationId: coversation._id, sender: context.user.id, text, files });

            return true
        } catch(error) {
        throw new GraphQLError("Something went wrong in sendMessage");
    }
}
    
}

const queries = {

    fetchUsers: async () => {
        const users = await User.find({});
        console.log(users)
        return users
    },

    fetchUserDetailsWithEmail: async (_: any, { email }: { email: string }) => {
        try {
            const user = await getUser(null, email);
            return user;
        } catch (error) {
            console.log(error)
        }
    },

    fetchUserDetailsWithUsername: async (_: any, { username }: { username: string }) => {
        try {
            const user = await getUser(username, null);
            return user;
        } catch (error) {
            console.log(error)
        }
    },

    fetchUserWithEmail: async (_: any, { email, password }: { email: string, password: string }) => {
        try {

            const user = await User.findOne({ email });

            if (!user) return new Error("User does not exist")

            if (!bcrypt.compare(password, user.password)) return new Error("Password does not match")

            //console.log(process.env.JWT_SECRET)

            const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

            //console.log(process.env.JWT_SECRET)
            user.password = "I love mahiru"
            user.token = token
            return user

        }
        catch (err) {
            return err
        }
    },

    searchUser: async (_:any, {searchString}: {searchString: string}) => {
        try {
            console.log(searchString)
            const users = await User.find({ $text: { $search: searchString, $caseSensitive: false } });
            console.log(users);
        } catch (error) {
            console.log(error)
        }
        return true
    },

    userLogin: async (_: any, { email, password }: { email: string, password: string }) => {
        try {
            //console.log("userLogin called through graphql")
            const account = await User.findOne({ email });
            if (!account) throw new Error("User not found");
            if (!bcrypt.compare(password, account.password)) return new Error("Password do not match");
            const payload = {
                email: account.email,
                id: account._id
            }
            try {
                //console.log(process.env.JWT_SECRET)
                const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "72h" });
                account.token = token;
                return account;
            } catch (error) {
                throw new Error("Token generation failed");
            }

        } catch (error) {
            console.log(error)
        }
    },

    userChats: async (_: any, p: any, context: any) => {
        try {
            console.log("IN userChat")
            console.log(context.user.id)
            const chats = await DirectMessage.find({ members: { $in: [new ObjectId(context.user.id)] } }).populate({
                path: "members",
                match: { _id: { $ne: new ObjectId(context.user.id) } },
                select: "name username _id profileImageUrl blue"
            });

            console.log(chats)

            let formated_chats: conversationTypeDef[] = [];

            for(const chat of chats) {
                const latestChat = await Message.findOne({ conversationId: chat._id }).sort({ createdAt: -1 });
                const formated_chat_details = format_conversation_details(chat, context.user.id, latestChat);
                formated_chats.push(formated_chat_details);    
            };
            
            return formated_chats

        } catch (error) {
            console.log(error);
            throw new GraphQLError("Something went wrong in userChats");
        }
    },

    userChatMessages: async (_: any, { conversationId }: { conversationId: string }, context: any) => {
        try {
            const messages = await Message.find({ conversationId })
            

            const formated_object: chatObjectTypeDef[] = formated_chats(messages);

            return formated_object;
        } catch (error) {
            throw new GraphQLError("Something went wrong in userChat");
        }
    },

    specificUserConversationDetails: async (_: any, { to_username }: { to_username: string }, context: any) => {
        try {
            const toUser = await User.findOne({ username: to_username });
            if(!toUser) throw new GraphQLError("User not found");
            //console.log(toUser);

            const conversation: any = await DirectMessage.findOne({ members: { $all: [toUser._id, new ObjectId(context.user.id)] } }).populate({
                path: "members",
                match: { _id: { $ne: new ObjectId(context.user.id) } },
                select: "name username _id profileImageUrl blue"
            });
            //console.log(conversation);

            if(!conversation) {
                const formated_sender_details: chat_sender_TypeDef = {
                    conversation_id:       null,
                    to_user_id:            toUser._id as string,
                    to_user_display_name:  toUser.name,
                    to_user_profile_image: toUser.profileImageUrl,
                    to_user_blue:          toUser.blue,
                    to_user_username:      toUser.username,
                    from_user_id:          context.user.id,
                }
                return formated_sender_details;
            }

            const formated_sender_details: chat_sender_TypeDef = {
                conversation_id:       conversation._id,
                to_user_id:            conversation.members[0]?._id,
                to_user_display_name:  conversation.members[0]?.name,
                to_user_profile_image: conversation.members[0]?.profileImageUrl,
                to_user_blue:          conversation.members[0]?.blue,
                to_user_username:      conversation.members[0]?.username,
                from_user_id:          context.user.id,
            }
            //console.log(formated_sender_details);
            return formated_sender_details;

        } catch (error) {
            throw new GraphQLError("Something went wrong in specificUserConversationDetails");
        }
    },

    extraUserDetails: async (_: any, { username }: { username: string }) => {
        console.log(username)
        const user = await User.aggregate([
            {
                $match: { username }
            },
            {
                $addFields: {
                    user_bio: "$bio"
                }
            },
            {
                $lookup: {
                    from: 'follows',
                    localField: '_id',
                    foreignField: 'following',
                    as: 'following'
                },
            },
            {
                $addFields: {
                    followingCount: { $size: "$following" }

                }
            },
            {
                $lookup: {
                    from: 'follows', 
                    localField: '_id',
                    foreignField: 'follower',
                    as: 'followers'
                }
            },
            {
                $addFields: {
                    followersCount: { $size: "$followers" }
                }
            },
            {
                $project: {
                    bio: 1,
                    followingCount: 1,
                    followersCount: 1,
                    _id: 0
                }
            }
        ]);
        console.log(user[0]);
        return user[0];
    },

    latestJoinedUser: async () =>{
        const latest_user: userTypeDef[] | null = await User.find({}).sort({ createdAt: -1 }).limit(1);
        const latest_blue_user: userTypeDef[] | null = await User.find({ blue: true }).sort({ createdAt: -1}).limit(1);
        const user_object = {
            latest_user_dispalyname:        latest_user[0].name,
            latest_user_username:           latest_user[0].username,
            latest_user_profile_image:      latest_user[0].profileImageUrl,
            latest_user_blue:               latest_user[0].blue,
            latest_blue_user_dispalyname:   latest_blue_user[0].name,
            latest_blue_user_username:      latest_blue_user[0].username,
            latest_blue_user_profile_image: latest_blue_user[0].profileImageUrl,
            latest_blue_user_blue:          latest_blue_user[0].blue,
        }
        return user_object;
    },

    autoCompleteUser: async (_:any, {searchString}: {searchString: string}, context: any) => {
        try {
            if(searchString.length < 1) return [];
            const users = await autoCompleteUser(searchString);
            return users;
            
        } catch (error) {
            console.log("Error in autoCompleteUser", error);
            return [];
        }
    },
}

export const UserResolvers = { mutation, queries }