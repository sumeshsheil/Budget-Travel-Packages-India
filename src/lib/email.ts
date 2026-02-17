import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = "Budget Travel <bookings@budgettravelpackages.in>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sm.sanny1235@gmail.com";

// --- Email Templates (Shared Styles) ---

const styles = {
  container: `
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
  `,
  header: `
    background-color: #1a1a1a;
    padding: 30px 20px;
    text-align: center;
  `,
  headerTitle: `
    color: #01ff70;
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.5px;
  `,
  body: `
    padding: 40px 30px;
    color: #333333;
    line-height: 1.6;
  `,
  h2: `
    color: #111111;
    font-size: 20px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 20px;
  `,
  p: `
    margin-bottom: 16px;
    font-size: 16px;
    color: #555555;
  `,
  dataBox: `
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 20px;
    margin: 25px 0;
    border-left: 4px solid #01ff70;
  `,
  dataItem: `
    margin: 8px 0;
    font-size: 15px;
    color: #333;
  `,
  button: `
    display: inline-block;
    background-color: #01ff70;
    color: #000000;
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 16px;
    margin-top: 20px;
    text-align: center;
  `,
  footer: `
    background-color: #f9f9f9;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #eeeeee;
    font-size: 12px;
    color: #999999;
  `,
};

// --- Interfaces ---

interface WelcomeEmailProps {
  name: string;
  email: string;
  password: string;
  to: string;
}

interface LeadConfirmationProps {
  name: string;
  email: string;
  phone: string;
  destination: string;
  budget: number;
  guests: number;
}

interface LeadNotificationProps {
  name: string;
  email: string;
  phone: string;
  destination: string;
  budget: number;
  guests: number;
}

// --- Email Functions ---

// 1. Agent Welcome Email
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
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Budget Travel Admin</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Welcome, ${name}!</h2>
            <p style="${styles.p}">You have been granted access to the Budget Travel Packages admin panel as an Agent.</p>
            <p style="${styles.p}">Please use the credentials below to log in securely:</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong>Email:</strong> ${email}</p>
              <p style="${styles.dataItem}"><strong>Temporary Password:</strong> ${password}</p>
            </div>
            
            <p style="${styles.p}">For security reasons, we recommend changing your password immediately after your first login.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/admin/login" style="${styles.button}">Login to Dashboard</a>
            </div>
          </div>
          <div style="${styles.footer}">
            <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Welcome):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Welcome):", error);
    return { success: false, error };
  }
}

// 2. User Lead Confirmation Email
export async function sendLeadConfirmationEmail({
  name,
  email,
  phone,
  destination,
  budget,
  guests,
}: LeadConfirmationProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "We've Received Your Travel Request! ✈️",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Budget Travel Packages</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${name},</h2>
            <p style="${styles.p}">Thank you for choosing us for your next adventure!</p>
            <p style="${styles.p}">We have successfully received your inquiry for a trip to <strong>${destination}</strong>. Our travel experts are already reviewing your preferences to craft the perfect itinerary for you.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong>Destination:</strong> ${destination}</p>
              <p style="${styles.dataItem}"><strong>Travelers:</strong> ${guests} Person(s)</p>
              <p style="${styles.dataItem}"><strong>Budget:</strong> ₹${budget}</p>
              <p style="${styles.dataItem}"><strong>Contact:</strong> ${phone}</p>
            </div>

            <p style="${styles.p}">You can expect to hear from us within 24 hours. In the meantime, feel free to browse our <a href="${process.env.NEXTAUTH_URL}/packages" style="color: #01ff70; text-decoration: none;">latest packages</a>.</p>
            
            <p style="${styles.p}">Warm regards,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
            <p>Questions? Contact us at support@budgettravel.com</p>
            <p>&copy; ${new Date().getFullYear()} Budget Travel Packages.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Confirmation):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Confirmation):", error);
    return { success: false, error };
  }
}

// 3. Admin New Lead Notification
export async function sendLeadNotificationEmail({
  name,
  email,
  phone,
  destination,
  budget,
  guests,
}: LeadNotificationProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `New Lead: ${name} - ${destination}`,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">New Lead Alert</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">A new inquiry has been submitted!</h2>
            <p style="${styles.p}">A potential customer is interested in a trip to <strong style="color: #01ff70;">${destination}</strong>.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong>Customer:</strong> ${name}</p>
              <p style="${styles.dataItem}"><strong>Email:</strong> <a href="mailto:${email}" style="color: #333;">${email}</a></p>
              <p style="${styles.dataItem}"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #333;">${phone}</a></p>
              <div style="border-top: 1px solid #e5e5e5; margin: 10px 0;"></div>
              <p style="${styles.dataItem}"><strong>Destination:</strong> ${destination}</p>
              <p style="${styles.dataItem}"><strong>Budget:</strong> ₹${budget}</p>
              <p style="${styles.dataItem}"><strong>Guests:</strong> ${guests}</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/admin/leads" style="${styles.button}">View Lead in Dashboard</a>
            </div>
          </div>
          <div style="${styles.footer}">
            <p>Budget Travel Admin Notification System</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Notification):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Notification):", error);
    return { success: false, error };
  }
}
