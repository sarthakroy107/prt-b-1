"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
exports.Mutation = `#graphql
    createReply(body: String, files: [String], tweetId: String!): Reply
`;
