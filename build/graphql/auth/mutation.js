"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
exports.Mutation = `#graphql
    registerWidhAuthenticatedProvider(email: String!, name: String!, username: String!): User
    registerWithCredentialsAuthentication(email: String!, name: String!, password: String!, username: String!): User
`;
