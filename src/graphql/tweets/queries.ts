export const Queries = `#graphql
    fetchUserTweets: [TweetCard]
    fetchUserReplies: [[TweetCard]]
    fetchAllTweets: [TweetCard]
    fetchSpecificTweet(tweetId: String!): TweetCard!
`