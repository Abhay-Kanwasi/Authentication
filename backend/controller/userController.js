import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js"
import EmailVerificationModel from "../models/EmailVerification.js"

class UserController {
    // User Registration
    static userRegistration = async (req, res) => {
        try {
            // Extract request body parameters
            const { name, email, password, password_confirmation } = req.body

            if(!name || !email || !password || !password_confirmation) {
                return res.status(400).json({ status: "failed", message: "All fields are required" })
            }

            if(password !== password_confirmation) {
                return res.status(400).json({ status: "failed", message: "Password and Confirm Password don't match" })
            }
            
            const existingUser = await UserModel.findOne({ email });
            if (existingUser){
                return res.status(409).json({ status: "failed", message: "Email already exists" })
            }

            // Generate salt and hash password
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(password, salt)

            // Create new user
            const newUser = await new UserModel({ name: name, email: email, password: hashPassword }).save()
            
            sendEmailVerificationOTP(req, newUser)

            res.status(201).json({
                status: "success",
                message: "Registration Success",
                user: { id: newUser._id, email: newUser.email }
            })

        } catch (error) {
            console.log("error", error)
            res.status(500).json({ status: "failed", message: "Unable to Register, Please try again !" });
        }
    }

    // User Email Verification

    static verifyEmail = async(req, res) => {
        try {
            const { email, otp } = req.body;

            if (!email || !otp){
                return res.status(400).json({ status: "failed", message: "All fields are required" });
            }

            const existingUser = await UserModel.findOne({email});
            if (!existingUser){
                return res.status(404).json({ status: "failed", message: "Email doesn't exist" });
            }

            if (existingUser.is_verified){
                return res.status(400).json({ status: "failed", message: "Email is already verified" });
            }
            
            const emailVerification = await EmailVerificationModel.findOne({ userId: existingUser._id, otp });
            if (!emailVerification){
                if(!existingUser.is_verified){
                    await sendEmailVerificationOTP(req, existingUser);
                    return res.status(400).json({ status: "failed", message: "Invalid OTP, new OTP sent to your email" });
                }
                return res.status(400).json({ status: "failed", message: "Invalid OTP" });
            }

            // Check if OTP is expired 
            const currentTime = new Date(); 
            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000) // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes)
            if (currentTime > expirationTime) {
                // OTP expired, send new OTP
                await sendEmailVerificationOTP(req, existingUser);
                return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
            }

            // OTP is valid and not expired, mark email as verified
            existingUser.is_verified = true;
            await existingUser.save()

            // Delete email verification document
            await EmailVerificationModel.deleteMany({ userId: existingUser._id });
            return res.status(200).json({ status: "success", message: "Email verified successfully!" })

        }
        catch(error){
            console.error(error)
            res.status(500).json({status: "failed", message: "Unable to verify email, please try again later." });
        }
    }
    // User Login
    // Get New Access Token OR Refresh Token
    // Change Password
    // Profile
    // Send Password Reset Email
    // Password Reset
    // Logout
}

export default UserController;