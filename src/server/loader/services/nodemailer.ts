import nodemailer from 'nodemailer';
import { smtpenv } from '../config/smtpENV';

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: smtpenv.SMTP_HOST,
    port: Number(smtpenv.SMTP_PORT),
    secure: false,
    auth: {
      user: smtpenv.SMTP_USER,
      pass: smtpenv.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: smtpenv.SMTP_FROM,
    to,
    subject,
    html,
  });
}

export default sendEmail;
