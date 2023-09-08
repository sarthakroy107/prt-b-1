"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
exports.Mutation = `#graphql
    createTweet(body: String, files: [String]): Tweet
    deleteTweet(tweetId: String!): Boolean!
`;
