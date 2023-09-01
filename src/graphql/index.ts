import { ApolloServer } from "@apollo/server";
import { User } from "./user";
import { PrismaClient } from '@prisma/client'
import { Auth } from "./auth";
const prisma = new PrismaClient()

async function createApolloGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `#graphql
        ${User.typeDefs}
        type Query {
            ${User.Queries}
            ${Auth.Queries}
        }
        type Mutation {
            ${User.Mutation}
            ${Auth.Mutation}
        }
        `,
        resolvers: {
            Query: {
                ...User.UserResolvers.queries,
                ...Auth.AuthResolver.queries
            },
            Mutation: {
                ...User.UserResolvers.mutation,
                ...Auth.AuthResolver.mutation
            }
        },
    })
    await gqlServer.start();
    return gqlServer
}

export default createApolloGraphqlServer;