import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.SMTP_USER, 
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
});

export const sendResetCodeEmail = async (email, code) => {
    const mailOptions = {
        from: `BeautyUp <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your Password Reset Code",
        text: `Your reset code is: ${code}`,
        html: `<h1>Password Reset</h1><p>Your code is: <strong>${code}</strong></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully via OAuth2");
    } catch (error) {
        console.error("Nodemailer OAuth2 Error:", error);
        throw error;
    }
};