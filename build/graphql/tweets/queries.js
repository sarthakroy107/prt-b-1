"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queries = void 0;
exports.Queries = `#graphql
    fetchUserTweets: [TweetCard]
    fetchUserReplies: [[TweetCard]]
    fetchAllTweets: [TweetCard]
    fetchSpecificTweet(tweetId: String!): TweetCard!
    fetchRepliesForSpecifivTweet(tweetId: String!, offset: Int!): [[TweetCard]]

`;
