import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetCodeEmail = async (email, code) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "BeautyUp <onboarding@resend.dev>",
            to: email,
            subject: "Your Password Reset Code",
            text: `Your reset code is: ${code}`,
            html: `<h1>Password Reset</h1><p>Your code is: <strong>${code}</strong></p>`,
        });

        if (error) {
            console.error("Resend API Error:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully via Resend:", data.id);
    } catch (error) {
        console.error("Resend Catch Error:", error);
        throw error;
    }
};