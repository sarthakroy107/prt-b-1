import JWT from "jsonwebtoken";
require("dotenv").config();

export const verifyJWT = async (token: string | undefined) => {
    if( token === undefined) return null
    return JWT.verify(token, process.env.JWT_SECRET!)
}

export const signJWT = (email: string, id: string) => {
    const payload = {
        email,
        id
    }
    return JWT.sign(payload, process.env.JWT_SECRET!)
}