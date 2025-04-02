const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Ton email
        pass: process.env.EMAIL_PASS   // Ton mot de passe d'application
    }
});

const sendMail = async ({ to, subject, text }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email envoyé avec succès à", to);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
    }
};

module.exports = sendMail;
