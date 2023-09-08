export const Mutation = `#graphql
    createTweet(body: String, files: [String]): Tweet
    deleteTweet(tweetId: String!): Boolean!
`