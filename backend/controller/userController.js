import UserModel from "../models/User"

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
        } catch (error) {
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