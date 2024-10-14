import UserModel from "../models/user.js";
import UserRefreshTokenModel from "../models/userRefreshToken.js";
import generateTokens from "./generateTokens.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshAccessToken = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        console.log("going inside")
        // Verify Refresh Token is valid or not
        const { tokenDetails, error } = await verifyRefreshToken(oldRefreshToken)
        console.log("outside verify refresh")
        if (error) {
            return res.status(401).send({ status: "failed", message: "Invalid refresh token" });
        }

        // Find user based on Refresh Token detail id
        const user = await UserModel.findById(tokenDetails._id)

        if (!user) {
            return res.status(404).send({ status: "failed", message: "User not found" });
        }

        const userRefreshToken = await UserRefreshTokenModel.findOne({ userId: tokenDetails._id })

        if (oldRefreshToken !== userRefreshToken.token || userRefreshToken.blacklisted) {
            return res.status(401).send({ status: "failed", message: "Unauthorize access"});
        }

        const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user);
        console.log(accessToken, refreshToken, accessTokenExp, refreshTokenExp)
        return {
            newAccessToken: accessToken,
            newRefreshToken: refreshToken,
            newAccessTokenExp: accessTokenExp,
            newRefreshTokenExp: refreshTokenExp
        };
    }
    catch (error) {
        console.log("error", error)
        res.status(500).json({ status: "failed", message: "Internanl Server Error" });
    }
}

export default refreshAccessToken