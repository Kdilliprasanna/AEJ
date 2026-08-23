import nodemailer from 'nodemailer';
import 'dotenv/config';

const user = 'dilliprasanna1523@gmail.com';
const pass = 'gxunathhsvqpwztl';

async function testAllTransports() {
  console.log('--- TESTING GMAIL TRANSPORTS ---');

  // Mode 1: service: 'gmail'
  try {
    console.log('1. Trying service: gmail...');
    const t1 = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    });
    const i1 = await t1.sendMail({
      from: 'Career AI Support <dilliprasanna1523@gmail.com>',
      to: 'nanianand004@gmail.com',
      subject: '🔑 Career AI Password Reset Link (Service Gmail)',
      text: 'Reset Link: http://localhost:5176/?token=test12345'
    });
    console.log('🎉 SUCCESS WITH SERVICE GMAIL! Message ID:', i1.messageId);
    return;
  } catch (e) {
    console.error('❌ Service gmail failed:', e.message);
  }

  // Mode 2: host: smtp.gmail.com, port: 587
  try {
    console.log('2. Trying smtp.gmail.com:587...');
    const t2 = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    });
    const i2 = await t2.sendMail({
      from: 'Career AI Support <dilliprasanna1523@gmail.com>',
      to: 'nanianand004@gmail.com',
      subject: '🔑 Career AI Password Reset Link (Port 587)',
      text: 'Reset Link: http://localhost:5176/?token=test12345'
    });
    console.log('🎉 SUCCESS WITH PORT 587! Message ID:', i2.messageId);
    return;
  } catch (e) {
    console.error('❌ Port 587 failed:', e.message);
  }

  // Mode 3: host: smtp.gmail.com, port: 465 (SSL)
  try {
    console.log('3. Trying smtp.gmail.com:465 (SSL)...');
    const t3 = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    });
    const i3 = await t3.sendMail({
      from: 'Career AI Support <dilliprasanna1523@gmail.com>',
      to: 'nanianand004@gmail.com',
      subject: '🔑 Career AI Password Reset Link (Port 465)',
      text: 'Reset Link: http://localhost:5176/?token=test12345'
    });
    console.log('🎉 SUCCESS WITH PORT 465! Message ID:', i3.messageId);
    return;
  } catch (e) {
    console.error('❌ Port 465 failed:', e.message);
  }
}

testAllTransports();
