import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                status: "error",
                message: "Refresh token not found"
            });
        }

        const user = await UserModel.findOne({ where: { refresh_token: refreshToken } });

        // Check if user exists
        if (!user.refresh_token) {
            return res.status(401).json({
                status: "error",
                message: "User not found or refresh token is invalid"
            });
        }

        //if user exists, verify the refresh token
        else {
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
            const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
            jwt.verify(
                refreshToken,
                refreshTokenSecret,
                (err, decoded) => {
                    if (err) {
                        return res.status(403).json({
                            status: "error",
                            message: "Invalid refresh token"
                        });
                    }
                    //if refresh token valid, get user data
                    //convert user ke object JSON
                    const userPlain = user.toJSON();

                    //remove sensitive data
                    const { user_password: _, refresh_token: __, ...safeUserData } = userPlain;

                    console.log("user password:", userPlain.user_password);
                    console.log("user refresh token:", userPlain.refresh_token);
                    
                    //bikin new access token (expired dalam 5 menit)
                    const accessToken = jwt.sign(
                        safeUserData,
                        accessTokenSecret,
                        { expiresIn: "15m" }
                    )

                    return res.status(200).json({
                        status: "success",
                        message: "Access token generated successfully",
                        access_token: accessToken,
                        userData: safeUserData
                    });
                }
            )
        }
    }
    catch (error) {
        console.error("Error getting access token:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
}
