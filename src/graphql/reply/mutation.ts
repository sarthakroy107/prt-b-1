export const Mutation = `#graphql
    createReply(body: String, files: [String], tweetId: String!): Reply
`