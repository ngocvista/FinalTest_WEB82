import express from "express"
import cors from 'cors'
import dotenv from "dotenv"
import multer from 'multer'
import cloudinary from 'cloudinary'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from "./routes/userRoute.js";
import movieRouter from "./routes/movieRoute.js"
import { Model } from "mongoose"
dotenv.config();


const app = express();
const port = process.env.PORT_DEVELOP || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors())

const storage = multer.memoryStorage();
const upload = multer({ storage });

//api endpoints
app.use('/users', userRouter)
app.use('/movies', movieRouter)

app.get('/', (req,res) => {
    res.send('API Working')
})

app.listen(port , () => {
    console.log(`Server is running at http://localhost:${process.env.PORT_DEVELOP}`)
})