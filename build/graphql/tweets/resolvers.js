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
exports.TweetResolver = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Tweet_1 = __importDefault(require("../../models/Tweet"));
const graphql_1 = require("graphql");
const User_1 = __importDefault(require("../../models/User"));
const mutation = {
    createTweet: (_, { text, files }, context) => __awaiter(void 0, void 0, void 0, function* () {
        const tweet = yield Tweet_1.default.create({ text, files, author_id: context.user.id });
        yield User_1.default.findByIdAndUpdate(context.user.id, { $push: { tweets: tweet._id } });
        return tweet;
    }),
    deleteTweet: (_, { tweetId }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Tweet_1.default.deleteOne({ _id: tweetId });
            return true;
        }
        catch (error) {
            return false;
        }
    }),
    createReply: (_, { tweetId, repling_to, text, files }, context) => __awaiter(void 0, void 0, void 0, function* () {
        const reply = yield Tweet_1.default.create({
            text,
            files,
            in_reply_to_tweet_id: tweetId,
            author_id: context.user.id,
            in_reply: true,
            in_reply_to_user_id: repling_to
        });
        return reply;
    })
};
const queries = {
    fetchUserTweets: (_, p, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newTweets = yield Tweet_1.default.aggregate([
                {
                    $match: { author_id: new mongoose_1.default.Types.ObjectId(context.user.id) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author_id',
                        foreignField: '_id',
                        as: 'author_id'
                    }
                },
                {
                    $addFields: {
                        likeCount: { $size: "$likes" },
                        isLiked: {
                            $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$likes"]
                        },
                        replyCount: { $size: "$replies" },
                        retweetCount: { $size: "$retweets" },
                        isRetweeted: {
                            $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$retweets"]
                        },
                        quotetweetCount: { $size: "$quotetweets" },
                    }
                },
                {
                    $unwind: "$author_id"
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);
            console.log(newTweets);
            return newTweets;
        }
        catch (error) {
            throw new graphql_1.GraphQLError(`Something went wrong in fetchTweets ${error}`);
        }
    }),
    fetchUserReplies: (_, p, context) => __awaiter(void 0, void 0, void 0, function* () {
        const replies = yield Tweet_1.default.find({ author_id: context.user.id, in_reply: true }).populate('author_id');
        let superArr = [];
        for (const reply of replies) {
            let arr = [];
            arr.push(reply);
            let condition = true;
            let p_id = reply.in_reply_to_tweet_id;
            while (condition) {
                const parent_tweet = yield Tweet_1.default.findById(p_id).populate('author_id');
                arr.push(parent_tweet);
                p_id = parent_tweet === null || parent_tweet === void 0 ? void 0 : parent_tweet.in_reply_to_tweet_id;
                condition = parent_tweet === null || parent_tweet === void 0 ? void 0 : parent_tweet.in_reply;
            }
            superArr.push(arr);
        }
        console.log("SuperArr: ", superArr);
        return superArr;
    })
};
exports.TweetResolver = { mutation, queries };
