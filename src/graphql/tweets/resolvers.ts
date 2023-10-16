import mongoose from "mongoose";
import Tweet from "../../models/Tweet";
import { GraphQLError } from 'graphql';
import User from "../../models/User";
import { format_tweet_to_respose_format, getReplies, getTweets } from "../../services/tweetSeivices";
import { get } from "https";
import { chatObjectTypeDef, responeTypeDef } from "../../config/typeConfig";
import Likes from "../../models/Like";
import Bookmarks from "../../models/Bookmark";

const mutation = {
  createTweet: async (_: any, { text, files }: { text: string | undefined, files: [string] | undefined }, context: any) => {
    console.log(text, files)
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

    const newReply = await Tweet.aggregate([
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
            $in: [new mongoose.Types.ObjectId(context.user.id), "$likes"]
          },
          replyCount: { $size: "$replies" },
          retweetCount: { $size: "$retweets" },
          isRetweeted: {
            $in: [new mongoose.Types.ObjectId(context.user.id), "$retweets"]
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
            $in: [new mongoose.Types.ObjectId(context.user.id), "$bookmarks.user_id"]
          },
          bookmarkCount: { $size: "$bookmarks" }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    const formated_reply = format_tweet_to_respose_format(newReply[0]);

    console.log(formated_reply)
    
    return formated_reply
  },

  likeTweet: async (_: any, { tweetId }: { tweetId: string }, context: any) => {

    try {
      const create_like = await Likes.create({ tweet_id: tweetId, user_id: context.user.id })
      console.log(create_like)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },

  unlikeTweet: async (_: any, { tweetId }: { tweetId: string }, context: any) => {
    try {
      await Likes.findOneAndDelete({ tweet_id: tweetId, user_id: context.user.id })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },

  bookmarkTweet: async (_: any, { tweetId }: { tweetId: string }, context: any) => {
    try {
      const create_bookmark = await Bookmarks.create({ tweet_id: tweetId, user_id: context.user.id })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },

  unbookmarkTweet: async (_: any, { tweetId }: { tweetId: string }, context: any) => {
    try {
      await Bookmarks.findOneAndDelete({ tweet_id: tweetId, user_id: context.user.id })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}

const queries = {

  fetchAllTweets: async (_: any, p: any, context: any) => {
    try {
      const tweet_ids = await Tweet.find({ in_reply: false }).select("_id").sort( { createdAt: -1 } );

      let response_tweet_array = [];

      for(const tweet_id of tweet_ids) {
        console.log(tweet_id)
        const tweet = await getTweets(tweet_id._id, context)
        console.log(tweet)
        response_tweet_array.push(tweet)
      }

      return response_tweet_array

    } catch (error) {
      console.log(error)
      throw new GraphQLError(`Something went wrong in fetchTweets ${error}`)
    }
  },

  fetchUserTweets: async (_: any, p: any, context: any) => {
    
    try {
      const tweet_ids = await Tweet.find({ author_id: context.user.id, in_reply: false }).select("_id").sort( { createdAt: -1 } );

      let response_tweet_array = [];

      for(const tweet_id of tweet_ids) {
        console.log(tweet_id)
        const tweet = await getTweets(tweet_id._id, context)
        
        response_tweet_array.push(tweet)
      }

      console.log(response_tweet_array);

      return response_tweet_array

    } catch (error) {
      throw new GraphQLError(`Something went wrong in fetchTweets ${error}`)
    }
  },

  fetchUserReplies: async(_:any, p:any, context: any) => {

    const reply_ids = await Tweet.find({ author_id: context.user.id, in_reply: true }).select("_id").sort( { createdAt: -1 } );
    
    let memorization_array: any = [];
    let i = 0, j = 0;
    let super_array: any = [];
    
    const find_reply_is_present = (id: mongoose.Types.ObjectId, position: [number, number]) => {
      //@ts-ignore
      return memorization_array.find(item => item.id.equals(id));
    }
    
    for(const reply_id of reply_ids) {

      let arr = [];
      let condition: boolean | undefined = true;
      let in_reply_to: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId = reply_id._id;
      let new_reply = false;

      while(condition) {

        let reply;
        //@ts-ignore
        const reply_is_present = find_reply_is_present(in_reply_to);

        if(reply_is_present) {
          reply = super_array[reply_is_present.position[0]][reply_is_present.position[1]]
        }
        else {

          reply = await getTweets(in_reply_to, context)

          const obj = {
            id: reply?._id,
            position: [ i, j ]
          }
          memorization_array.push(obj)
          new_reply = true;
        }
        j = j + 1;
        arr.push(reply)

        condition = reply?.in_reply;
        in_reply_to = reply?.in_reply_to_tweet_id
        
      }
      if(new_reply)  {
        super_array.push(arr)
      }
      i = i + 1;
    }
    
    for(const arr of super_array) {
      arr.sort((a: any,b: any) => {
        //@ts-ignore
        return new Date(a.created_at) - new Date(b.created_at);
      })
    }
    
    return super_array
  },
  
  fetchSpecificTweet: async (_: any, { tweetId }: { tweetId: string }, context: any) => {
    const tweet_id = new mongoose.Types.ObjectId(tweetId);
    const tweet: responeTypeDef = await getTweets(tweet_id, context);
    return tweet
  },

  fetchRepliesForSpecifivTweet: async (_: any, { tweetId, offset }: { tweetId: string, offset: string }, context: any) => {
    console.log( tweetId, offset )
    const replies: responeTypeDef[][] = await getReplies(new mongoose.Types.ObjectId(tweetId), context);
    console.log(replies)
    return replies;
  },
}

export const TweetResolver = { mutation, queries }