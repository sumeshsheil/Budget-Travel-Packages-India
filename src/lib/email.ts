import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const BOOKINGS_EMAIL = `Budget Travel <${process.env.BOOKINGS_EMAIL || "bookings@budgettravelpackages.in"}>`;
const HELLO_EMAIL = `Budget Travel <${process.env.HELLO_EMAIL || "hello@budgettravelpackages.in"}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sm.sanny1235@gmail.com";

// --- Email Templates (Shared Styles) ---

const styles = {
  container: `
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08); /* More subtle, deeper shadow */
    border: 1px solid #eaeaea; /* Light border */
  `,
  header: `
    background-color: #000000; /* Black Header */
    padding: 30px;
    text-align: center;
    border-bottom: 3px solid #01ff70; /* Neon Green Accent */
  `,
  headerTitle: `
    color: #ffffff;
    margin: 0;
    font-size: 26px; /* Slightly larger */
    font-weight: 800;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  `,
  body: `
    padding: 40px 30px;
    color: #333333;
    line-height: 1.7; /* Increased line-height for readability */
  `,
  h2: `
    color: #111111;
    font-size: 22px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 24px; /* More spacing */
    letter-spacing: -0.3px;
  `,
  p: `
    margin-bottom: 18px; /* More spacing */
    font-size: 16px;
    color: #555555; /* Softer text color */
  `,
  dataBox: `
    background-color: #f9f9f9; /* Very light gray */
    border-radius: 8px;
    padding: 24px;
    margin: 30px 0;
    border-left: 4px solid #01ff70;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  `,
  dataItem: `
    margin: 10px 0;
    font-size: 15px;
    color: #444; /* Slightly darker than p */
    display: flex; /* Ideally, but reliable styles are inline-block or block */
  `,
  button: `
    display: inline-block;
    background-color: #01ff70;
    color: #000000;
    padding: 14px 28px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 700; /* Bold */
    font-size: 16px;
    margin-top: 24px;
    text-align: center;
    letter-spacing: 0.5px;
    transition: background-color 0.2s ease;
  `,
  footer: `
    background-color: #f5f5f5;
    padding: 24px 20px;
    text-align: center;
    border-top: 1px solid #eeeeee;
    font-size: 13px;
    color: #888888;
    line-height: 1.5;
  `,
  accentText: `
    color: #000;
    font-weight: 600;
  `,
};

// --- Interfaces ---

