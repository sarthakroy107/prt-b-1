import express, {Express} from "express";
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from "./graphql";
import connect from "./config/database";
import cors from 'cors';
import * as http from 'http';
import { verifyJWT } from "./services/JWT";
import { Server } from "socket.io";
require('dotenv').config()

connect()

const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/UserRoutes')

const app: Express = express();

app.use(cors());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
  });
app.use(express.json());

const gqlFunc = async () =>{
  
  app.use("/graphql", expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        
        const token: string | string[] | undefined = req.headers["authorization"];
        
        try {
          if(Array.isArray(token)) return {};
          const user = await verifyJWT(token)
          
          return { user };
        } 
        catch (error) {
          return {};
        }
      },
    })
  );
    
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });


  app.get('/', (req, res)=>{
      return res.send("Sever is running")
  })

  io.on('connection', (socket)=>{
    console.log("Socket connected")
    socket.on('disconnect', ()=>{
      console.log("Socket disconnected")
    })
  })
  app.use('/api/v1', authRoutes)
  app.use('/api/v1', userRoutes)

  server.listen(8000, ()=>{
      console.log("Server is up and running");
  })
}

gqlFunc();