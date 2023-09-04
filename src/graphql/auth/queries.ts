export const Queries = `#graphql
    authWithCreadentialsProvider: User
    usernameAvailability(username: String!): Boolean!
    loginWidhAuthenticatedProvider(email: String!): User
`