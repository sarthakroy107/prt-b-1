import Tweet from "../../models/Tweet";
import { GraphQLError } from 'graphql';

const mutation = {
    createTweet: async(_:any, {body, files}: {body: string| undefined, files: [string] | undefined}, context:any) => {
        const tweet = await Tweet.create({body, files, author: context.user.id})
        //console.log(tweet);
        return tweet
    },
    deleteTweet: async(_:any, {tweetId}: {tweetId: string}, context:any) => {
        try {
            await Tweet.deleteOne({_id:tweetId})
        return true
        } catch (error) {
            return false
        }
    },
}

const queries = {
    fetchUserTweets: async(_: any, p: any, context: any) => {
        console.log(context.user.id);
        try {
            const tweets = await Tweet.find({ author: context.user.id }).populate('author').sort({ createdAt: -1 });
    
            const extendedTweeets = tweets.map((tweet) => {

                const likeCount = tweet.likes.length;
    
                const userHasLiked = tweet.likes.includes(context.user.id);
    
                return {
                    //@ts-ignore
                    ...tweet._doc,
                    likeCount,
                    likes: userHasLiked ? [context.user.id] : [],
                };
                //return tweets
            });
    
            console.log(extendedTweeets);
    
            return extendedTweeets;
        } catch (error) {
            throw new GraphQLError(`Something went wrong in fetchTweets ${error}`);
        }
    }
    
}

export const TweetResolver = { mutation, queries };