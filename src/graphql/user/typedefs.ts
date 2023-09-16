export const typeDefs = `#graphql

    type UserID {
        value: Int
    }
    
    union UserOrString = UserID | User

    type User {
        _id: String!
        name: String!
        email: String!
        password: String!
        username: String!
        profileImageUrl: String!
        banner: String!
        bio: String
        tweets: [Tweet]
        likes: [String]
        replies: [Tweet]
        followers: [User]
        following: [User]
        followersCount: Int!
        followingCount: Int!
        blue: Boolean!
        createdAt: String!
        updatedAt: String!
        token: String
        tweetCount: Int!
    }

    type Tweet {
        _id:                  String!
        in_reply:             Boolean
        in_reply_to_tweet_id: String
        in_reply_to_user_id:  User
        text:                 String
        files:                [String]
        author_id:            String!
        likes:                [String]
        replies:              [String]
        retweets:             [String]
        quotetweets:          [String]
        hastags:              [String]
        private:              Boolean
        possibly_sensitive:   Boolean
        viewsCount:           Int!
        createdAt:            String!
        updatedAt:            String!
    }

    type TweetCard {
        _id:                  String!
        in_reply:             Boolean
        in_reply_to_tweet_id: String
        in_reply_to_user_id:  User
        text:                 String
        files:                [String]
        author_id:            User
        likes:                [String]
        replies:              [String]
        retweets:             [String]
        quotetweets:          [String]
        hashtags:             [String]
        private:              Boolean
        possibly_sensitive:   Boolean
        viewsCount:           Int!
        createdAt:            String!
        updatedAt:            String!
        likeCount:            Int!
        replyCount:           Int!
        retweetCount:         Int!
        quotetweetCount:      Int!
        isLiked:              Boolean!
        isRetweeted:          Boolean!
    }

    type Reply {
        _id:                  String!
        body:                 String
        files:                [String]
        author:               User!
        parentTweet:          Reply
        replies:              Tweet
        likes:                [String]
        retweet:              [Tweet]
        createdAt:            String!
        updatedAt:            String!
        viewsCount:           Int!
        likeCount:            Int!
        replyCount:           Int!
        retweetCount:         Int!
        isLiked:              Boolean!
        isRetweeted:          Boolean!
        ogTweet:              Tweet
    }
`