import nodemailer,{Transporter} from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IUser } from '../models/userModel';
export default class Email{
    firstname: string;
    form:string;
    to: string;
    constructor(public user:IUser, public url:string){
        this.firstname = user.name.split(' ')[0];
        this.to = user.email;
        this.form = `Abdelrahman <${process.env.EMAIL_FORM}>`;
    }
    newTransport():Transporter {
    if (process.env.NODE_ENV === 'development') {
        return nodemailer.createTransport({
        host: process.env.GMAIL_HOST,
        port: Number(process.env.GMAIL_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_USERNAME as string,
            pass: process.env.GMAIL_PASSWORD as string,
        },
      } as SMTPTransport.Options); // Explicitly cast as SMTPTransport.Options
    }
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
        user: process.env.EMAIL_USERNAME as string,
        pass: process.env.EMAIL_PASSWORD as string,
        },
    } as SMTPTransport.Options);
    }
    async send(template: string, subject: string): Promise<void> {
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,
        {
        firstname: this.firstname,
        url: this.url,
        subject
        });
    const mailOptions = {
        from: this.form,
        to: this.to,
        subject: subject,
        html,
        text: htmlToText(html)
    };
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours family!');
    }
    async sendPasswordReset() {
    await this.send(
        'passwordReset',
        'Your password reset token (vaild for 10 miuntes)'
    );
    }
}