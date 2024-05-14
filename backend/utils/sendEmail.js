// const nodemailer = require('nodemailer');
const { createTransport } = require('nodemailer')

const sendEmail = async (to, subject, text) => {
    console.log(process.env.SMTP_HOST)
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    const info = await transporter.sendMail({
        from: 'lakshya@gmail.com',
        to,
        subject,
        text
    })
   console.log(`Email Sent ${info.messageId}`)
   return true;
}

module.exports = {sendEmail}