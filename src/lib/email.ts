import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "onboarding@resend.dev"; // Using Resend's testing domain initially

interface WelcomeEmailProps {
  name: string;
  email: string;
  password: string;
  to: string;
}

export async function sendAgentWelcomeEmail({
  name,
  email,
  password,
  to,
}: WelcomeEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Welcome to Budget Travel Admin Panel",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #01ff70;">Welcome, ${name}!</h2>
          <p>You have been invited to join the Budget Travel Packages admin panel as an Agent.</p>
          <p>Here are your login credentials:</p>
          <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
          </div>
          <p>Please log in and change your password immediately.</p>
          <a href="${process.env.NEXTAUTH_URL}/admin/login" style="display: inline-block; background: #01ff70; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Admin Panel</a>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email Sending Error:", error);
    return { success: false, error };
  }
}
