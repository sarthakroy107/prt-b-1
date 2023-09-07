"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
exports.Mutation = `#graphql
    createTweet(authorId: String!, body: String, files: [String]): Tweet
`;
