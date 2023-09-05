import User from "../../models/User"
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql';
const otp = require('otp-generator')

const profilePics: Array<string> = [
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1690264156/mvare5hikfggu642zhcr.png",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1690264139/x9zi5xfpaw1ynxazchid.jpg",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1689836235/nmf1xgwduqrpd4hbxokx.jpg",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1689679236/kbvmtoip85yxucfpgupu.jpg",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1689678546/j5ttdbzfzm6oft8ub0we.jpg",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1689678310/ditztyioy2bhpzf9rf0o.jpg",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1689175938/umimcqeipkpowe4k3i5k.jpg",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1689165981/ydne5iyikkzoisgneh8d.jpg",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1688293365/inmitdaytbzq6i7qeejd.jpg",
    "https://res.cloudinary.com/dx2nblvo7/image/upload/v1693893888/cb778914-f2dd-4a1f-8a67-1e7aea8adb95_mfx7sd.jpg",

]

const getPrifilePic = (): string => {
    const num = Math.ceil(Math.random()*(profilePics.length - 1))
    console.log("Math.random(): ",num);
    return profilePics[num];
}

const mutation = {

    registerWidhAuthenticatedProvider: async (_:any, {email, name, username}:{email:string, name: string, username: string}) => {
        console.log("registerWidhAuthenticatedProvide: ",email, name, username)

        const userWithEmail = await User.findOne({email});
        if(userWithEmail) throw new GraphQLError("User with same email already exists");
        const userWithUsername = await User.findOne({username});
        if(userWithUsername) throw new GraphQLError("User with same username already exists");

        let encryptedPassword;
        
        try {
            const randomPassword = otp.generate(8, {
                upperCaseAlphabets:true,
                lowerCaseAlphabets:true,
                specialChars:false,
            });
            console.log(randomPassword)
            encryptedPassword = await bcrypt.hash(randomPassword, 10)

        } catch (error) {
            throw new GraphQLError("Encrypted password generation failed")
        }   
        try {
            console.log("Creating user, password: ", encryptedPassword)
            const profileImageUrl:string = getPrifilePic();

            const newUser = await User.create({email, password: encryptedPassword, name, username, profileImageUrl});
            console.log(newUser)
            return newUser

        } catch (error) {
            throw new GraphQLError("User not registered and user generation failed");
        } 
    },

    registerWithCredentialsAuthentication: async (_:any, {email, name, password, username}:{email:string, name: string, password: string, username: string}) => {
        console.log(email, name, password, username);
        try {
            const userWithSameEmail = await User.findOne({email});
            if(userWithSameEmail) throw new GraphQLError("User with same EMAIL exists");

            const userWithSameUsername = await User.findOne({username});
            if(userWithSameUsername) throw new GraphQLError("User with same USERNAME exists")

            const encryptedPassword = await bcrypt.hash(password, 10);
            console.log(encryptedPassword)
            const profileImageUrl:string = getPrifilePic();
            const user = await User.create({email, password: encryptedPassword, name, username, profileImageUrl});
            return user;
        }
        catch(err) {
            throw new GraphQLError("Something went wrong")
        }
    }

}


const queries = {
    usernameAvailability: async(_: any, {username}:{username:string}) => {
        console.log(username);
        try {
            const available = await User.findOne({username});
            if(available) return false;
            return true;
        }
        catch(err) {
            throw new GraphQLError("Somethhing went wrong while checking username");
        }
    },
    loginWidhAuthenticatedProvider: async(_:any, {email}:{email: string}) => {
        console.log("loginWidhAuthenticatedProvider: ",email);

        try {
            const user = await User.findOne({email});
            if(user) return user;
            else throw new GraphQLError("User not found");

        } catch (error) {
            throw new GraphQLError("Something wen wrong in loginWidhAuthenticatedProvider")
        }
    }
}

export const AuthResolver = {mutation, queries};