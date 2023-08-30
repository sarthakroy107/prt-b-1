import express, {Express} from "express";
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client'
import createApolloGraphqlServer from "./graphql";
import connect from "./config/database";
import cors from 'cors';
import { json } from 'body-parser';
import JWT from "jsonwebtoken";
require('dotenv').config()
connect()

const app: Express = express();

app.use(cors());
app.use(express.json());

const gqlFunc = async () =>{
    
    app.use(
        "/graphql",
        expressMiddleware(await createApolloGraphqlServer(), {
          context: async ({ req }) => {
            
            const token = req.headers["Authorization"];
    
            try {
              const user = JWT.verify(token as string, process.env.JWT_SECRET!)
              return { user };
            } catch (error) {
              return {};
            }
          },
        })
      );

    app.get('/', (req, res)=>{
        return res.send("Sever is running")
    })
    
    app.listen(8000, ()=>{
        console.log("Server is up and running");
    })

}
gqlFunc();