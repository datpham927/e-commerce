require("dotenv").config();
const nodemailer = require('nodemailer');

const sendMail = async ({ email, html, fullName }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    // define the email message
    const mailOptions = {
        from: 'dpshopvn <dpshopvn@gmail.com>',
        to: email,
        subject: `Xin chào ${fullName}`,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Server responded with "%s"', info.response);
    } catch (error) {
        console.log('Error occurred while sending email');
        console.log(error.message);
    } finally {
        transporter.close();
    }
}

module.exports = sendMail;
