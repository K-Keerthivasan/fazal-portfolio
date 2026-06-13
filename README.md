# Fazal Architecture Portfolio

Premium one-page architecture and BIM specialist portfolio built with Next.js App Router, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Edit profile information

Update the visible name, title, email, phone, and location in these files:

- `components/Navbar.tsx`
- `components/About.tsx`
- `components/Contact.tsx`
- `components/Footer.tsx`

Search for comments that mention changing profile, contact, footer, or placeholder information.

## Replace images

The hero background is in `components/Hero.tsx`. Replace the Unsplash URL with a final architectural render or local image.

The profile photo placeholder is in `components/About.tsx`. Replace the placeholder block with `next/image` or a normal image element after adding the image to `public/`.

Project image placeholders are in `components/Projects.tsx`. Replace the numbered placeholder area inside each project card with real images, plan previews, PDF cover thumbnails, or links.

## Update project details

Project content lives in the `projects` array inside `components/Projects.tsx`.

Each project supports:

- `category`
- `title`
- `description`
- `button`
- `tags`

Update these values when final project names, links, and documentation are ready.

## Contact form

The contact form is implemented in:

- `components/Contact.tsx`
- `app/api/contact/route.ts`
- `lib/resend.ts`
- `lib/validateCaptcha.ts`

It validates all fields, validates email format, checks CAPTCHA server-side, sends through Resend, and never exposes the Resend API key to the browser.

## Set up Resend

1. Create a Resend account.
2. Add and verify a sending domain.
3. Create an API key.
4. Update the `from` address in `lib/resend.ts` from `onboarding@resend.dev` to a verified sender before production.
5. Add the API key to your environment variables as `RESEND_API_KEY`.

Messages are sent to `CONTACT_EMAIL`. The email subject is prefixed with `Portfolio Contact:` and includes the submitted form subject. The reply-to address is set to the sender email.

## Set up CAPTCHA

This project uses Cloudflare Turnstile-style CAPTCHA fields:

- `NEXT_PUBLIC_CAPTCHA_SITE_KEY`
- `CAPTCHA_SECRET_KEY`

Create a Turnstile widget in Cloudflare, then add the site key and secret key to your environment variables.

## Environment variables

Create `.env.local` for local development:

```bash
RESEND_API_KEY=
CONTACT_EMAIL=
CAPTCHA_SECRET_KEY=
NEXT_PUBLIC_CAPTCHA_SITE_KEY=
```

The same placeholder keys are also available in `.env.example`.

## Add environment variables in Vercel

1. Open the Vercel project dashboard.
2. Go to Settings > Environment Variables.
3. Add:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
   - `CAPTCHA_SECRET_KEY`
   - `NEXT_PUBLIC_CAPTCHA_SITE_KEY`
4. Redeploy after saving.

## Deploy

Push the repository to GitHub, import it into Vercel, add the environment variables, and deploy.

Build command:

```bash
npm run build
```

Output is handled automatically by Next.js on Vercel.
