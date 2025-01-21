import { connectToMongo } from './services/database.service'
import {Express} from "express";
import express from 'express'
import routes from './routes'
import dotenv from 'dotenv'
import bodyParser = require("body-parser");
import { setupSwagger } from './swagger';
import { apiRateLimiter } from './rateLImiter';
connectToMongo();
//to load the evn variables from .env file

dotenv.config();

const app: Express= express();



setupSwagger(app);
app.use(apiRateLimiter)
app.use(express.json())
app.use(bodyParser.json())

app.use('/api',routes);

app.listen(process.env.PORT,()=>{
    console.log("Sever is listening at the Port: ",process.env.PORT||8000);
    console.log("Server is at port: ","http://localhost:8000/ and swagger at: http://localhost:8000/api-docs")
})
