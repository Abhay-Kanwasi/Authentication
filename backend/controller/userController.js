import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js"

class UserController {
    // User Registration
    static userRegistration = async (req, res) => {
        try {
            // Extract request body parameters
            const { name, email, password, password_confirmation } = req.body

            if(!name || !email || !password || !password_confirmation) {
                return res.status(400).json({ status: "failed", message: "All fields are required"})
            }

            if(password !== password_confirmation) {
                return res.status(400).json({ status: "failed", message: "Password and Confirm Password don't match"})
            }
            
            const existingUser = await UserModel.findOne({ email });
            if (existingUser){
                return res.status(409).json({ status: "failed", message: "Email already exists"})
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
            res.status(500).json({ status: "failed", message: "Unable to Register, Please try again !"})
        }
    }
    // User Email Verification
    // User Login
    // Get New Access Token OR Refresh Token
    // Change Password
    // Profile
    // Send Password Reset Email
    // Password Reset
    // Logout
}

export default UserController;