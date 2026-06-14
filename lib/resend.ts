import { Resend } from "resend";

type SendContactEmailInput = {
  to: string;
  name: string;
  email: string;
  subject: string;
  message: string;
};

// The Resend API key is read server-side only and is never exposed to the client.
// Keep onboarding@resend.dev for limited testing, or set RESEND_FROM_EMAIL to a verified sender.
const DEFAULT_FROM_ADDRESS = "Abul Fazal Portfolio <onboarding@resend.dev>";

export async function sendContactEmail({
  to,
  name,
  email,
  subject,
  message,
}: SendContactEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_ADDRESS;

  if (!apiKey) {
    throw new Error("Resend is not configured.");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Portfolio Contact: ${subject}`,
    text: [
      `Sender name: ${name}`,
      `Sender email: ${email}`,
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
        <h2>New portfolio contact message</h2>
        <p><strong>Sender name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Sender email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Resend rejected the email request.");
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
