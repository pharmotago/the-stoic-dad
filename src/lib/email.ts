import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLicenseKeyEmail(email: string, keyCode: string) {
    try {
        await resend.emails.send({
            from: 'Stoic Dad Protocol <access@the-stoic-dad.com>',
            to: email,
            subject: 'Your Premium Access Key - The Stoic Dad',
            html: `
                <h2>Welcome to the Inner Circle</h2>
                <p>Your payment was successful. Here is your unique lifetime access key:</p>
                <div style="padding: 16px; background: #f1f5f9; border-radius: 8px; font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0;">
                    ${keyCode}
                </div>
                <p>Open the app, click "Unlock Protocol", and paste this code to begin.</p>
                <br/>
                <p>Stay strong,</p>
                <p>The MCJP Team</p>
            `
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
