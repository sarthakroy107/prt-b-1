export const Mutation = `#graphql
    authWidhAuthenticatedProvider(email: String!, name: String!): User
    registerWithAuthentication(email: String!, name: String!, password: String!): User
`