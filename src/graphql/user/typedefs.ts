export const typeDefs = `#graphql

    type User {
        _id: String!
        name: String!
        email: String!
        password: String!
        username: String!
        profileImageUrl: String
        bio: String
        tweets: [Tweet]
        likes: [String]
        replies: [Tweet]
        blue: Boolean!
        createdAt: String!
        updatedAt: String!
        token: String
    }

    type Tweet {
        _id: String
        body: String
        retweeted_from: Tweet
        parent_tweet: Tweet
        files: [String]
        author: User!
        replies: Tweet
        likes: [String]
        retweet: [Tweet]
        createdAt: String
    }
`