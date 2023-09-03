export const Mutation = `#graphql
    registerWidhAuthenticatedProvider(email: String!, name: String!, username: String!): User
    registerWithCredentialsAuthentication(email: String!, name: String!, password: String!, username: String!): User
`