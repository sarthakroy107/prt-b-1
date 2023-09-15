import mongoose from "mongoose";
import Tweet from "../../models/Tweet";
import { GraphQLError } from 'graphql';
import User from "../../models/User";

const mutation = {
  createTweet: async (_: any, { text, files }: { text: string | undefined, files: [string] | undefined }, context: any) => {
    const tweet = await Tweet.create({ text, files, author_id: context.user.id});
    
    await User.findByIdAndUpdate(
      context.user.id,
      { $push: { tweets: tweet._id } }
    )
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

  createReply: async(_: any, { tweetId, repling_to, text, files }: { tweetId: string, repling_to: string, text: string | undefined, files: string[] | undefined }, context: any) => {

    const reply = await Tweet.create({
        text,
        files,
        in_reply_to_tweet_id: tweetId,
        author_id: context.user.id,
        in_reply: true,
        in_reply_to_user_id: repling_to
    })
    
    return reply
  }

}

const queries = {

  fetchUserTweets: async (_: any, p: any, context: any) => {
    
    try {
      const newTweets = await Tweet.aggregate([
        {
          $match: { author_id: new mongoose.Types.ObjectId(context.user.id) }
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
              $in: [new mongoose.Types.ObjectId(context.user.id), "$likes"]
            },
            replyCount: { $size: "$replies" },
            retweetCount: { $size: "$retweets" },
            isRetweeted: {
              $in: [new mongoose.Types.ObjectId(context.user.id), "$retweets"]
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

      return newTweets

    } catch (error) {
      throw new GraphQLError(`Something went wrong in fetchTweets ${error}`)
    }
  },

  fetchUserReplies: async(_:any, p:any, context: any) => {
    
    const replies = await Tweet.find({author_id: context.user.id, in_reply: true}).populate('author_id');

    let superArr = [];
    
    for (const reply of replies) {
      let arr: any = [];
      arr.push(reply);
      let condition = true;
      let p_id = reply.in_reply_to_tweet_id

      while(condition) {
        const parent_tweet = await Tweet.findById(p_id).populate('author_id');
        arr.push(parent_tweet)
        p_id = parent_tweet?.in_reply_to_tweet_id!
        condition = parent_tweet?.in_reply!
      }
      superArr.push(arr)
    }
    console.log("SuperArr: ", superArr)
    
    return superArr
  }
}

export const TweetResolver = { mutation, queries };