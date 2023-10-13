import mongoose from "mongoose";
import Tweet from "../../models/Tweet";
import { GraphQLError } from 'graphql';
import User from "../../models/User";
import { format_tweet_to_respose_format } from "../../services/tweetSeivices";

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
    
    return reply
  }

}

const queries = {

  fetchAllTweets: async (_: any, p: any, context: any) => {
    try {
      const tweet_ids = await Tweet.find({ in_reply: false }).select("_id").sort( { createdAt: -1 } );

      let response_tweet_array = [];

      for(const tweet_id of tweet_ids) {
        console.log(tweet_id)
        const tweet = await Tweet.aggregate([
          {
            $match: { _id: tweet_id._id }
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
            $lookup: {
              from: 'users',
              localField: 'in_reply_to_user_id',
              foreignField: '_id',
              as: 'in_reply_to_user_id_field'
            }
          },
          {
            $addFields: {
              in_reply_to_username: {
                $arrayElemAt: ['$in_reply_to_user_id_field.username', 0]
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
              quotetweetCount: { $size: "$quotetweets" },
            }
          },
          {
            $project: {
              author: 0, 
              in_reply_to_user_id_field: 0
            }
          },
          {
            $sort: { createdAt: -1 }
          },
        ]);
        console.log(tweet)
        const formated_tweet = format_tweet_to_respose_format(tweet[0]);
        response_tweet_array.push(formated_tweet)
      }

      //console.log(response_tweet_array);

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
        const tweet = await Tweet.aggregate([
          {
            $match: { _id: tweet_id._id }
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
            $lookup: {
              from: 'users',
              localField: 'in_reply_to_user_id',
              foreignField: '_id',
              as: 'in_reply_to_user_id_field'
            }
          },
          {
            $addFields: {
              in_reply_to_username: {
                $arrayElemAt: ['$in_reply_to_user_id_field.username', 0]
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
              quotetweetCount: { $size: "$quotetweets" },
            }
          },
          {
            $project: {
              author: 0, 
              in_reply_to_user_id_field: 0
            }
          },
          {
            $sort: { createdAt: -1 }
          },
        ]);
        console.log(tweet)
        const formated_tweet = format_tweet_to_respose_format(tweet[0]);
        response_tweet_array.push(formated_tweet)
      }

      console.log(response_tweet_array);

      return response_tweet_array

    } catch (error) {
      throw new GraphQLError(`Something went wrong in fetchTweets ${error}`)
    }
  },

  fetchUserReplies: async(_:any, p:any, context: any) => {

    const reply_ids = await Tweet.find({ author_id: context.user.id, in_reply: true }).select("_id").sort( { createdAt: -1 } );
    //console.log("Reply ids: ",reply_ids)
    
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
      let in_reply_to: any = reply_id._id;
      let new_reply = false;

      while(condition) {

        let reply;
        //@ts-ignore
        const reply_is_present = find_reply_is_present(in_reply_to);

        if(reply_is_present) {
          reply = super_array[reply_is_present.position[0]][reply_is_present.position[1]]
        }
        else {

          const new_reply_aggregate = await Tweet.aggregate([
            {
              $match: { _id: new mongoose.Types.ObjectId(in_reply_to) }
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
              $lookup: {
                from: 'users',
                localField: 'in_reply_to_user_id',
                foreignField: '_id',
                as: 'in_reply_to_user_id_field'
              }
            },
            {
              $addFields: {
                in_reply_to_username: {
                  $arrayElemAt: ['$in_reply_to_user_id_field.username', 0]
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
                quotetweetCount: { $size: "$quotetweets" },
              }
            },
            {
              $project: {
                author: 0, 
                in_reply_to_user_id_field: 0
              }
            },
            {
              $sort: { createdAt: -1 }
            },
          ]);
          
          
          reply = format_tweet_to_respose_format(new_reply_aggregate[0])

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
  }
}

export const TweetResolver = { mutation, queries }