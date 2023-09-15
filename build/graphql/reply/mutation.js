"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
exports.Mutation = `#graphql
    createReply(text: String, files: [String], tweetId: String!, repling_to: String!): Reply
`;
