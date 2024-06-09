import mongoose from "mongoose";


const  connectMongoDb = async () => {
    try {
    const conn = await mongoose.connect("mongodb+srv://thekillersd:Ymfhiuo8gIxeb487@cluster0.x044sfl.mongodb.net/twitter-db?retryWrites=true&w=majority&appName=Cluster0")
    console.log("mongo connected")
    } catch (error) {
        console.log(error.message)
    }
}

export default connectMongoDb

