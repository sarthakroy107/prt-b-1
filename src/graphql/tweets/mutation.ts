export const Mutation = `#graphql
    createTweet(text: String, files: [String], in_reply: Boolean, in_reply_to: String): TweetCard
    deleteTweet(tweetId: String!): Boolean! 
    createReply(text: String, files: [String], tweetId: String!, repling_to: String!): TweetCard
    likeTweet(tweetId: String!): Boolean!
    unlikeTweet(tweetId: String!): Boolean!
    bookmarkTweet(tweetId: String!): Boolean!
    unbookmarkTweet(tweetId: String!): Boolean!
    retweetTweet(tweetId: String!): Boolean!
    unretweetTweet(tweetId: String!): Boolean!
`