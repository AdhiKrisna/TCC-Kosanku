import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();


export const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    console.log("Auth Header:", authHeader);
    let token;

    // kalau ada bearer token, ambil tokennya
    if(authHeader) token = authHeader.split(' ')[1];

    if(!token) {
        return res.status(403).json({
            status: "error",
            message: "Token is required"
        });
    }

    const access_token = process.env.ACCESS_TOKEN_SECRET;
    jwt.verify(token, access_token, (err, decoded) => {
        if(err){
            return res.status(403).json({
                status: "error",
                message: "Invalid token"
            });
        }

        //if success,
        req.user = decoded; // save data user yang sudah didecode ke request
        console.log("Decoded Token  :", req.user);

        next(); 
    });

}