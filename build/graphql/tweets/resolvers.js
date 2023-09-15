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
const mutation = {
    createTweet: (_, { body, files }, context) => __awaiter(void 0, void 0, void 0, function* () {
        const tweet = yield Tweet_1.default.create({ body, files, author: context.user.id, category: "tweet" });
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
};
const queries = {
    fetchUserTweets: (_, p, context) => __awaiter(void 0, void 0, void 0, function* () {
        //console.log(context.user.id);
        try {
            const newTweets = yield Tweet_1.default.aggregate([
                {
                    $match: { author: new mongoose_1.default.Types.ObjectId(context.user.id) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $addFields: {
                        likeCount: { $size: "$likes" },
                        isLiked: {
                            $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$likes"]
                        },
                        replyCount: { $size: "$replies" },
                        retweetCount: { $size: "$retweet" },
                        isRetweeted: {
                            $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$retweet"]
                        },
                        quotetweet: { $size: "$quotetweet" },
                    }
                },
                {
                    $unwind: "$author"
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
    })
};
exports.TweetResolver = { mutation, queries };
