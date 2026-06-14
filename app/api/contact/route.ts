import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/resend";
import { validateCaptcha } from "@/lib/validateCaptcha";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  "h-captcha-response"?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const name = normalize(payload.name);
    const email = normalize(payload.email);
    const subject = normalize(payload.subject);
    const message = normalize(payload.message);
    const captchaToken = normalize(payload["h-captcha-response"]);

    const validationError = validateFields({ name, email, subject, message });
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const captcha = await validateCaptcha(
      captchaToken,
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    );

    if (!captcha.success) {
      return NextResponse.json({ message: captcha.message }, { status: 400 });
    }

    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail || !emailPattern.test(contactEmail)) {
      return NextResponse.json({ message: "Contact email is not configured." }, { status: 500 });
    }

    await sendContactEmail({
      to: contactEmail,
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({ message: "Thank you. Your message has been sent." });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: getContactErrorMessage(error) },
      { status: 500 },
    );
  }
}

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateFields(fields: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!fields.name || !fields.email || !fields.subject || !fields.message) {
    return "Please complete all required fields.";
  }

  if (fields.name.length < 2 || fields.name.length > 80) {
    return "Name must be between 2 and 80 characters.";
  }

  if (!emailPattern.test(fields.email) || fields.email.length > 120) {
    return "Please enter a valid email address.";
  }

  if (fields.subject.length < 3 || fields.subject.length > 140) {
    return "Subject must be between 3 and 140 characters.";
  }

  if (fields.message.length < 10 || fields.message.length > 4000) {
    return "Message must be between 10 and 4000 characters.";
  }

  return null;
}

function getContactErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const normalized = message.toLowerCase();

  if (normalized.includes("resend is not configured")) {
    return "Email sending is not configured. Add RESEND_API_KEY in your environment variables.";
  }

  if (
    normalized.includes("own email address") ||
    normalized.includes("testing emails") ||
    normalized.includes("verify a domain") ||
    normalized.includes("domain")
  ) {
    return "Resend is in test/domain-restricted mode. Set CONTACT_EMAIL to the email verified on your Resend account, or verify a sending domain and set RESEND_FROM_EMAIL.";
  }

  if (process.env.NODE_ENV !== "production" && message) {
    return `Email service error: ${message}`;
  }

  return "Unable to send your message right now. Please try again later.";
}
