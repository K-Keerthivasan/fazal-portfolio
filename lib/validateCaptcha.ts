type CaptchaResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function validateCaptcha(token: string, remoteIp?: string | null) {
  const secret = process.env.HCAPTCHA_SECRET_KEY;

  if (!secret) {
    return {
      success: false,
      message: "CAPTCHA is not configured.",
    };
  }

  if (!token) {
    return {
      success: false,
      message: "Please complete the CAPTCHA challenge.",
    };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    return {
      success: false,
      message: "CAPTCHA verification is temporarily unavailable.",
    };
  }

  const data = (await response.json()) as CaptchaResponse;

  return {
    success: data.success,
    message: data.success ? "CAPTCHA verified." : "CAPTCHA verification failed.",
  };
}
