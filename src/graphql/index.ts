import { ApolloServer } from "@apollo/server/dist/esm/ApolloServer";
import { User } from "./user";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export function createApolloGraphqlServer() {
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
}