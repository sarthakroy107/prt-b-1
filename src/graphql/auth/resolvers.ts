import User from "../../models/User"
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql';
const otp = require('otp-generator')
const mutation = {
    authWidhAuthenticatedProvider: async (_:any, {email, name}:{email:string, name: string}) => {
        console.log(email, name)
        const user = await User.findOne({email});
        const randomPassword = otp.generate(8, {
            upperCaseAlphabets:true,
            lowerCaseAlphabets:true,
            specialChars:true,
        });
        
        const encryptedPassword = await bcrypt.hash(randomPassword, 10)
        if(!user) {
            try {
                console.log("Creating user, password: ", encryptedPassword)
                const newUser = await User.create({email, password: encryptedPassword, name})
                return newUser
            } catch (error) {
                throw new GraphQLError("User not registered and user generation failed");
            }
        }
        return user;
    },
    registerWithAuthentication: async (_:any, {email, name, password}:{email:string, name: string, password: string}) => {
        console.log(email, name, password);
        try {
            const existingUser = await User.findOne({email});
            console.log("hello", existingUser)
            if(existingUser) throw new GraphQLError("User already exists");
            const encryptedPassword = await bcrypt.hash(password, 10);
            console.log(encryptedPassword)
            const user = await User.create({email, password: encryptedPassword, name});
            return user;
        }
        catch(err) {
            throw new GraphQLError("Something went wrong")
        }
    }

}
const queries = {

}

export const AuthResolver = {mutation, queries};