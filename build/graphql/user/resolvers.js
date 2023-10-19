"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolvers = void 0;
const DirectMessages_1 = __importDefault(require("../../models/DirectMessages"));
const Message_1 = __importDefault(require("../../models/Message"));
const User_1 = __importDefault(require("../../models/User"));
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const bson_1 = require("bson");
const graphql_1 = require("graphql");
const chatServices_1 = require("../../services/chatServices");
const user_1 = require("../../services/socketIO/user");
require('dotenv').config();
const mutation = {
    createUser: (_, { name, email, password, username }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userAlreadyExists = yield User_1.default.findOne({ email });
            if (userAlreadyExists)
                throw new graphql_1.GraphQLError("USer already exists");
            const usernameAccountExists = yield User_1.default.findOne({ username });
            if (usernameAccountExists)
                throw new graphql_1.GraphQLError("Username alreay taken");
            const encryptedPassword = yield bcrypt.hash(password, 10);
            const newUser = yield User_1.default.create({
                name, password: encryptedPassword, email, username
            });
            return newUser;
        }
        catch (err) {
            return new Error("Something went wrong in signup");
        }
    }),
    sendMessage: (_, { receiverId, text, files }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let coversation = yield DirectMessages_1.default.findOne({ members: { $all: [receiverId, context.user.id] } });
            if (!coversation) {
                coversation = yield DirectMessages_1.default.create({ members: [receiverId, context.user.id] });
            }
            const message = yield Message_1.default.create({ conversationId: coversation._id, sender: context.user.id, text, files });
            return true;
        }
        catch (error) {
            throw new graphql_1.GraphQLError("Something went wrong in sendMessage");
        }
    })
};
const queries = {
    fetchUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield User_1.default.find({});
        console.log(users);
        return users;
    }),
    fetchUserDetailsWithEmail: (_, { email }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const uSer = yield User_1.default.aggregate([
                {
                    $match: { email }
                },
                {
                    $lookup: {
                        from: 'tweets',
                        localField: '_id',
                        foreignField: 'author_id',
                        as: 'tweets'
                    }
                },
                {
                    $addFields: {
                        tweetCount: { $size: "$tweets" },
                        followersCount: { $size: "$followers" },
                        followingCount: { $size: "$following" }
                    }
                },
                {
                    $limit: 1
                }
            ]);
            //console.log("uSer: ")
            //console.log(uSer[0])
            return uSer[0];
        }
        catch (err) {
            console.log(err);
            throw new graphql_1.GraphQLError("Something went wrong in fetchUserDetailsWithEmail");
        }
    }),
    fetchUserDetailsWithUsername: (_, { username }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const uSer = yield User_1.default.aggregate([
                {
                    $match: { username }
                },
                {
                    $addFields: {
                        tweetCount: { $size: "$tweets" },
                        followersCount: { $size: "$followers" },
                        followingCount: { $size: "$following" }
                    }
                }
            ]);
            //console.log(uSer)
            const user = yield User_1.default.findOne({ username });
            if (!user)
                throw new graphql_1.GraphQLError(`User with email: ${username} does not exists`);
            //console.log(user);
            const extendedUser = Object.assign(Object.assign({}, user._doc), { tweetCount: user.tweets.length, followersCount: user.followers.length, followingCount: user.following.length });
            return extendedUser;
        }
        catch (err) {
            throw new graphql_1.GraphQLError("Something went wrong in fetchUserDetailsWithEmail");
        }
    }),
    fetchUserWithEmail: (_, { email, password }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({ email });
            if (!user)
                return new Error("User does not exist");
            if (!bcrypt.compare(password, user.password))
                return new Error("Password does not match");
            //console.log(process.env.JWT_SECRET)
            const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
            //console.log(process.env.JWT_SECRET)
            user.password = "I love mahiru";
            user.token = token;
            return user;
        }
        catch (err) {
            return err;
        }
    }),
    searchUser: (_, { searchString }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(searchString);
            const users = yield User_1.default.find({ $text: { $search: searchString, $caseSensitive: false } });
            console.log(users);
        }
        catch (error) {
            console.log(error);
        }
        return true;
    }),
    userLogin: (_, { email, password }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //console.log("userLogin called through graphql")
            const account = yield User_1.default.findOne({ email });
            if (!account)
                throw new Error("User not found");
            if (!bcrypt.compare(password, account.password))
                return new Error("Password do not match");
            const payload = {
                email: account.email,
                id: account._id
            };
            try {
                //console.log(process.env.JWT_SECRET)
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "72h" });
                account.token = token;
                return account;
            }
            catch (error) {
                throw new Error("Token generation failed");
            }
        }
        catch (error) {
            console.log(error);
        }
    }),
    userChats: (_, p, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("IN userChat");
            console.log(context.user.id);
            const chats = yield DirectMessages_1.default.find({ members: { $in: [new bson_1.ObjectId(context.user.id)] } }).populate({
                path: "members",
                match: { _id: { $ne: new bson_1.ObjectId(context.user.id) } },
                select: "name username _id profileImageUrl blue"
            });
            console.log(chats);
            let formated_chats = [];
            for (const chat of chats) {
                const latestChat = yield Message_1.default.findOne({ conversationId: chat._id }).sort({ createdAt: -1 });
                const formated_chat_details = (0, chatServices_1.format_conversation_details)(chat, context.user.id, latestChat);
                formated_chats.push(formated_chat_details);
            }
            ;
            return formated_chats;
        }
        catch (error) {
            console.log(error);
            throw new graphql_1.GraphQLError("Something went wrong in userChats");
        }
    }),
    userChatMessages: (_, { conversationId }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messages = yield Message_1.default.find({ conversationId });
            const formated_object = (0, chatServices_1.formated_chats)(messages);
            return formated_object;
        }
        catch (error) {
            throw new graphql_1.GraphQLError("Something went wrong in userChat");
        }
    }),
    specificUserConversationDetails: (_, { to_username }, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const toUser = yield User_1.default.findOne({ username: to_username });
            if (!toUser)
                throw new graphql_1.GraphQLError("User not found");
            //console.log(toUser);
            const conversation = yield DirectMessages_1.default.findOne({ members: { $all: [toUser._id, new bson_1.ObjectId(context.user.id)] } }).populate({
                path: "members",
                match: { _id: { $ne: new bson_1.ObjectId(context.user.id) } },
                select: "name username _id profileImageUrl blue"
            });
            //console.log(conversation);
            if (!conversation) {
                const formated_sender_details = {
                    conversation_id: null,
                    to_user_id: toUser._id,
                    to_user_display_name: toUser.name,
                    to_user_profile_image: toUser.profileImageUrl,
                    to_user_blue: toUser.blue,
                    to_user_username: toUser.username,
                    from_user_id: context.user.id,
                };
                return formated_sender_details;
            }
            const formated_sender_details = {
                conversation_id: conversation._id,
                to_user_id: (_a = conversation.members[0]) === null || _a === void 0 ? void 0 : _a._id,
                to_user_display_name: (_b = conversation.members[0]) === null || _b === void 0 ? void 0 : _b.name,
                to_user_profile_image: (_c = conversation.members[0]) === null || _c === void 0 ? void 0 : _c.profileImageUrl,
                to_user_blue: (_d = conversation.members[0]) === null || _d === void 0 ? void 0 : _d.blue,
                to_user_username: (_e = conversation.members[0]) === null || _e === void 0 ? void 0 : _e.username,
                from_user_id: context.user.id,
            };
            //console.log(formated_sender_details);
            return formated_sender_details;
        }
        catch (error) {
            throw new graphql_1.GraphQLError("Something went wrong in specificUserConversationDetails");
        }
    }),
    extraUserDetails: (_, { username }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(username);
        const user = yield User_1.default.aggregate([
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
    }),
    latestJoinedUser: () => __awaiter(void 0, void 0, void 0, function* () {
        const latest_user = yield User_1.default.find({}).sort({ createdAt: -1 }).limit(1);
        const latest_blue_user = yield User_1.default.find({ blue: true }).sort({ createdAt: -1 }).limit(1);
        const user_object = {
            latest_user_dispalyname: latest_user[0].name,
            latest_user_username: latest_user[0].username,
            latest_user_profile_image: latest_user[0].profileImageUrl,
            latest_user_blue: latest_user[0].blue,
            latest_blue_user_dispalyname: latest_blue_user[0].name,
            latest_blue_user_username: latest_blue_user[0].username,
            latest_blue_user_profile_image: latest_blue_user[0].profileImageUrl,
            latest_blue_user_blue: latest_blue_user[0].blue,
        };
        return user_object;
    }),
    autoCompleteUser: (_, { searchString }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, user_1.autoCompleteUser)(searchString);
            console.log(users);
            return users;
        }
        catch (error) {
            console.log("Error in autoCompleteUser", error);
            return [];
        }
    })
};
exports.UserResolvers = { mutation, queries };
