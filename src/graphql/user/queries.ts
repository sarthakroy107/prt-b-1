
export const Queries = `#graphql
    fetchUsers: [User]
    fetchUserDetailsWithEmail(email: String!): User
    fetchUserDetailsWithUsername(username: String!): User
    fetchUserWithEmail(email: String!, password: String!): User
    userLogin(email: String!, password:String!): User
    userChats: [ConversationDetails]!
    userChatMessages(conversationId: String!): [ChatBody]!
    specificUserConversationDetails(to_username: String!): Conversation_User_Details
    searchUser(searchString: String!): Boolean!
    extraUserDetails(username: String!): UserExtraDetails!
    latestJoinedUser: latestJoinedUserType!
    autoCompleteUser(searchString: String!): [basicUserDetails]!
`