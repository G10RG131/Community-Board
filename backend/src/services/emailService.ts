// src/services/emailService.ts
import nodemailer from "nodemailer";
import { config } from "../config";

let transporter: nodemailer.Transporter;

// If an SMTP URL is provided, use it; otherwise fall back to a dev-only console transport
if (config.smtpUrl) {
  transporter = nodemailer.createTransport(config.smtpUrl);
} else {
  console.warn(
    "SMTP_URL not set—emails will be printed to console instead of sent"
  );
  transporter = nodemailer.createTransport({
    // the built-in “stream” transport simply emits the message instead of sending
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });
}

export interface EmailOptions {
  to:      string;
  subject: string;
  text:    string;
}

export async function sendEmail(opts: EmailOptions) {
  const msg = {
    from:    config.smtpFrom || "no-reply@example.com",
    to:      opts.to,
    subject: opts.subject,
    text:    opts.text,
  };

  const info = await transporter.sendMail(msg);

  // In console-transport mode, `info.message` is the full RFC-822 email
  if (!config.smtpUrl) {
    console.log("🔔 [emailService] would send email:\n" + info.message);
  }

  return info;
}
