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
          $match: { author_id: new mongoose.Types.ObjectId(context.user.id), in_reply: false }
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

    const reply_ids = await Tweet.find({ author_id: context.user.id, in_reply: true }).select("_id");
    console.log("Reply ids: ",reply_ids)
    
    let memorization_array: any = [];
    let i = 0, j = 0;
    let super_array: any = [];
    
    const find_reply_is_present = (id: mongoose.Types.ObjectId, position: [number, number]) => {
      //@ts-ignore
      return memorization_array.find(item => item.id.equals(id));
    }
    
    for(const reply_id of reply_ids) {

      let arr = [];
      let condition: boolean | undefined = true
      let in_reply_to: any = reply_id._id

      while(condition) {
        let reply;
        //@ts-ignore
        const reply_is_present = find_reply_is_present(in_reply_to);
        if(reply_is_present) {
          reply = super_array[reply_is_present.position[0]][reply_is_present.position[1]]
        }
        else {
          reply = await Tweet.findById(in_reply_to);
          const obj = {
            id: reply?._id,
            position: [ i, j ]
          }
          memorization_array.push(obj)
        }
        j = j + 1;
        arr.push(reply)
        condition = reply?.in_reply;
        in_reply_to = reply?.in_reply_to_tweet_id
        
      }
      super_array.push(arr)
      i = i + 1;
    }
    
    console.log("super_array: ", super_array)
    console.log("memorization_array", memorization_array)
    return {}
  }
}

export const TweetResolver = { mutation, queries };