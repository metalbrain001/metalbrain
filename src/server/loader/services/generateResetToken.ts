import crypto from 'crypto';
import User from '../sequelize/models/user/user.model';
import sendEmail from './nodemailer';

async function requestPasswordReset(email: string): Promise<string> {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }
  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);
  user.reset_password_token = token;
  user.reset_password_expires = expires;
  await user.save();

  const subject = 'Password reset request';
  const resetUrl = `http://localhost:3000/reset/${token}`;
  const html = `
                 <p>Hello ${user.firstName},</p>
                 <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
                 <p>If you did not request a password reset, please ignore this email.</p>
                 <p>This link will expire in 1 hour.</p>
                  <p>Thanks,</p>
            `;

  sendEmail(email, subject, html);

  return token;
}

export default requestPasswordReset;
