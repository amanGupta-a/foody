import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Get and normalize environment variables
const smtpUser = (process.env.EMAIL || "")
  .trim()
  .replace(/^['"]|['"]$/g, "");

const smtpPass = (process.env.PASS || "")
  .trim()
  .replace(/^['"]|['"]$/g, "");

// Temporary debugging — remove after deployment is confirmed
console.log("EMAIL PRESENT:", !!process.env.EMAIL);
console.log("PASS PRESENT:", !!process.env.PASS);
console.log("EMAIL:", smtpUser);

// Create Gmail transporter
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Verify Gmail SMTP connection
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Mail transporter is ready");
  } catch (err) {
    console.error("Mail transporter error:", err);
  }
};

verifyTransporter();

// Send password-reset OTP
export const sendOtpMail = async (to, otp) => {
  try {
    if (!to) {
      throw new Error("No recipient email provided");
    }

    await transporter.sendMail({
      from: smtpUser,
      to,
      subject: "Your OTP for Password Reset",
      html: `
        <p>Your OTP for password reset is:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    console.log(`Password reset OTP sent to ${to}`);
  } catch (err) {
    console.error("SEND OTP MAIL ERROR 👉", err);
    throw err;
  }
};

// Send delivery OTP
export const sendDeliveryOtpMail = async (to, otp) => {
  try {
    const recipient =
      typeof to === "string"
        ? to
        : to?.email;

    if (!recipient) {
      throw new Error("No recipient email provided");
    }

    await transporter.sendMail({
      from: smtpUser,
      to: recipient,
      subject: "Your Delivery OTP",
      html: `
        <p>Your delivery OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    console.log(`Delivery OTP sent to ${recipient}`);
  } catch (err) {
    console.error("SEND DELIVERY OTP MAIL ERROR 👉", err);
    throw err;
  }
};