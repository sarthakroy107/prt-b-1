import { ApolloServer } from "@apollo/server";
import express, {Express} from "express";
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const app: Express = express();

app.use(express.json());

const gqlFunc = async () =>{
    const gqlServer = new ApolloServer({
        typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }
        type Mutation {
            createUser(name: String!, email: String!, password: String!): Boolean
        }
        `,
        resolvers: {
            Query: {
                hello: ()=>"Hello",
                say: (_, {name}: {name: string})=> `Namw is ${name}`
            },
            Mutation: {
                createUser: async(_, {name, email, password}: {name: string; email: string, password: string;})=> {
                    await prisma.user.create({
                        data:{
                            name, password, email
                        }
                    })
                    return true
                }
            }
        },
    })

    await gqlServer.start();
    app.use('/graphql', expressMiddleware(gqlServer));
    app.get('/', (req, res)=>{
        return res.send("Sever is running")
    })
    
    app.listen(8000, ()=>{
        console.log("Server is up and running");
    })

}
gqlFunc();