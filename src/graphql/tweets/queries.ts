export const Queries = `#graphql
    fetchUserTweets: [TweetCard]
    fetchUserReplies: [[TweetCard]]
    fetchAllTweets: [TweetCard]
    fetchSpecificTweet(tweetId: String!): TweetCard!
    fetchRepliesForSpecifivTweet(tweetId: String!, offset: Int!): [[TweetCard]]
    fetchSearchData(q: String!, s: String): [TweetCard]!

`