const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const {
  BASE_URL_PUBLIC,
  MAILER_EMAIL,
  MAILER_CLIENT_ID,
  MAILER_CLIENT_SECRET,
  MAILER_REFRESH_TOKEN,
} = process.env;

class MailService {
  constructor() {
    this.setupTransporter();
  }

  async setupTransporter() {
    const oauth2Client = new google.auth.OAuth2(
      MAILER_CLIENT_ID,
      MAILER_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({ refresh_token: MAILER_REFRESH_TOKEN });
    const { res } = await oauth2Client.getAccessToken();
    const accessToken = res.data.access_token;

    // console.log(accessToken);

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: MAILER_EMAIL,
        accessToken,
        clientId: MAILER_CLIENT_ID,
        clientSecret: MAILER_CLIENT_SECRET,
        refreshToken: MAILER_REFRESH_TOKEN,
      },
    });
  }

  async sendMail(sendTo, verificationToken) {
    return await this.transporter.sendMail({
      from: MAILER_EMAIL,
      to: sendTo,
      subject: 'Confirm your email',
      html: `
        <div>
          <h1>Для активации аккаунта перейдите по ссылке: </h1>
          </br>
          <a href="${BASE_URL_PUBLIC}/users/verify/${verificationToken}">
            ${BASE_URL_PUBLIC}/users/verify/${verificationToken}
          </a>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
