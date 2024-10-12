import jwt from "jsonwebtoken";
import UserRefreshTokenModel from "../models/userRefreshToken.js";

const generateTokens = async (user) => {
    try {
        const  payload = { _id: user._id, roles: user.roles };

        //Generate access token with expiration time
        const accessTokenExp = Math.floor(Date.now() / 1000) + 100; // Set expiration to 100 seconds from now
        const accessToken = jwt.sign(
            { ...payload, exp: accessTokenExp },
            process.env.JWT_ACCESS_TOKEN_SECRET_KEY
        )

        // Generate refresh token with expiration time
        const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // Set expiration to 5 days from now
        const refreshToken = jwt.sign(
            { ...payload, exp: refreshTokenExp },
            process.env.JWT_REFRESH_TOKEN_SECRET_KEY
        );
        
        const userRefreshToken = await UserRefreshTokenModel.findOne({ userId: user._id });
        
        // blacklist user
        if (userRefreshToken) {
            userRefreshToken.blacklisted = true;
            await userRefreshToken.save();
        }

        return Promise.resolve({ accessToken, refreshToken, accessTokenExp, refreshTokenExp });
    }
    catch (error) {
        return Promise.reject(error);
    }
}

export default generateTokens