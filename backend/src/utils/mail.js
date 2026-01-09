import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

export const sendMail = async (to, subject, text, html) => {
    try {
        await transporter.sendMail({
            from: '"Proleave" <sougatapatra23357@gmail.com>',
            to,
            subject,
            text,
            html
        })
    } catch (err) {
        console.error("Error sending email: ", err);
        throw new Error("Failed to send email");
    }
}