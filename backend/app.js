import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/user.js';
import dotenv from "dotenv";
import flash from "connect-flash";
import bodyParser from 'body-parser';
import authRouter from "./routers/auth.router.js"
import userDataRouter from './routers/userData.router.js'
import cors from 'cors';
/////////////////////////////////
//DOTENV
dotenv.config();
const PORT = process.env.PORT || 8000;
const MongoUri = process.env.MONGODB_URI;
const SECRET_KEY = process.env.SECRET_KEY;
/////////////////////////////////////

const app = express();

//Connecting to the database
mongoose
  .connect(MongoUri, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is listening on port: ",PORT);
    });
  })
  .catch((err) => {
    console.log("Error Occurred");
  });

app.use(flash());
app.use(cors());



app.get('/api',(req,res)=>{
    res.send("Hello World");
}
)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth',authRouter);
app.use('/api/user',userDataRouter);



