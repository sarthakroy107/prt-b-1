"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloGraphqlServer = void 0;
const ApolloServer_1 = require("@apollo/server/dist/esm/ApolloServer");
const user_1 = require("./user");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createApolloGraphqlServer() {
    const gqlServer = new ApolloServer_1.ApolloServer({
        typeDefs: `#graphql
        type Query {
            ${user_1.User.Queries}
        }
        type Mutation {
            ${user_1.User.Mutation}
        }
        `,
        resolvers: {
            Query: Object.assign({}, user_1.User.Resolvers.queries),
            Mutation: Object.assign({}, user_1.User.Resolvers.mutation)
        },
    });
}
exports.createApolloGraphqlServer = createApolloGraphqlServer;
