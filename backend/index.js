import express from "express";
import { PORT, mongoDBURL } from './configurations/config.js';
import cors from "cors";
import mongoose from 'mongoose';
import clothingRoutes from "./routes/clothingRoutes.js";
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', clothingRoutes);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log("App is listening");
        });
    })
    .catch((error) => {
        console.log(error);
    });

mongoose.set('strictQuery', true)




// app.get('/', (request, response) => {
//     console.log(request);
//     return response.status(234).send('Outfit Generator');
// });