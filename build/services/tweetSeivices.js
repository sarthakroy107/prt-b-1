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
exports.getReplies = exports.getTweets = exports.format_tweet_to_respose_format = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Tweet_1 = __importDefault(require("../models/Tweet"));
const format_tweet_to_respose_format = (tweet) => {
    console.log(tweet);
    const response_obj = {
        _id: tweet._id,
        author_display_name: tweet.author_display_name,
        author_username: tweet.author_username,
        author_profile_image: tweet.author_profile_image,
        text: tweet.text,
        files: tweet.files,
        is_liked: tweet.isLiked,
        like_count: tweet.likeCount,
        is_retweeted: tweet.isRetweeted,
        retweet_count: tweet.retweetCount,
        quotetweet_count: tweet.quotetweetCount,
        reply_count: tweet.replyCount,
        is_sensitive: tweet.possibly_sensitive,
        in_reply: tweet.in_reply,
        in_reply_to_user_id: tweet.in_reply_to_user_id,
        in_reply_to_tweet_id: tweet.in_reply_to_tweet_id === undefined || null ? null : tweet.in_reply_to_tweet_id,
        in_reply_to_username: tweet.in_reply_to_username === undefined || null ? null : tweet.in_reply_to_username,
        created_at: tweet.createdAt,
        updated_at: tweet.updatedAt,
        views_count: tweet.viewsCount,
        is_following: tweet.isFollowing,
        is_bookmarked: tweet.isBookmarked,
        bookmark_count: tweet.bookmarkCount,
    };
    console.log(response_obj);
    return response_obj;
};
exports.format_tweet_to_respose_format = format_tweet_to_respose_format;
const getTweets = (tweet_id, context) => __awaiter(void 0, void 0, void 0, function* () {
    const pipelineForReplies = [
        {
            $match: { in_reply_to_tweet_id: tweet_id }
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
                replyCount: { $size: "$replies" },
                retweetCount: { $size: "$retweets" },
                isRetweeted: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$retweets"]
                },
                quotetweetCount: { $size: "$quotetweets" }
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
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'tweet_id',
                as: 'likes'
            }
        },
        {
            $addFields: {
                isLiked: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$likes.user_id"]
                },
                likeCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                author: 0,
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ];
    const pipelineForSpecificTweet = [
        {
            $match: { _id: tweet_id }
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
                replyCount: { $size: "$replies" },
                retweetCount: { $size: "$retweets" },
                isRetweeted: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$retweets"]
                },
                quotetweetCount: { $size: "$quotetweets" }
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
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'tweet_id',
                as: 'likes'
            }
        },
        {
            $addFields: {
                isLiked: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$likes.user_id"]
                },
                likeCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                author: 0,
            }
        },
    ];
    const tweet = yield Tweet_1.default.aggregate([
        {
            $match: { _id: tweet_id }
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
                replyCount: { $size: "$replies" },
                retweetCount: { $size: "$retweets" },
                isRetweeted: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$retweets"]
                },
                quotetweetCount: { $size: "$quotetweets" }
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
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'tweet_id',
                as: 'likes'
            }
        },
        {
            $addFields: {
                isLiked: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$likes.user_id"]
                },
                likeCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                author: 0
            }
        },
    ]);
    const formated_tweet = (0, exports.format_tweet_to_respose_format)(tweet[0]);
    return formated_tweet;
});
exports.getTweets = getTweets;
const getReplies = (tweet_id, context) => __awaiter(void 0, void 0, void 0, function* () {
    const replies_arr = [];
    const replies = yield Tweet_1.default.aggregate([
        {
            $match: { in_reply_to_tweet_id: tweet_id }
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
                replyCount: { $size: "$replies" },
                retweetCount: { $size: "$retweets" },
                isRetweeted: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$retweets"]
                },
                quotetweetCount: { $size: "$quotetweets" }
            }
        },
        {
            $lookup: {
                from: 'follows',
                localField: 'author_id',
                foreignField: 'following',
                as: 'following'
            }
        },
        {
            $addFields: {
                isFollowing: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$following.follower"]
                }
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
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'tweet_id',
                as: 'likes'
            }
        },
        {
            $addFields: {
                isLiked: {
                    $in: [new mongoose_1.default.Types.ObjectId(context.user.id), "$likes.user_id"]
                },
                likeCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                author: 0,
                bookmarks: 0,
                likes: 0,
            }
        },
    ]);
    for (const reply of replies) {
        const reply_arr = [];
        const formated_reply = (0, exports.format_tweet_to_respose_format)(reply);
        reply_arr.push(formated_reply);
        // const reply_of_reply = await Tweet.aggregate([
        //     {
        //         $match: { in_reply_to_tweet_id: formated_reply._id, author_id: reply.author_id }
        //     },
        //     {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'author_id',
        //             foreignField: '_id',
        //             as: 'author'
        //         }
        //     },
        //     {
        //         $addFields: {
        //             in_reply_to_username: {
        //                 $arrayElemAt: ['$author.username', 0]
        //             },
        //             author_display_name: {
        //                 $arrayElemAt: ['$author.name', 0]
        //             },
        //             author_username: {
        //                 $arrayElemAt: ['$author.username', 0]
        //             },
        //             author_profile_image: {
        //                 $arrayElemAt: ['$author.profileImageUrl', 0]
        //             },
        //             replyCount: { $size: "$replies" },
        //             retweetCount: { $size: "$retweets" },
        //             isRetweeted: {
        //                 $in: [new mongoose.Types.ObjectId(context.user.id), "$retweets"]
        //             },
        //             quotetweetCount: { $size: "$quotetweets" }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'follows',
        //             localField: 'author_id',
        //             foreignField: 'following',
        //             as: 'following'
        //         }
        //     },
        //     {
        //         $addFields: {
        //             isFollowing: {
        //                 $in: [new mongoose.Types.ObjectId(context.user.id), "$following.follower"]
        //             }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'bookmarks',
        //             localField: '_id',
        //             foreignField: 'tweet_id',
        //             as: 'bookmarks'
        //         }
        //     },
        //     {
        //         $addFields: {
        //             isBookmarked: {
        //                 $in: [new mongoose.Types.ObjectId(context.user.id), "$bookmarks.user_id"]
        //             },
        //             bookmarkCount: { $size: "$bookmarks" }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'likes',
        //             localField: '_id',
        //             foreignField: 'tweet_id',
        //             as: 'likes'
        //         }
        //     },
        //     {
        //         $addFields: {
        //             isLiked: {
        //                 $in: [new mongoose.Types.ObjectId(context.user.id), "$likes.user_id"]
        //             },
        //             likeCount: { $size: "$likes" }
        //         }
        //     },
        //     {
        //         $project: {
        //             author: 0,
        //             bookmarks: 0,
        //             likes: 0,
        //         }
        //     },
        // ]);
        // if(reply_of_reply.length > 0) {
        //     const formated_reply_of_reply = format_tweet_to_respose_format(reply_of_reply[0]);
        //     reply_arr.push(formated_reply_of_reply);
        // }
        replies_arr.push(reply_arr);
    }
    return replies_arr;
});
exports.getReplies = getReplies;
