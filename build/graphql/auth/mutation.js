"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
exports.Mutation = `#graphql
    authWidhAuthenticatedProvider(email: String!, name: String!): User
    registerWithAuthentication(email: String!, name: String!, password: String!): User
`;
