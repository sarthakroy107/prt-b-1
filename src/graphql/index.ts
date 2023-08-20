import { ApolloServer } from "@apollo/server";
import { User } from "./user";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function createApolloGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `#graphql
        type Query {
            ${User.Queries}
        }
        type Mutation {
            ${User.Mutation}
        }
        `,
        resolvers: {
            Query: {
                ...User.Resolvers.queries
            },
            Mutation: {
                ...User.Resolvers.mutation
            }
        },
    })
    await gqlServer.start();
    return gqlServer
}

export default createApolloGraphqlServer;