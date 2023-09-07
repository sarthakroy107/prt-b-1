const mutation = {
    createTweet: async(_:any, {authorId, body, files}: {authorId: string, body: string, files: [string]}, context:any) => {
        console.log(authorId, body, files);
        console.log("Hii")
        console.log(context)

    }
}

const queries = {

}

export const TweetResolver = { mutation, queries };