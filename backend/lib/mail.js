import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" 
);

oAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

export const sendResetCodeEmail = async (email, code) => {
    const subject = "Your Password Reset Code";
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    
    const messageParts = [
        `From: BeautyUp <${process.env.SMTP_USER}>`,
        `To: ${email}`,
        "Content-Type: text/html; charset=utf-8",
        "MIME-Version: 1.0",
        `Subject: ${utf8Subject}`,
        "",
        "<h1>Password Reset</h1>",
        `<p>Your code is: <strong>${code}</strong></p>`,
    ];
    
    const message = messageParts.join("\n");

    const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    try {
        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });
        console.log("Email sent successfully via Gmail HTTP API!");
    } catch (error) {
        console.error("Gmail API Error:", error);
        throw error;
    }
};