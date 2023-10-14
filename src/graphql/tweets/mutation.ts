export const Mutation = `#graphql
    createTweet(text: String, files: [String]): Tweet
    deleteTweet(tweetId: String!): Boolean! 
    createReply(text: String, files: [String], tweetId: String!, repling_to: String!): TweetCard
    likeTweet(tweetId: String!): Boolean!
    unlikeTweet(tweetId: String!): Boolean!
    bookmarkTweet(tweetId: String!): Boolean!
    unbookmarkTweet(tweetId: String!): Boolean!
`