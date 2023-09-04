
export const Queries = `#graphql
    hello: String
    say(name: String!): String
    fetchUsers: [User]
    fetchUserDetailsWithEmail(email: String!): User
    fetchUserWithEmail(email: String!, password: String!): User
    userLogin(email: String!, password:String!): User
`