"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
exports.Mutation = `#graphql
    createUser(name: String!, email: String!, password: String!, username: String!): User
    sendMessage( receiverId: String!, text: String, files: [String]): Boolean
`;
