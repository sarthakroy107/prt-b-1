"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queries = void 0;
exports.Queries = `#graphql
    hello: String
    say(name: String!): String
    fetchUsers: [User]
    fetchUserDetailsWithEmail(email: String!): User
    fetchUserWithEmail(email: String!, password: String!): User
    userLogin(email: String!, password:String!): User
`;
