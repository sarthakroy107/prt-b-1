import User from "../../models/User";
const mutation = {
    createUser: async (_: any, {name, email, password}: {name: string, email: string, password: string})=> {
        console.log(name, email, password)
        let newUser = await User.create({
            name, password, email
        })
        console.log(newUser)
        // newUser._id = null
        // newUser.password = undefined
        return newUser
    }
}

const queries =  {
    hello: ()=>"Hello",

    say: (_: any, {name}: {name: string})=> `Name is ${name}`,

    fetchUsers: async ()=>{
        const users = await User.find({});
        console.log(users)
        return users
    },

    fetchUserWithId: async (_: any, {id}: {id: string}) => {
        console.log(id);
        try{
            const user = await User.findById(id);
            return user
        }
        catch(err) {
            return err
        }
    },

    fetchUserWithEmail:async (_:any, {email, password}: {email: string, password: string}) => {
        try{
            const user = await User.findOne({email});
            if(!user) return new Error ("User does not exist")
            if(user.password != password) return new Error("Password does not match")

            return user

        }
        catch(err) {
            return err
        }
    }
    
}

export const Resolvers = {mutation, queries};