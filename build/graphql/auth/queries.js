"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queries = void 0;
exports.Queries = `#graphql
    authWithCreadentialsProvider: User
    usernameAvailability(username: String!): Boolean!
    loginWidhAuthenticatedProvider(email: String!): User
`;
