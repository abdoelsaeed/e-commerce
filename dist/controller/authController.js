"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetpassword = exports.forgotPassword = exports.logout = exports.signup = exports.authorization = exports.refreshToken = exports.protect = exports.logIn = void 0;
const userModel_1 = __importDefault(require("./../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const err_1 = __importDefault(require("../errFolder/err"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const email_1 = __importDefault(require("./../email/email"));
const catchAsync_1 = __importDefault(require("../errFolder/catchAsync"));
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, username: user.name }, 'ACCESS_TOKEN_SECRET', {
        expiresIn: '15m',
    });
};
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, username: user.name }, 'REFRESH_TOKEN_SECRET');
};
exports.logIn = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    if (!email || !password) {
        return next(new err_1.default('please provide email and password!', 400));
    }
    if (typeof password === 'number')
        password = password.toString();
    const user = yield userModel_1.default.findOne({ email }).select('password');
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        return next(new err_1.default('Incorrect email or password', 400));
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    yield user.save();
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken
    });
}));
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new err_1.default('You are not logged in', 401));
    }
    jsonwebtoken_1.default.verify(token, 'ACCESS_TOKEN_SECRET', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new err_1.default('Invalid token or token expired', 403));
        }
        console.log(decoded.id);
        const currentUser = yield userModel_1.default.findById(decoded.id);
        if (!currentUser) {
            return next(new err_1.default('the user belonging to this token does not exist', 401));
        }
        if (currentUser.changePasswordAfter(decoded.iat)) {
            return next(new err_1.default('Your password has changed! please login again', 401));
        }
        req.user = decoded;
        next();
    }));
}));
exports.refreshToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return next(new err_1.default('No refresh token provided', 401));
    }
    const user = yield userModel_1.default.findOne({ refreshToken });
    if (!user) {
        return next(new err_1.default('Invalid refresh token', 403));
    }
    jsonwebtoken_1.default.verify(refreshToken, 'REFRESH_TOKEN_SECRET', (err, decoded) => {
        if (err) {
            return next(new err_1.default('Invalid refresh token', 403));
        }
        const newAccessToken = generateAccessToken(user);
        res.status(200).json({
            status: 'success',
            accessToken: newAccessToken,
        });
    });
}));
exports.authorization = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    console.log(user.isAdmin);
    if (!user.isAdmin) {
        return next(new err_1.default('You are not authorized to access this route', 403));
    }
    next();
}));
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userModel_1.default.create(req.body);
    const url = '12';
    yield new email_1.default(newUser, url).sendWelcome();
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    newUser.refreshToken = refreshToken;
    yield newUser.save({ validateBeforeSave: false });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken,
        data: {
            newUser
        }
    });
}));
exports.logout = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield userModel_1.default.findById(id);
    if (user) {
        user.refreshToken = undefined;
        yield user.save({ validateBeforeSave: false });
    }
    res.clearCookie('accessToken');
    res.status(200).json({ status: 'Logged out!' });
}));
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: req.body.email });
    if (!user)
        return next(new err_1.default(`There is no user with email ${req.body.email}`, 404));
    const resetToken = user.createPasswordRestToken();
    yield user.save({ validateBeforeSave: false });
    try {
        const restURL = `http://127.0.0.1:3000/api/v1/users/resetpassword/${resetToken}`;
        yield new email_1.default(user, restURL).sendPasswordReset();
        res.status(200).json({
            status: 'success',
            acessToken: resetToken,
            message: 'Token send to email !'
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        console.log(err.message);
        return next(new err_1.default('There was an error sending this email. Try again later!', 500));
    }
}));
exports.resetpassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    console.log(user);
    if (!user) {
        return next(new err_1.default('Token is invalid or expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    yield user.save({ validateBeforeSave: false });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(200).json({
        ststus: 'sucess',
        message: 'Done'
    });
}));
