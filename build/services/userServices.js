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
exports.getUser = exports.format_user_details = void 0;
const User_1 = __importDefault(require("../models/User"));
const format_user_details = (user) => {
    const object = {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profile_image: user.profile_image,
        banner: user.banner,
        blue: user.blue,
        bio: user.bio,
        tweet_count: user.tweetCount,
        reply_count: user.replyCount,
        follower_count: user.followersCount,
        following_count: user.followingCount,
        createdAt: user.createdAt
    };
    return object;
};
exports.format_user_details = format_user_details;
const getUser = (username = null, email = null) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("username->", username);
    console.log("email->", email);
    try {
        const withUsername = [
            {
                $match: { username: username }
            },
            {
                $addFields: {
                    name: "$name",
                    username: "$username",
                    bio: "$bio",
                    email: "$email",
                    profile_image: "$profileImageUrl",
                    banner: "$banner",
                    blue: "$blue",
                    token: "$token",
                    createdAt: "$createdAt",
                }
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "following",
                    as: "followers"
                }
            },
            {
                $addFields: {
                    followersCount: {
                        $size: "$followers"
                    }
                }
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "follows",
                    as: "following"
                }
            },
            {
                $addFields: {
                    followingCount: {
                        $size: "$following"
                    }
                }
            },
            {
                $lookup: {
                    from: "tweets",
                    localField: "_id",
                    foreignField: "author_id",
                    as: "tweets"
                }
            },
            {
                $project: {
                    followingCount: 1,
                    followersCount: 1,
                    name: 1,
                    username: 1,
                    bio: 1,
                    email: 1,
                    profile_image: 1,
                    banner: 1,
                    blue: 1,
                    token: 1,
                    createdAt: 1,
                    tweetCount: {
                        $size: {
                            $filter: {
                                input: "$tweets",
                                as: "tweet",
                                cond: { $not: "$$tweet.in_reply" }
                            }
                        }
                    },
                    replyCount: {
                        $size: {
                            $filter: {
                                input: "$tweets",
                                as: "tweet",
                                cond: "$$tweet.in_reply"
                            }
                        }
                    },
                }
            }
        ];
        const withEmail = [
            {
                $match: { email: email }
            },
            {
                $addFields: {
                    name: "$name",
                    username: "$username",
                    bio: "$bio",
                    email: "$email",
                    profile_image: "$profileImageUrl",
                    banner: "$banner",
                    blue: "$blue",
                    token: "$token",
                    createdAt: "$createdAt",
                }
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "following",
                    as: "followers"
                }
            },
            {
                $addFields: {
                    followersCount: {
                        $size: "$followers"
                    }
                }
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "follows",
                    as: "following"
                }
            },
            {
                $addFields: {
                    followingCount: {
                        $size: "$following"
                    }
                }
            },
            {
                $lookup: {
                    from: "tweets",
                    localField: "_id",
                    foreignField: "author_id",
                    as: "tweets"
                }
            },
            {
                $project: {
                    followingCount: 1,
                    followersCount: 1,
                    name: 1,
                    username: 1,
                    bio: 1,
                    email: 1,
                    profile_image: 1,
                    banner: 1,
                    blue: 1,
                    token: 1,
                    createdAt: 1,
                    tweetCount: {
                        $size: {
                            $filter: {
                                input: "$tweets",
                                as: "tweet",
                                cond: { $not: "$$tweet.in_reply" }
                            }
                        }
                    },
                    replyCount: {
                        $size: {
                            $filter: {
                                input: "$tweets",
                                as: "tweet",
                                cond: "$$tweet.in_reply"
                            }
                        }
                    },
                }
            }
        ];
        if (!username && !email) {
            throw new Error("No username or email provided");
        }
        else if (username) {
            const user = yield User_1.default.aggregate(withUsername);
            if (user.length === 0)
                throw new Error("No user found");
            const formated_details = (0, exports.format_user_details)(user[0]);
            return formated_details;
        }
        else if (email) {
            const user = yield User_1.default.aggregate(withEmail);
            if (user.length === 0)
                throw new Error("No user found");
            const formated_details = (0, exports.format_user_details)(user[0]);
            return formated_details;
        }
        else {
            throw new Error("No username or email provided");
        }
    }
    catch (error) {
        console.log("Error while fetching user details->", error);
    }
});
exports.getUser = getUser;
