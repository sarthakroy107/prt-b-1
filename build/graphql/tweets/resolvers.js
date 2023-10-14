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
const tweetSeivices_1 = require("../../services/tweetSeivices");
const Like_1 = __importDefault(require("../../models/Like"));
const Bookmark_1 = __importDefault(require("../../models/Bookmark"));
const mutation = {
    createTweet: (_, { text, files }, context) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(text, files);
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
        const newReply = yield Tweet_1.default.aggregate([
            {
                $match: { _id: reply._id }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author_id',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $addFields: {
                    in_reply_to_username: {
                        $arrayElemAt: ['$author.username', 0]
                    },
                    author_display_name: {
                        $arrayElemAt: ['$author.name', 0]
                    },
                    author_username: {
                        $arrayElemAt: ['$author.username', 0]
                    },
                    author_profile_image: {
                        $arrayElemAt: ['$author.profileImageUrl', 0]
                    },
                    likeCount: { $size: "$likes" },
                    isLiked: {
                        $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$likes"]
                    },
                    replyCount: { $size: "$replies" },
                    retweetCount: { $size: "$retweets" },
                    isRetweeted: {
                        $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$retweets"]
                    },
                    quotetweetCount: { $size: "$quotetweets" }
                }
            },
            {
                $project: {
                    author: 0,
                }
            },
            {
                $lookup: {
                    from: 'follows',
                    let: {
                        author_id: "$author_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: [context.user.id, "$members"] },
                                        { $eq: ["$author_id", "$$author_id"] },
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'isFollowing'
                }
            },
            {
                $addFields: {
                    isFollowing: { $cond: { if: { $gt: [{ $size: "$isFollowing" }, 0] }, then: true, else: false } }
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'bookmarks'
                }
            },
            {
                $addFields: {
                    isBookmarked: {
                        $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$bookmarks.user_id"]
                    },
                    bookmarkCount: { $size: "$bookmarks" }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        const formated_reply = (0, tweetSeivices_1.format_tweet_to_respose_format)(newReply[0]);
        console.log(formated_reply);
        return formated_reply;
    }),
    likeTweet: (_, { tweetId }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const create_like = yield Like_1.default.create({ tweet_id: tweetId, user_id: context.user.id });
            console.log(create_like);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }),
    unlikeTweet: (_, { tweetId }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Like_1.default.findOneAndDelete({ tweet_id: tweetId, user_id: context.user.id });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }),
    bookmarkTweet: (_, { tweetId }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const create_bookmark = yield Bookmark_1.default.create({ tweet_id: tweetId, user_id: context.user.id });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }),
    unbookmarkTweet: (_, { tweetId }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Bookmark_1.default.findOneAndDelete({ tweet_id: tweetId, user_id: context.user.id });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    })
};
const queries = {
    fetchAllTweets: (_, p, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tweet_ids = yield Tweet_1.default.find({ in_reply: false }).select("_id").sort({ createdAt: -1 });
            let response_tweet_array = [];
            for (const tweet_id of tweet_ids) {
                console.log(tweet_id);
                const tweet = yield (0, tweetSeivices_1.getTweets)(tweet_id._id, context);
                console.log(tweet);
                response_tweet_array.push(tweet);
            }
            return response_tweet_array;
        }
        catch (error) {
            console.log(error);
            throw new graphql_1.GraphQLError(`Something went wrong in fetchTweets ${error}`);
        }
    }),
    fetchUserTweets: (_, p, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tweet_ids = yield Tweet_1.default.find({ author_id: context.user.id, in_reply: false }).select("_id").sort({ createdAt: -1 });
            let response_tweet_array = [];
            for (const tweet_id of tweet_ids) {
                console.log(tweet_id);
                const tweet = yield (0, tweetSeivices_1.getTweets)(tweet_id._id, context);
                response_tweet_array.push(tweet);
            }
            console.log(response_tweet_array);
            return response_tweet_array;
        }
        catch (error) {
            throw new graphql_1.GraphQLError(`Something went wrong in fetchTweets ${error}`);
        }
    }),
    fetchUserReplies: (_, p, context) => __awaiter(void 0, void 0, void 0, function* () {
        const reply_ids = yield Tweet_1.default.find({ author_id: context.user.id, in_reply: true }).select("_id").sort({ createdAt: -1 });
        let memorization_array = [];
        let i = 0, j = 0;
        let super_array = [];
        const find_reply_is_present = (id, position) => {
            //@ts-ignore
            return memorization_array.find(item => item.id.equals(id));
        };
        for (const reply_id of reply_ids) {
            let arr = [];
            let condition = true;
            let in_reply_to = reply_id._id;
            let new_reply = false;
            while (condition) {
                let reply;
                //@ts-ignore
                const reply_is_present = find_reply_is_present(in_reply_to);
                if (reply_is_present) {
                    reply = super_array[reply_is_present.position[0]][reply_is_present.position[1]];
                }
                else {
                    reply = yield (0, tweetSeivices_1.getTweets)(in_reply_to, context);
                    const obj = {
                        id: reply === null || reply === void 0 ? void 0 : reply._id,
                        position: [i, j]
                    };
                    memorization_array.push(obj);
                    new_reply = true;
                }
                j = j + 1;
                arr.push(reply);
                condition = reply === null || reply === void 0 ? void 0 : reply.in_reply;
                in_reply_to = reply === null || reply === void 0 ? void 0 : reply.in_reply_to_tweet_id;
            }
            if (new_reply) {
                super_array.push(arr);
            }
            i = i + 1;
        }
        for (const arr of super_array) {
            arr.sort((a, b) => {
                //@ts-ignore
                return new Date(a.created_at) - new Date(b.created_at);
            });
        }
        return super_array;
    }),
    fetchSpecificTweet: (_, { tweetId }, context) => __awaiter(void 0, void 0, void 0, function* () {
        const tweet_id = new mongoose_1.default.Types.ObjectId(tweetId);
        const tweet = yield (0, tweetSeivices_1.getTweets)(tweet_id, context);
        return tweet;
    }),
};
exports.TweetResolver = { mutation, queries };
