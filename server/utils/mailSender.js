const SibApiV3Sdk = require('sib-api-v3-sdk');

const isPlaceholderEmail = (email) => !email || email.includes('your_email') || email.includes('example.com');

const mailSender = async (email, title, body) => {
    try {
        if (!process.env.BREVO_API_KEY) {
            throw new Error('BREVO_API_KEY is not defined in environment variables');
        }

        const client = SibApiV3Sdk.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const senderName = process.env.EMAIL_FROM_NAME || 'LetLearn';
        const senderEmail =
            process.env.EMAIL_FROM_EMAIL ||
            process.env.BREVO_SENDER_EMAIL ||
            process.env.EMAIL_USER;

        if (isPlaceholderEmail(senderEmail)) {
            throw new Error('Set EMAIL_FROM_EMAIL to a verified Brevo sender email address');
        }

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = {
            name: senderName,
            email: senderEmail,
        };
        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.subject = title;
        sendSmtpEmail.htmlContent = body;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        return response;
    } catch (err) {
        console.error('Error sending email:', err);
        throw err;
    }
};

module.exports = mailSender;
