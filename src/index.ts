import express, {Express} from "express";
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client'
import createApolloGraphqlServer from "./graphql";
import connect from "./config/database";

connect()

const app: Express = express();

app.use(express.json());

const gqlFunc = async () =>{
    
    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer()));
    app.get('/', (req, res)=>{
        return res.send("Sever is running")
    })
    
    app.listen(8000, ()=>{
        console.log("Server is up and running");
    })

}
gqlFunc();