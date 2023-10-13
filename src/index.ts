import express, {Express} from "express";
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from "./graphql";
import connect from "./config/database";
import cors from 'cors';
import * as http from 'http';
import { verifyJWT } from "./services/JWT";
import { Server } from "socket.io";
import Message from "./models/Message";
import { chatObjectTypeDef, chat_sender_TypeDef, message_data_type } from "./config/typeConfig";
import { autoCompleteUser } from "./services/socketIO/user";
import DirectMessage from "./models/DirectMessages";
import User from "./models/User";
import { checkConversation, createMessage } from "./services/socketIO/messages";
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
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });


  app.get('/', (req, res)=>{
      return res.send("Sever is running")
  })

  io.on('connection', (socket)=>{

    console.log("Socket connected:" + socket.id)


    socket.on("join_room", (data) => {
      socket.join(data);
      console.log("User joined room: " + data);
    });

    socket.on("send_message", async (data: message_data_type) => {
      console.log(data);
      if(data.conversationId === null) {
        data.conversationId = await checkConversation(data);
        socket.emit("conversation_created", data.conversationId);
      }
      console.log(data)
      
      const formatedMessage: chatObjectTypeDef = await createMessage(data);

      socket.to(data.conversationId).emit("receive_message", formatedMessage);
      console.log("message received triggerred")
    });

    socket.on("autocomplete_profile_search", async (data)=> {
      const accounts = await autoCompleteUser(data);
      console.log(accounts)
      socket.emit("autocomplete_profile_search_results", accounts);
    })

    socket.on('disconnect', () => {
      console.log("Socket disconnected")
    });

  })

  app.use('/api/v1', authRoutes)
  app.use('/api/v1', userRoutes)

  server.listen(8000, ()=>{
      console.log("Server is up and running");
  })
}

gqlFunc();