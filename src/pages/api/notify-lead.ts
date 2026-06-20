import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

// SSR (must stay non-prerendered) — reads a runtime Secret binding.
export const prerender = false;

const WEBHOOK_URL = "https://ploy.ai/api/v1/webhook/58pmeaqrkvkw2rhh";

/**
 * Forwards a strategy-call form submission to the Ploy lead webhook, which
 * triggers the "Strategy Call Lead → Slack #leads" ploybook. The webhook key is
 * held server-side as a Secret so it never ships to the browser. Fails soft:
 * the form's own submitForm() still persists the lead in Ploy regardless.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const key = (env as Record<string, string | undefined>).LEAD_WEBHOOK_KEY;
    if (!key) {
      return new Response(JSON.stringify({ ok: false, reason: "no-key" }), {
        status: 200,
      });
    }

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        name: String(body.name ?? ""),
        email: String(body.email ?? ""),
        company: String(body.company ?? ""),
        goal: String(body.goal ?? ""),
      }),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 200 });
  }
};
