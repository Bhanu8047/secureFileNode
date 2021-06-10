const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

module.exports.resetPassword = async(name, email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `"File-Box" <${process.env.MAIL_USER}>`,
            to: email,
            subject: `Welcome to Filebox ${name}, reset password request`,
            html: `
                <div>
                    <h2 style="font-size:20px;font-weight:400;color:#555"> one time password: ${otp} </h2>
                </div>
            `})
        return {accepted: info.accepted, rejected: info.rejected}
    } catch (error) {
        return error
    }
}