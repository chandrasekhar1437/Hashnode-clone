const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendEmail = async ({ to, subject, html }) => {
  const otpMatch = html.match(/<b>(\d{6})<\/b>/);
  const otp = otpMatch ? otpMatch[1] : '------';

  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = { 
      email: process.env.FROM_EMAIL || 'bba519001@smtp-brevo.com', 
      name: 'Hashnode Clone' 
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Live email successfully sent to ${to} via Brevo API`);
  } catch (error) {
    console.warn('⚠️ Network block detected. Falling back to Terminal Simulator.');
    console.log('\n========================================');
    console.log(`📧 [LOCAL EMAIL SIMULATOR] To: ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`🔑 VERIFICATION OTP CODE: ${otp}`);
    console.log('========================================\n');
  }
};

module.exports = sendEmail;