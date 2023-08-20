import prisma from "../../prisma";

const mutation = {
    createUser: async(_: any, {name, email, password}: {name: string; email: string, password: string;})=> {
        await prisma.user.create({
            data:{
                name, password, email
            }
        })
        return true
    }
}

const queries =  {
    hello: ()=>"Hello",
    say: (_: any, {name}: {name: string})=> `Namw is ${name}`
}

export const Resolvers = {mutation, queries};