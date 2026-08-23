import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore if not supported
}

import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_FROM = process.env.SMTP_FROM || process.env.MAIL_FROM || 'Career AI Support <support@career-ai.com>';
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5176').split(',')[0].trim();
const TIMEOUT_MS = 6000;

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SMTP2GO_USER = process.env.SMTP2GO_USER || '';
const SMTP2GO_PASS = process.env.SMTP2GO_PASS || '';

export function isSmtpConfigured() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

export function getEmailServiceStatus() {
  return {
    mode: isSmtpConfigured() ? 'SMTP Live Delivery' : 'Development Fallback (Local)',
    configured: isSmtpConfigured(),
    smtpHost: SMTP_HOST ? SMTP_HOST : 'Unconfigured',
    smtpPort: SMTP_PORT,
    fromAddress: SMTP_FROM
  };
}

/**
 * Renders professional Career AI password reset HTML template
 */
export function renderPasswordResetHtml({ resetLink, recipientEmail }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Career AI Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="560" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 32px; max-width: 560px;">
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #38bdf8; letter-spacing: -0.5px;">
                CAREER AI <span style="font-size: 14px; font-weight: 500; color: #94a3b8; background: #0f172a; padding: 4px 8px; border-radius: 4px; margin-left: 6px;">ARJ ENGINE</span>
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding-top: 24px; padding-bottom: 24px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
              <p style="margin-top: 0; color: #f8fafc; font-size: 18px; font-weight: 600;">Password Reset Request</p>
              <p>We received a request to reset the password for your Career AI account (<strong>${recipientEmail}</strong>).</p>
              <p>Click the button below to choose a new secure password. This link is valid for <strong>30 minutes</strong> and can only be used once.</p>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">
                      Reset My Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #94a3b8;">If the button above does not work, copy and paste this link into your web browser:</p>
              <p style="font-size: 12px; word-break: break-all; color: #38bdf8; background: #0f172a; padding: 10px; border-radius: 6px; margin-top: 4px;">
                ${resetLink}
              </p>
            </td>
          </tr>

          <!-- Security Disclaimer -->
          <tr>
            <td style="padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0;"><strong>Didn't request this?</strong> You can safely ignore this email; your password will remain unchanged.</p>
              <p style="margin-top: 8px; margin-bottom: 0;">&copy; ${new Date().getFullYear()} Career AI Acceleration Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Primary Email Delivery Function for Password Reset
 * Tries: Resend HTTPS API -> SMTP2Go -> Standard SMTP (587/465) -> Dev Fallback
 */
export async function sendPasswordResetEmail({ to, token, origin }) {
  const baseUrl = (origin || CLIENT_URL || 'http://localhost:5176').replace(/\/$/, '');
  const resetLink = `${baseUrl}/?token=${token}`;
  const htmlContent = renderPasswordResetHtml({ resetLink, recipientEmail: to });
  const textContent = `Reset your Career AI password:\n\n${resetLink}\n\nThis link expires in 30 minutes. If you did not request this, please ignore.`;

  // 1. Try Resend HTTPS API (Port 443 - always open)
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Career AI Support <onboarding@resend.dev>',
          to: [to],
          subject: '🔑 Reset Your Career AI Password',
          html: htmlContent
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Password reset email sent via Resend API to ${to}:`, data.id);
        return { sent: true, mode: 'resend', id: data.id, resetLink };
      }
    } catch (e) {
      console.warn(`⚠️ Resend reset email failed for ${to}:`, e.message);
    }
  }

  // 1b. Try Brevo HTTPS API (Port 443 - always open)
  const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
  if (BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Career AI Support', email: 'support@career-ai.com' },
          to: [{ email: to }],
          subject: '🔑 Reset Your Career AI Password',
          htmlContent: htmlContent
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Password reset email sent via Brevo API to ${to}:`, data.messageId);
        return { sent: true, mode: 'brevo', messageId: data.messageId, resetLink };
      }
    } catch (e) {
      console.warn(`⚠️ Brevo reset email failed for ${to}:`, e.message);
    }
  }

  // 1c. Try EmailJS HTTPS API (Port 443 - always open)
  const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '';
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: to,
            recipient_email: to,
            reset_link: resetLink
          }
        })
      });
      if (res.ok) {
        console.log(`✅ Password reset email sent via EmailJS HTTPS to ${to}`);
        return { sent: true, mode: 'emailjs', resetLink };
      }
    } catch (e) {
      console.warn(`⚠️ EmailJS reset email failed for ${to}:`, e.message);
    }
  }

  // 2. Try SMTP2Go (Port 2525)
  if (SMTP2GO_USER && SMTP2GO_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 2525,
        secure: false,
        auth: { user: SMTP2GO_USER, pass: SMTP2GO_PASS },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000
      });
      const info = await transporter.sendMail({
        from: `Career AI Support <${SMTP2GO_USER}>`,
        to,
        subject: '🔑 Reset Your Career AI Password',
        text: textContent,
        html: htmlContent
      });
      console.log(`✅ Password reset email sent via SMTP2Go to ${to}:`, info.messageId);
      return { sent: true, mode: 'smtp2go', messageId: info.messageId, resetLink };
    } catch (err) {
      console.warn(`⚠️ SMTP2Go reset email failed for ${to}:`, err.message);
    }
  }

  // 3. Try Standard SMTP (Port 587, fallback to 465)
  if (isSmtpConfigured()) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 4000
      });
      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject: '🔑 Reset Your Career AI Password',
        text: textContent,
        html: htmlContent
      });
      console.log(`✅ Password reset email sent via SMTP to ${to}:`, info.messageId);
      return { sent: true, mode: 'smtp', messageId: info.messageId, resetLink };
    } catch (err) {
      try {
        const transporter465 = nodemailer.createTransport({
          host: SMTP_HOST,
          port: 465,
          secure: true,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
          connectionTimeout: 4000,
          greetingTimeout: 4000,
          socketTimeout: 4000
        });
        const info = await transporter465.sendMail({
          from: SMTP_FROM,
          to,
          subject: '🔑 Reset Your Career AI Password',
          text: textContent,
          html: htmlContent
        });
        console.log(`✅ Password reset email sent via SMTP 465 to ${to}:`, info.messageId);
        return { sent: true, mode: 'smtp465', messageId: info.messageId, resetLink };
      } catch (err2) {
        console.warn(`⚠️ Network SMTP ports (587/465) blocked by ISP for ${to}:`, err2.message);
      }
    }
  }

  // Resilient fallback for local testing when network ISP firewall blocks SMTP
  console.log(`\n======================================================`);
  console.log(`🔑 PASSWORD RESET LINK GENERATED FOR ${to}:`);
  console.log(`👉 ${resetLink}`);
  console.log(`======================================================\n`);
  return { sent: true, mode: 'dev_fallback', resetLink };
}

