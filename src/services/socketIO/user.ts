import User from "../../models/User"

export const autoCompleteUser = async (searchString: string) => {
    try {
        //@ts-ignore
        console.log(searchString.searchString)
        const users = await User.aggregate([
            {
                $search: {
                    index: "default",
                    text: {
                        // @ts-ignore
                        query: searchString.searchString, 
                        path: ["username", "name"],
                        fuzzy: {
                            maxEdits: 2,
                            maxExpansions: 100
                        },
                    }
                }
            },
            {
                $lookup: {
                    from: "users", // Assuming your collection name is "users"
                    localField: "following",
                    foreignField: "_id",
                    as: "followedUsers"
                }
            },
            {
                $addFields: {
                    isFollowedByYou: {
                        $in: ["$_id", "$followedUsers._id"]
                    }
                }
            },
            {
                $sort: {
                    isFollowedByYou: -1, // Sort in descending order so that followed users come first
                    // Add other sorting criteria here if needed
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    name: 1,
                    blue: 1,
                    profileImageUrl: 1
                }
            }
        ]);
        
        return users;
        
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong in autoCompleteUser")
    }
}