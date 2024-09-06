"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { Request, Response } from 'express';
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const categoriesRouter_1 = __importDefault(require("./routes/categoriesRouter"));
const ordersRouter_1 = __importDefault(require("./routes/ordersRouter"));
const err_1 = __importDefault(require("./errFolder/err"));
const usersRouter_1 = __importDefault(require("./routes/usersRouter"));
const errController_1 = __importDefault(require("./controller/errController"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: './config.env' });
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
const DB = process.env.DB || 'mongodb+srv://abdoelsaeed2:12345@cluster000.h7jdjme.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster000';
mongoose_1.default
    .connect(DB)
    .then(() => console.log('DB Connection Successful!'))
    .catch((err) => console.error('DB connection error:', err));
app.use((0, cors_1.default)());
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.set('view engine', 'pug');
app.options('*', (0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/public/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'public', 'uploads')));
app.use(body_parser_1.default.json());
app.use('/api/v1/categories', categoriesRouter_1.default);
app.use('/api/v1/orders', ordersRouter_1.default);
app.use('/api/v1/users', usersRouter_1.default);
app.use('/api/v1/products', productRouter_1.default);
app.all('*', (req, res, next) => {
    next(new err_1.default(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(errController_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port} ...`);
});
