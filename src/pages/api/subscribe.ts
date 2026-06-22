import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";

// Keep this SSR (no prerender): it reads secrets and calls Kit at request time.
export const prerender = false;

// Kit (ConvertKit) v3 legacy API. The v3 subscribe call both upserts the
// subscriber and adds them to the form (firing the double opt-in welcome
// email when the form has it enabled), so it's a single request.
const KIT_BASE = "https://api.convertkit.com/v3";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Adapter-agnostic secret lookup. `astro:env/server` reads `.dev.vars` in dev
// and the Cloudflare/Vercel runtime env in prod; `process.env` is a Node
// fallback. (Astro v6 removed `Astro.locals.runtime.env`.)
function readEnv(key: string): string | undefined {
  const fromAstro = getSecret(key);
  if (fromAstro) return fromAstro;
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  return undefined;
}

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function notifySlack(webhookUrl: string, email: string): Promise<void> {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `New "Get on the list" signup: ${email}`,
    }),
  });
}

async function readBody(
  request: Request,
): Promise<{ email: string; website: string }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    return {
      email: String(body.email ?? "").trim(),
      website: String(body.website ?? "").trim(),
    };
  }
  const form = await request.formData();
  return {
    email: String(form.get("email") ?? "").trim(),
    website: String(form.get("website") ?? "").trim(),
  };
}

export const POST: APIRoute = async ({ request }) => {
  let email = "";
  let website = "";
  try {
    ({ email, website } = await readBody(request));
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: bots fill hidden fields. Pretend success without doing anything.
  if (website) return json({ ok: true }, 200);

  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: "Enter a valid email address." }, 422);
  }

  const apiKey = readEnv("KIT_API_KEY");
  const formId = readEnv("KIT_FORM_ID");
  if (!apiKey || !formId) {
    console.error("Missing KIT_API_KEY and/or KIT_FORM_ID env vars");
    return json({ ok: false, error: "Signups aren't configured yet." }, 500);
  }

  try {
    // v3: subscribe to the form. The api_key goes in the body, not a header.
    const formRes = await fetch(`${KIT_BASE}/forms/${formId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ api_key: apiKey, email }),
    });
    if (!formRes.ok) {
      console.error(
        "Kit subscribe failed",
        formRes.status,
        await formRes.text().catch(() => "<no body>"),
      );
      return json({ ok: false, error: "Something went wrong. Try again." }, 502);
    }

    // Optional: ping Slack. Never let a Slack hiccup fail the signup.
    const slackWebhook = readEnv("SLACK_WEBHOOK_URL");
    if (slackWebhook) {
      await notifySlack(slackWebhook, email).catch((err) =>
        console.error("Slack notify failed", err),
      );
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error("Kit subscribe error", err);
    return json({ ok: false, error: "Something went wrong. Try again." }, 502);
  }
};
