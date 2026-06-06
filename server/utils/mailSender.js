const nodemailer = require("nodemailer");
exports.sendEmail = async (email, title, body) => {

    try{
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        let info = await transporter.sendMail({
            from: '"LetLearn"',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        });
        return info;
    }
    catch(err){
        console.error("Error sending email:", err);
    }
};

module.exports = exports.sendEmail;