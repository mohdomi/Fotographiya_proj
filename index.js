import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import connectDB from './src/db/db.js';
import router from './src/routes/index.route.js';
connectDB();
const app = express();
const port = 3000
app.use(express.json());
app.use('/api' , router);

app.listen(port , ()=>{

    console.log("Listening on port : " , port)
})
