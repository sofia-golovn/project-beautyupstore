import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Nodemailer Error:", error);
        throw error;
    }
};