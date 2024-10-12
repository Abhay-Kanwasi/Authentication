import mongoose from "mongoose";

const connectDB = async (DATABASE_URL, DB_NAME) => {
    try {
        const DB_OPTIONS = {
            dbName : DB_NAME
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('Connected to mongo successfully.....')
    } catch (error) {
        console.log(error)
    }
}

export default connectDB