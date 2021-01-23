const mailer = require('nodemailer')

function sendEmail(email, subject, body, callback) {
    const transport = mailer.createTransport({
        service: 'gmail',
        auth: {
         user: 'pizzavalaofficial@gmail.com ',
         pass: 'pizzavala2021'
       
        }
    })

    transport.sendMail({
        from: 'noreply@myevernote.com',
        to: email,
        subject: subject,
        html: body
    }, callback)
}

module.exports = {
    sendEmail: sendEmail
}