import mongoose from 'mongoose';


async function  connectDB(){
	
	try{
	
		await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/WeddingPhotos");

		console.log("MongoDB connected.")
	}catch(error){
		console.error("MongoDB connection error: " , error);
	}
}


export default connectDB;
