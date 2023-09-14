import mongoose from "mongoose";
import Tweet from "../../models/Tweet";
import { GraphQLError } from 'graphql';
import Reply from "../../models/Reply";

const mutation = {
  createTweet: async (_: any, { body, files }: { body: string | undefined, files: [string] | undefined }, context: any) => {
    const tweet = await Tweet.create({ body, files, author: context.user.id, category: "tweet" })

    return tweet
  },

  deleteTweet: async (_: any, { tweetId }: { tweetId: string }, context: any) => {
    try {
      await Tweet.deleteOne({ _id: tweetId })
      return true
    } catch (error) {
      return false
    }
  },
}

const queries = {
  fetchUserTweets: async (_: any, p: any, context: any) => {
    //console.log(context.user.id);
    try {
      const newTweets = await Tweet.aggregate([
        {
          $match: { author: new mongoose.Types.ObjectId(context.user.id) }
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
              $in: [new mongoose.Types.ObjectId(context.user.id), "$likes"]
            },
            replyCount: { $size: "$replies" },
            retweetCount: { $size: "$retweet" },
            isRetweeted: {
              $in: [new mongoose.Types.ObjectId(context.user.id), "$retweet"]
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

      return newTweets

    } catch (error) {
      throw new GraphQLError(`Something went wrong in fetchTweets ${error}`);
    }
  },

  fetchUserReplies:async (_: any, p: any, context: any) => {
    try {
      const replies = await Reply.aggregate([
        {
          $match: { author: context.user.id }
        }
      ]);
      return replies
    } catch (error) {
      throw new GraphQLError(`Something went wrong in fetchUserReplies. Error: ${error}`)
    }
  }

}

export const TweetResolver = { mutation, queries };