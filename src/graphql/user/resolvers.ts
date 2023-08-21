import User from "../../models/User";
import prisma from "../../prisma";
const mutation = {
    createUser: async (_: any, {name, email, password}: {name: string; email: string, password: string})=> {
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
    say: (_: any, {name}: {name: string})=> `Name is ${name}`
}

export const Resolvers = {mutation, queries};