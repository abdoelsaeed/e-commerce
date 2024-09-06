"use strict";
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const pug_1 = __importDefault(require("pug"));
const html_to_text_1 = require("html-to-text");
class Email {
    constructor(user, url) {
        this.user = user;
        this.url = url;
        this.firstname = user.name.split(' ')[0];
        this.to = user.email;
        this.form = `Abdelrahman <${process.env.EMAIL_FORM}>`;
    }
    newTransport() {
        if (process.env.NODE_ENV === 'development') {
            return nodemailer_1.default.createTransport({
                host: process.env.GMAIL_HOST,
                port: Number(process.env.GMAIL_PORT),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD,
                },
            }); // Explicitly cast as SMTPTransport.Options
        }
        return nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = pug_1.default.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
                firstname: this.firstname,
                url: this.url,
                subject
            });
            const mailOptions = {
                from: this.form,
                to: this.to,
                subject: subject,
                html,
                text: (0, html_to_text_1.htmlToText)(html)
            };
            yield this.newTransport().sendMail(mailOptions);
        });
    }
    sendWelcome() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('welcome', 'Welcome to the natours family!');
        });
    }
    sendPasswordReset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('passwordReset', 'Your password reset token (vaild for 10 miuntes)');
        });
    }
}
exports.default = Email;