interface WelcomeEmailProps {
  name: string;
  email: string;
  password?: string; // Optional for user welcome email
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

// 1. Send General Welcome Email (From HELLO_EMAIL)
export async function sendWelcomeEmail({
  name,
  to,
  setPasswordUrl,
}: {
  name: string;
  to: string;
  setPasswordUrl?: string;
}) {
  try {
    const setPasswordBlock = setPasswordUrl
      ? `
        <div style="${styles.dataBox}">
          <p style="${styles.dataItem}"><strong>Your Dashboard Account</strong></p>
          <p style="${styles.p}">We've created a personal dashboard for you to track your booking, view updates, and manage payments. Set your password below to activate it:</p>
          <div style="text-align: center;">
            <a href="${setPasswordUrl}" style="${styles.button}">Set Your Password</a>
          </div>
          <p style="font-size: 13px; color: #888; margin-top: 16px; text-align: center;">This link expires in 72 hours.</p>
        </div>
      `
      : "";

    const { data, error } = await resend.emails.send({
      from: HELLO_EMAIL,
      to: [to],
      subject: "Welcome to Budget Travel Packages! 🌍",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Budget Travel Packages</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${name},</h2>
            <p style="${styles.p}">Thank you for choosing <strong>Budget Travel Packages</strong> as your travel partner!</p>
            <p style="${styles.p}">We’re thrilled to have you join our community of explorers. Whether you’re dreaming of misty mountains, sun-kissed beaches, or vibrant cityscapes, we’re here to turn those dreams into reality without breaking the bank.</p>
            
            ${setPasswordBlock}

            <p style="${styles.p}">Our team is already reviewing your request, and you’ll receive a detailed confirmation shortly.</p>

            <p style="${styles.p}">In the meantime, feel free to explore our <a href="${process.env.NEXTAUTH_URL}/travel-blogs" style="color: #000; font-weight: 700; text-decoration: underline;">Travel Blogs</a> for inspiration or browse our <a href="${process.env.NEXTAUTH_URL}/packages" style="color: #000; font-weight: 700; text-decoration: underline;">Exclusive Packages</a>.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}" style="${styles.button}">Explore Destinations</a>
            </div>

            <p style="${styles.p}">We look forward to creating unforgettable memories with you.</p>
            
            <p style="${styles.p}">Warm regards,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
            <p>Connect with us on <a href="#" style="color: #666; text-decoration: underline;">Instagram</a> and <a href="#" style="color: #666; text-decoration: underline;">Facebook</a>.</p>
            <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (User Welcome):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (User Welcome):", error);
    return { success: false, error };
  }
}

// 2. Agent Welcome Email (From ADMIN/BOOKINGS - typically system generated)
// Keeping as is functionally, but updating styles.
export async function sendAgentWelcomeEmail({
  name,
  email,
  password,
  to,
}: WelcomeEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL, // Or could be a dedicated admin email, but keeping it simple
      to: [to],
      subject: "Welcome to Budget Travel Admin Panel",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Admin Portal Access</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Welcome, ${name}!</h2>
            <p style="${styles.p}">You have been granted access to the Budget Travel Packages admin panel as an Agent.</p>
            <p style="${styles.p}">Please use the credentials below to log in securely:</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Email:</strong> ${email}</p>
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Password:</strong> ${password}</p>
            </div>
            
            <p style="${styles.p}">For security reasons, we recommend changing your password immediately after your first login.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/admin/login" style="${styles.button}">Login to Dashboard</a>
            </div>
          </div>
          <div style="${styles.footer}">
            <p>This is a system-generated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Agent Welcome):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Agent Welcome):", error);
    return { success: false, error };
  }
}

// 3. User Lead Confirmation Email (From BOOKINGS_EMAIL)
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
      from: BOOKINGS_EMAIL,
      to: [email],
      subject: `Booking Received: Trip to ${destination} ✈️`,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Booking Confirmation</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${name},</h2>
            <p style="${styles.p}">Great news! We have successfully received your booking inquiry for <strong>${destination}</strong>.</p>
            <p style="${styles.p}">Our travel experts are reviewing your details provided below and will craft a personalized itinerary that fits your budget perfectly.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Destination:</strong> ${destination}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Travelers:</strong> ${guests} Person(s)</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Budget:</strong> ₹${budget}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Contact:</strong> ${phone}</p>
            </div>

            <p style="${styles.p}"><strong>What happens next?</strong><br/>
            One of our agents will reach out to you within 24 hours via phone or email to discuss customized options.</p>

            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/packages" style="${styles.button}">View More Packages</a>
            </div>
          </div>
          <div style="${styles.footer}">
            <p>Need immediate assistance? Reply to this email or call us at +91-XXXXXXXXXX.</p>
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

// 4. Admin New Lead Notification (From BOOKINGS_EMAIL)
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
      from: BOOKINGS_EMAIL, // Send notification from system email
      to: [ADMIN_EMAIL],
      subject: `New Lead Alert: ${name} - ${destination} 🔔`,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">New Lead Received</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">A new inquiry has been submitted!</h2>
            <p style="${styles.p}">A potential customer is interested in a trip to <strong style="${styles.accentText}">${destination}</strong>. Please follow up promptly.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Customer:</strong> ${name}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Email:</strong> <a href="mailto:${email}" style="color: #333; text-decoration: underline;">${email}</a></p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Phone:</strong> <a href="tel:${phone}" style="color: #333; text-decoration: underline;">${phone}</a></p>
              <div style="border-top: 1px solid #e5e5e5; margin: 12px 0;"></div>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Destination:</strong> ${destination}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Budget:</strong> ₹${budget}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Guests:</strong> ${guests}</p>
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