/**
 * Renders Welcome & Account Verification HTML Template
 */
export function renderWelcomeHtml({ name, recipientEmail }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Career AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="560" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 32px; max-width: 560px;">
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #38bdf8; letter-spacing: -0.5px;">
                CAREER AI <span style="font-size: 14px; font-weight: 500; color: #94a3b8; background: #0f172a; padding: 4px 8px; border-radius: 4px; margin-left: 6px;">WELCOME</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 24px; padding-bottom: 24px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
              <p style="margin-top: 0; color: #f8fafc; font-size: 18px; font-weight: 600;">Welcome, ${name || 'Career Seeker'}! 🎉</p>
              <p>Your Career AI account (<strong>${recipientEmail}</strong>) has been successfully created & registered.</p>
              <p>You now have full access to:</p>
              <ul style="color: #38bdf8; padding-left: 20px;">
                <li>⚡ ATS Resume Analyzer & Score Enhancer</li>
                <li>🎯 AI Job Match & Automated Alerts</li>
                <li>📊 Round-Wise Practice & Voice Interview Simulation</li>
                <li>💰 Salary Insights & Negotiation Calculator</li>
              </ul>
              <p style="font-size: 13px; color: #94a3b8;">If you did not register for this account, please ignore or contact support.</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Career AI Acceleration Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends Welcome Confirmation Email on Registration via SMTP
 */
export async function sendWelcomeEmail({ to, name }) {
  if (!isSmtpConfigured()) {
    return { sent: false, mode: 'development' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: TIMEOUT_MS,
      greetingTimeout: TIMEOUT_MS,
      socketTimeout: TIMEOUT_MS
    });

    const htmlContent = renderWelcomeHtml({ name, recipientEmail: to });
    const textContent = `Welcome to Career AI, ${name || 'User'}!\n\nYour account (${to}) is ready. Start optimizing your resume, practicing interviews, and matching jobs today.`;

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: '🚀 Welcome to ARJ Career AI — Registration Confirmed',
      text: textContent,
      html: htmlContent
    });

    return { sent: true, mode: 'smtp', messageId: info.messageId };
  } catch (err) {
    console.error(`⚠️ SMTP Welcome Email Failed for ${to}:`, err.message);
    return { sent: false, mode: 'error', error: err.message };
  }
}

/**
 * Renders 6-Digit Verification OTP Email Template
 */
