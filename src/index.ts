import express, {Express} from "express";
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from "./graphql";
import connect from "./config/database";
import cors from 'cors';
import { json } from 'body-parser';
import { verifyJWT } from "./services/JWT";
require('dotenv').config()
connect()

const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/UserRoutes')

const app: Express = express();

app.use(cors());
app.use(express.json());

const gqlFunc = async () =>{
    
    app.use(
        "/graphql",
        expressMiddleware(await createApolloGraphqlServer(), {
          context: async ({ req }) => {
            
            const token: string | string[] | undefined = req.headers["authorization"];
            //console.log("Header token: ",token)
            try {
              if(Array.isArray(token)) return {};
              const user = await verifyJWT(token)
              //console.log("Token user: ", user)
              return { user };
            } 
            catch (error) {
              return {};
            }
          },
        })
      );

    app.get('/', (req, res)=>{
        return res.send("Sever is running")
    })
    app.use('/api/v1', authRoutes)
    app.use('/api/v1', userRoutes)
    app.listen(8000, ()=>{
        console.log("Server is up and running");
    })

}
gqlFunc();