export const Mutation = `#graphql
    createUser(name: String!, email: String!, password: String!, username: String!): User
    sendMessage( receiverId: String!, text: String, files: [String]): Boolean
`