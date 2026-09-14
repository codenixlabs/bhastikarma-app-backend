import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const mailSender = async (email, title, body) => {
    try {
        const port = Number(process.env.MAIL_PORT);
        const isSecure = String(process.env.MAIL_SECURE).trim() === 'true';

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || "smtp.gmail.com",
            port: port,
            secure: isSecure, // Port 465 MUST be secure (true)
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            logger: true, 
        });

        let info = await transporter.sendMail({
            from: `Bhastikarma App <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log(info);
        return info;
    } catch (error) {
        console.log("Error inside mailSender:", error.message);
        throw error;
    }
}

export default mailSender;