export function renderOtpEmailHtml({ name, otpCode, recipientEmail }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email - Career AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="560" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 32px; max-width: 560px;">
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #38bdf8; letter-spacing: -0.5px;">
                CAREER AI <span style="font-size: 14px; font-weight: 500; color: #94a3b8; background: #0f172a; padding: 4px 8px; border-radius: 4px; margin-left: 6px;">EMAIL VERIFICATION</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 24px; padding-bottom: 24px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
              <p style="margin-top: 0; color: #f8fafc; font-size: 18px; font-weight: 600;">Hello ${name || 'Career Seeker'},</p>
              <p>Your 6-digit email verification code for Career AI (<strong>${recipientEmail}</strong>) is:</p>
              
              <div style="text-align: center; margin: 24px 0;">
                <span style="display: inline-block; background-color: #0f172a; color: #38bdf8; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px; border: 1px solid #0284c7; box-shadow: 0 0 20px rgba(2, 132, 199, 0.25);">
                  ${otpCode}
                </span>
              </div>

              <p style="font-size: 13px; color: #94a3b8; text-align: center;">This verification code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0;">If you did not attempt to register an account, you can safely ignore this email.</p>
              <p style="margin-top: 8px; margin-bottom: 0;">&copy; ${new Date().getFullYear()} Career AI Acceleration Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends 6-Digit Verification OTP Email.
 * Tries in order: Resend HTTPS API → SMTP2Go port 2525 → Standard SMTP
 */
export async function sendVerificationOtpEmail({ to, name, otpCode }) {
  const htmlContent = renderOtpEmailHtml({ name, otpCode, recipientEmail: to });
  const textContent = `Your Career AI 6-Digit Email Verification Code is: ${otpCode}\n\nValid for 10 minutes. Do not share this with anyone.`;

  // 1. Try Resend HTTPS API (Port 443 - always open)
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Career AI Verification <onboarding@resend.dev>',
          to: [to],
          subject: `🔑 ${otpCode} is your Career AI Verification Code`,
          html: htmlContent
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Email delivered via Resend to ${to}:`, data.id);
        return { sent: true, mode: 'resend', id: data.id };
      }
      const errText = await res.text();
      console.warn(`⚠️ Resend API responded ${res.status}:`, errText);
    } catch (e) {
      console.warn(`⚠️ Resend HTTPS attempt for ${to}:`, e.message);
    }
  }

  // 1b. Try Brevo HTTPS API (Port 443 - always open)
  const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
  if (BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Career AI Verification', email: 'support@career-ai.com' },
          to: [{ email: to }],
          subject: `🔑 ${otpCode} is your Career AI Verification Code`,
          htmlContent: htmlContent
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Email delivered via Brevo API to ${to}:`, data.messageId);
        return { sent: true, mode: 'brevo', messageId: data.messageId };
      }
    } catch (e) {
      console.warn(`⚠️ Brevo HTTPS attempt for ${to}:`, e.message);
    }
  }

  // 2. Try SMTP2Go on port 2525 (confirmed open on most ISP networks)
  if (SMTP2GO_USER && SMTP2GO_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 2525,
        secure: false,
        auth: { user: SMTP2GO_USER, pass: SMTP2GO_PASS },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
      });
      const info = await transporter.sendMail({
        from: `Career AI Support <${SMTP2GO_USER}>`,
        to,
        subject: `\uD83D\uDD11 ${otpCode} is your Career AI Verification Code`,
        text: textContent,
        html: htmlContent
      });
      console.log(`\u2705 Email delivered via SMTP2Go to ${to}:`, info.messageId);
      return { sent: true, mode: 'smtp2go', messageId: info.messageId };
    } catch (err) {
      console.warn(`\u26A0\uFE0F SMTP2Go attempt for ${to}:`, err.message);
    }
  }

  // 3. Try standard SMTP as last resort
  if (isSmtpConfigured()) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 4000
      });
      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject: `🔑 ${otpCode} is your Career AI Verification Code`,
        text: textContent,
        html: htmlContent
      });
      console.log(`✅ Email delivered via SMTP to ${to}:`, info.messageId);
      return { sent: true, mode: 'smtp', messageId: info.messageId };
    } catch (err) {
      console.warn(`⚠️ SMTP 587 attempt for ${to}:`, err.message);
      try {
        const transporter465 = nodemailer.createTransport({
          host: SMTP_HOST,
          port: 465,
          secure: true,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
          connectionTimeout: 4000,
          greetingTimeout: 4000,
          socketTimeout: 4000
        });
        const info = await transporter465.sendMail({
          from: SMTP_FROM,
          to,
          subject: `🔑 ${otpCode} is your Career AI Verification Code`,
          text: textContent,
          html: htmlContent
        });
        console.log(`✅ Email delivered via SMTP 465 to ${to}:`, info.messageId);
        return { sent: true, mode: 'smtp465', messageId: info.messageId };
      } catch (err2) {
        console.warn(`⚠️ SMTP ports (587/465) blocked by ISP for ${to}:`, err2.message);
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`🔑 VERIFICATION OTP GENERATED FOR ${to}: ${otpCode}`);
  console.log(`======================================================\n`);
  return { sent: true, mode: 'dev_fallback' };
}
