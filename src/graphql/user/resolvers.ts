import User from "../../models/User";
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
import { GraphQLError } from 'graphql';
require('dotenv').config()

const mutation = {
    createUser: async (_: any, {name, email, password, username}: {name: string, email: string, password: string, username: string})=> {
        try {
            
            const userAlreadyExists = await User.findOne({email});
            if(userAlreadyExists) throw new GraphQLError("USer already exists");

            const usernameAccountExists = await User.findOne({username});
            if(usernameAccountExists) throw new GraphQLError("Username alreay taken");
            
            const encryptedPassword = await bcrypt.hash(password, 10);
            
            const newUser = await User.create({
                name, password: encryptedPassword, email, username
            })
            
            return newUser
        }
        catch(err) {
            return new Error("Something went wrong in signup")
        }
    },
    
}

const queries =  {
    hello: ()=>"Hello",

    say: (_: any, {name}: {name: string})=> `Name is ${name}`,

    fetchUsers: async ()=>{
        const users = await User.find({});
        console.log(users)
        return users
    },

    fetchUserDetailsWithEmail: async (_: any, {email}: {email: string}) => {
        
        try{
            const user = await User.findOne({email});
            if(!user) throw new GraphQLError(`User with email: ${email} does not exists`);
            console.log(user);
            const extendedUser = {
                //@ts-ignore
                ...user._doc,
                followersCount: user.followers.length,
                followingCount: user.following.length,
            }

            return extendedUser;
        }
        catch(err) {
            throw new GraphQLError("Something went wrong in fetchUserDetailsWithEmail")
        }
    },

    fetchUserWithEmail:async (_:any, {email, password}: {email: string, password: string}) => {
        try{

            const user = await User.findOne({email});

            if(!user) return new Error ("User does not exist")

            if(!bcrypt.compare(password, user.password)) return new Error("Password does not match")

            console.log(process.env.JWT_SECRET)

            const token = jwt.sign({name: user.name, email: user.email}, process.env.JWT_SECRET, {expiresIn: '2h'});

            console.log(process.env.JWT_SECRET)
            user.password = "I love mahiru"
            user.token = token
            return user

        }
        catch(err) {
            return err
        }
    },

    userLogin: async (_:any, {email, password}: {email: string, password: string}) => {
        try {
            console.log("userLogin called through graphql")
            const account = await User.findOne({email});
            if(!account) throw new Error("User not found");
            if(!bcrypt.compare(password, account.password)) return new Error("Password do not match");
            const payload = {
                email: account.email,
                id: account._id
            }
            try {
                console.log(process.env.JWT_SECRET)
                const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "72h" });
                account.token = token;
                return account;
            } catch (error) {
                throw new Error("Token generation failed");
            }

        } catch (error) {
            console.log(error)
        }
    }
    
}

export const UserResolvers = {mutation, queries};