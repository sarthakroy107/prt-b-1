"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queries = void 0;
exports.Queries = `#graphql
    fetchUsers: [User]
    fetchUserDetailsWithEmail(email: String!): fullUserDetails
    fetchUserDetailsWithUsername(username: String!): fullUserDetails
    fetchUserWithEmail(email: String!, password: String!): User
    userLogin(email: String!, password:String!): User
    userChats: [ConversationDetails]!
    userChatMessages(conversationId: String!): [ChatBody]!
    specificUserConversationDetails(to_username: String!): Conversation_User_Details
    searchUser(searchString: String!): Boolean!
    extraUserDetails(username: String!): UserExtraDetails!
    latestJoinedUser: latestJoinedUserType!
    autoCompleteUser(searchString: String!): [basicUserDetails]!
`;
