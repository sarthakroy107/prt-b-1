export const Mutation = `#graphql
    createTweet(authorId: String!, body: String, files: [String]): Tweet
`