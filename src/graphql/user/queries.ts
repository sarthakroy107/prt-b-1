
export const Queries = `#graphql
    hello: String
    say(name: String!): String
    fetchUsers: [User]
    fetchUserWithId(id: String!): User
    fetchUserWithEmail(email: String!, password: String!): User
`