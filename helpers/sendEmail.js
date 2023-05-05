const nodemailer = require('nodemailer')
const {EMAIL_FROM, META_PASSWORD} = process.env

const nodemailerConfigOptions = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_FROM,
      pass: META_PASSWORD
    }
}

const transport = nodemailer.createTransport(nodemailerConfigOptions)

const sendEmail = async (data) => {
    const email = { ...data, from: EMAIL_FROM }
    await transport.sendMail(email)
    return true
}

module.exports = sendEmail