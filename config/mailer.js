const nodemailer = require('nodemailer')
const config = require('config')

const sendConfirmationEmail = function (user) {
    return new Promise((res, rej) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.googleUser,
                pass: config.googlePassword
            }
        })

        const message = {
            from: config.googleUser,
            to: user.email,
            subject: 'Microjobs - Activare cont',
            html: `
            <h2>Salut ${user.name}</h2>
            <p>Îți mulțumim pentru că te-ai înregistrat pe <span style="font-weight:bold;color:#667eea">Microjobs România</span>.</p>
            <p>Pentru a-ți activa contul, fă click pe următorul link: <a target="_blank" style="color:#667eea" href="${config.domain}/activation/user/${user._id}">Activare cont</a></p>
            <p style="color:#a0aec0">Echipa <span style="font-weight:bold">Microjobs România</span></p>`
        }
        transporter.sendMail(message, function (err, info) {
            if (err) {
                rej(err)
            } else {
                res(info);
            }
        })
    })
}

module.exports = sendConfirmationEmail;