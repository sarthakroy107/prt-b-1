import { userType } from "../config/typeConfig"
import User from "../models/User"

export const format_user_details = (user: any): userType => {
    const object: userType = {
        id:              user._id,
        name:            user.name,
        email:           user.email,
        username:        user.username,
        profile_image: user.profile_image,
        banner:          user.banner,
        blue:            user.blue,
        bio:             user.bio,
        tweet_count:      user.tweetCount,
        reply_count:      user.replyCount,
        follower_count:   user.followersCount,
        following_count:  user.followingCount,
        createdAt:       user.createdAt
    }
    return object;
}

export const getUser = async (username: string |null = null, email: string | null = null) => {
    console.log("username->", username)
    console.log("email->", email)
  try {
    const withUsername = [
        {
            $match: { username: username}
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
    ]

    const withEmail = [
        {
            $match: { email: email}
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
    ]

    if(!username && !email) {
        throw new Error("No username or email provided")
    }
    else if(username) {
        const user = await User.aggregate(withUsername);

        if(user.length === 0) throw new Error("No user found");

        const  formated_details: userType = format_user_details(user[0]);
        return formated_details;
    }
    else if(email) {
        const user = await User.aggregate(withEmail);

        if(user.length === 0) throw new Error("No user found");

        const  formated_details: userType = format_user_details(user[0]);
        return formated_details;
    }
    else {
        throw new Error("No username or email provided")
    }
  } catch (error) {
    console.log("Error while fetching user details->", error)
  }
}