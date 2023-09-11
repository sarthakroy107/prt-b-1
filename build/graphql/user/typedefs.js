"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql

    type User {
        _id: String!
        name: String!
        email: String!
        password: String!
        username: String!
        profileImageUrl: String!
        banner: String!
        bio: String
        tweets: [Tweet]
        likes: [String]
        replies: [Tweet]
        followers: [User]
        following: [User]
        followersCount: Int!
        followingCount: Int!
        blue: Boolean!
        createdAt: String!
        updatedAt: String!
        token: String
        tweetCount: Int!
    }

    type Tweet {
        _id: String!
        body: String!
        files: [String]
        author: User!
        replies: Tweet
        likes: [String]
        retweet: [Tweet]
        createdAt: String!
        updatedAt: String!
        viewsCount: Int!
    }

    type TweetCard {
        _id: String!
        body: String!
        files: [String]
        author: User!
        replies: Tweet
        likes: [String]
        retweet: [Tweet]
        createdAt: String!
        updatedAt: String!
        viewsCount: Int!
        likesCount: Int!
        replyCount: Int!
        retweetCount: Int!
        
    }
`;
