import { ApolloServer } from "@apollo/server";
import { User } from "./user";
import { PrismaClient } from '@prisma/client'
import { Auth } from "./auth";
import { Tweet } from "./tweets";
const prisma = new PrismaClient()

async function createApolloGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `#graphql
        ${User.typeDefs}
        type Query {
            ${User.Queries}
            ${Auth.Queries}
            ${Tweet.Queries}
        }
        type Mutation {
            ${User.Mutation}
            ${Auth.Mutation}
            ${Tweet.Mutation}
        }
        `,
        resolvers: {
            Query: {
                ...User.UserResolvers.queries,
                ...Auth.AuthResolver.queries,
                ...Tweet.TweetResolver.queries,

            },
            Mutation: {
                ...User.UserResolvers.mutation,
                ...Auth.AuthResolver.mutation,
                ...Tweet.TweetResolver.mutation,
            }
        },
    })
    await gqlServer.start();
    return gqlServer
}

export default createApolloGraphqlServer;