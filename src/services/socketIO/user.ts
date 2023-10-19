import User from "../../models/User"

export const autoCompleteUser = async (searchString: string) => {
    try {
        const users = await User.aggregate([
            {
                $search: {
                    index: "default",
                    text: {
                        query: searchString, 
                        path: ["username", "name"],
                        fuzzy: {
                            maxEdits: 2,
                            maxExpansions: 100
                        },
                    }
                }
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