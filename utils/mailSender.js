import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
    try {
        const data = await resend.emails.send({
            from: `Bhastikarma App <${process.env.MAIL_USER}>`, 
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent successfully via Resend: ", data);
        return data;
    } catch (error) {
        console.log("Error inside mailSender:", error.message);
        throw error;
    }
}

export default mailSender;
