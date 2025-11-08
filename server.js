import cors from 'cors';
import "dotenv/config";
import express from 'express';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';


const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());


app.use("/api", chatRoutes);

// app.post("/test" , async (req, res) => {
   
// });

const connectDb = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});