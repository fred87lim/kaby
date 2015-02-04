var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "tranhungnguyen@gmail.com",
        pass: "Hungnguyen"
    }
});

module.exports = smtpTransport;