import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Please fill all the required fields.' });
        }

        try {
            // Create a transporter
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER, // Your email
                    pass: process.env.SMTP_PASS, // Your email password
                },
            });

            // Send the email
            await transporter.sendMail({
                from: `"${name}" <${email}>`, // Sender's name and email
                to: 'radhikaworkspace07@gmail.com', // Your email
                subject: subject || 'New Message from Your Website', // Subject line
                text: message, // Plain text body
            });

            return res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to send email.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
