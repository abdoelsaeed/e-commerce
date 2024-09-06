import express from 'express';
// import { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import  productRouter  from './routes/productRouter';
import categoriesRouter from './routes/categoriesRouter';
import ordersRouter from './routes/ordersRouter';
import AppError from './errFolder/err';
import usersRouter from './routes/usersRouter';
import globalErrorHandler from './controller/errController';
import path from 'path';
dotenv.config({ path: './config.env' });
const app = express();
app.use(cookieParser());
const DB = process.env.DB||'mongodb+srv://abdoelsaeed2:12345@cluster000.h7jdjme.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster000'
mongoose
    .connect(DB)
    .then(() => console.log('DB Connection Successful!'))
    .catch((err) => console.error('DB connection error:', err));
app.use(cors());
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.set('view engine', 'pug');
app.options('*',cors())
app.use(morgan('dev'));
app.use('/public/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use(bodyParser.json());
app.use('/api/v1/categories',categoriesRouter);
app.use('/api/v1/orders',ordersRouter);
app.use('/api/v1/users',usersRouter);
app.use('/api/v1/products',productRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
const port = process.env.PORT||3000;
app.listen(port, () =>{ 
    console.log(`Server is running on port ${port} ...`);
});