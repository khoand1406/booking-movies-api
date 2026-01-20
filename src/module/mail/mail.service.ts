import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
    }
    async sendMail(options: {
        to: string;
        subject: string;
        html: string;
        text?: string;
    }) {
        try {
            return await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
        } catch (error) {
            console.error('Send mail error:', error);
            throw new InternalServerErrorException('Cannot send email');
        }
    }
    async sendOtpEmail(to: string, otp: string) {
        return this.sendMail({
            to,
            subject: 'Your booking verification code',
            html: `
        <h2>Booking Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
    `,
        });
    }

}