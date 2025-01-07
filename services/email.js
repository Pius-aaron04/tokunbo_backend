// serviees/email.js

const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

class EmailService {
	async sendEmail(to, subject, text, html, htmlPath='') {
		if (htmlPath) {
			const fs = require("fs");
			html = fs.readFileSync(htmlPath, "utf-8");
		}
		try {
			return mailjet
				.post("send", { version: "v3.1" })
				.request({
					Messages: [
						{
							From: {
								Email: process.env.MJ_FROM_EMAIL,
								Name: process.env.MJ_FROM_NAME,
							},
							To: [
								{
									Email: to,
								},
							],
							Subject: subject,
							TextPart: text,
							HTMLPart: html,
						},
					],
				})
			} catch (error) {
				console.error(error);
				throw new MailError(error.message);
			}
	}

	async sendOtp(to) {
		const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
		const { response } = await this.sendEmail(to, 'OTP', `Your OTP is ${otp}`, `Your OTP is ${otp}`);
		if (response.statusText === 'OK') {
			//logic to store otp in redis
			response.d_ata = { otp };
		} else {
			response.errorNiche = 'Failed to send OTP';							
		}
		return response;
	}
}
class MailError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MailError';
    }
}
module.exports = new EmailService();
