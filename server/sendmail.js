const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});

const HTMLtemplates = {
    verify: (token) => `<p>Here is your verification link: <a>http://localhost:3000/verify/?token=${token}</a></p>`
};

const send = (to, subject, template, args = never) => {
    const mailOptions = { 
        from: process.env.USER,
        to: to,
        subject: subject,
        html: HTMLtemplates[template](args),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
};

module.exports = {
    send
};
