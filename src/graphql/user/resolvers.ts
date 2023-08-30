import User from "../../models/User";
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require('dotenv').config()

const mutation = {
    createUser: async (_: any, {name, email, password}: {name: string, email: string, password: string})=> {
        try {
            
            const userAlreadyExists = await User.findOne({email})

            if(userAlreadyExists) return new Error("User aalready exists")
            
            const encryptedPassword = await bcrypt.hash(password, 10);
            
            const newUser = await User.create({
                name, password: encryptedPassword, email
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

            if(!bcrypt.compare(password, user.password)) return new Error("Password does not match")

            console.log(process.env.JWT_SECRET)

            const token = jwt.sign({name: user.name, email: user.email}, process.env.JWT_SECRET, {expiresIn: '2h'});

            console.log(process.env.JWT_SECRET)
            user.password = "I love mahiru"
            user.token = token
            //res.cookie('token', token, {httpOnly: true, maxAge: 1000*60*60*24*7})
            // context.setCookies.push({
            //     name: "token",
            //     value: token,
            //     options: {
            //         domain:'DOMAIN_NAME',
            //         httpOnly: true,
            //         maxAge: 36000,
            //         secure: 'none',
            //         path: '/',
            //         sameSite:'None'
            //     }
            // });
            return user

        }
        catch(err) {
            return err
        }
    },

    userLogin: async (_:any, {email, password}: {email: string, password: string}) => {
        try {
            
            const account = await User.findOne({email});
            if(!account) return  new Error("User not found");
            if(!bcrypt.compare(password, account.password)) return new Error("Password do not match");
            const payload = {
                email: account.email,
                id: account._id
            }
            try {
                const token = jwt.sign(payload, process.env.JWT_SECRET!);
                account.token = token;
                account.password = null
                return account;
            } catch (error) {
                throw new Error("Token generation failed");
            }

        } catch (error) {
            console.log(error)
        }
    }
    
}

export const Resolvers = {mutation, queries};