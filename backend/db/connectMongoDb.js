import mongoose from "mongoose";


const  connectMongoDb = async () => {
    try {
    const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log("mongo connected")
    } catch (error) {
        console.log(error.message)
    }
}

export default connectMongoDb

