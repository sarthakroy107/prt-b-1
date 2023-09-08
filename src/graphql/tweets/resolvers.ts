import Tweet from "../../models/Tweet";

const mutation = {
    createTweet: async(_:any, {body, files}: {body: string| undefined, files: [string] | undefined}, context:any) => {
        const tweet = await Tweet.create({body, files, author: context.user.id})
        console.log(tweet);
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

}

export const TweetResolver = { mutation, queries };