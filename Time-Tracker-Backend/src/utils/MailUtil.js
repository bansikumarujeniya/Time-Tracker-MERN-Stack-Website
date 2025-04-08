const mailer = require('nodemailer');

const sendingMail = async (to, firstName, lastName, subject = "Welcome to Time Tracker!", text, htmlContent) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: "engineeringstudent013@gmail.com", 
            pass: "cbrp vnhq qbwi otbl" 
        }
    });

    const isWelcomeMail = subject === "Welcome to Time Tracker!";

    const userMailOptions = {
        from: 'engineeringstudent013@gmail.com',
        to,
        subject,
        text: text || (isWelcomeMail
            ? `Hi ${firstName} ${lastName}, You have successfully signed up for Time Tracker. Start tracking your time efficiently today!`
            : ''),
        html: htmlContent || (isWelcomeMail
            ? `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; background-color: #D0DDD0;">
                    <h2 style="color: #AAB99A;">Welcome to Time Tracker, ${firstName} ${lastName}!</h2>
                    <p style="color: #555; font-size: 16px;">You have successfully signed up for Time Tracker. Start tracking your time efficiently today!</p>
                    <p style="margin-top: 20px;">
                        <a href="https://t8qvsq15-5173.inc1.devtunnels.ms/" style="background-color: #AAB99A; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
                            Get Started
                        </a>
                    </p>
                </div>`
            : '')
    };

    const adminMailOptions = {
        from: 'engineeringstudent013@gmail.com',
        to: 'engineeringstudent013@gmail.com',
        subject: "New User Signed Up for Time Tracker",
        text: `A new user has signed up for Time Tracker.\n\nName: ${firstName} ${lastName}\nEmail: ${to}`,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; background-color: #D0DDD0;">
                <h2 style="color: #AAB99A;">New User Registration!</h2>
                <p style="color: #555; font-size: 16px;">A new user has signed up for Time Tracker.</p>
                <p><strong style="color: #333;">Name:</strong> ${firstName} ${lastName}</p>
                <p><strong style="color: #333;">Email:</strong> ${to}</p>
                <p style="margin-top: 20px;">Check your admin panel for more details.</p>
               </div>`
    };

    try {
        const userMailResponse = await transporter.sendMail(userMailOptions);
        const adminMailResponse = await transporter.sendMail(adminMailOptions);

        console.log("✅ User Email Sent:", userMailResponse);
        console.log("✅ Admin Notification Sent:", adminMailResponse);

        return { success: true, message: 'Emails sent successfully to both user and admin' };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return { success: false, message: error.message };
    }
};

module.exports = { sendingMail };
