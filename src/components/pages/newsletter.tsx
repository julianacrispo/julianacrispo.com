import { useState } from "react";

// Same server route the /building (editorial) page uses: adds the email to Kit
// (ConvertKit) and fires the double opt-in confirmation. See src/pages/api/subscribe.ts.
const SUBSCRIBE_ENDPOINT = "/api/subscribe";

/**
 * @ployComponent
 * @ployComponentId NewsletterPage
 * @ployComponentName 3-Bullet Thursday Signup
 * @ployComponentType page
 * @ployComponentPattern landing
 * @ployComponentStatus stable
 * @ployComponentDescription Root homepage for julianacrispo.com. A single-screen
 * newsletter capture page for the "3-Bullet Thursday" email, modeled on Tim Ferriss's
 * 5-Bullet Friday. Uses the same editorial paper-and-ink design language as the
 * /building page: warm paper (#F4F3EE) + ink (#181711) with a spruce-green accent
 * (#16463A). Typography: Bricolage Grotesque (display), Hanken Grotesk (body), IBM
 * Plex Mono (eyebrow/label). Two-column layout (copy + form on the left, portrait on
 * the right) that stacks on mobile. The one CTA is the email subscribe form, wired to
 * the shared /api/subscribe (Kit) list with double opt-in. Self-contained inline
 * <style>; no Tailwind/ploy tokens so it renders exactly as authored. The Fractional
 * CRO site lives at /fractional and the editorial narrative home lives at /building.
 */

const STYLES = `
  .n3{
    --paper:#F4F3EE;--ink:#181711;--muted:#6E6C61;--faint:#9A988C;
    --line:rgba(24,23,17,0.12);
    --spruce:#16463A;--spruce-press:#0E3027;
    --display:"Bricolage Grotesque",system-ui,sans-serif;
    --body:"Hanken Grotesk",system-ui,sans-serif;
    --mono:"IBM Plex Mono",ui-monospace,monospace;
    min-height:100dvh;display:flex;flex-direction:column;
    background:var(--paper);color:var(--ink);font-family:var(--body);
    font-size:17px;line-height:1.7;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  }
  .n3 *{box-sizing:border-box;}
  .n3 a{color:inherit;text-decoration:none;}
  .n3 .wrap{width:100%;max-width:1120px;margin:0 auto;padding:0 clamp(20px,6vw,56px);}
  .n3 .arrow{display:inline-block;transition:transform .22s ease;}
  .n3 button:hover .arrow{transform:translateX(4px);}

  .n3 .main{flex:1;display:flex;align-items:stretch;padding:clamp(40px,6vh,72px) 0 0;}
  .n3 .grid{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(32px,6vw,64px);align-items:end;width:100%;}
  .n3 .copy{max-width:38rem;align-self:center;padding-bottom:clamp(40px,6vh,72px);}
  .n3 .photo{align-self:end;justify-self:center;}
  .n3 .photo img{display:block;width:100%;max-width:460px;height:auto;
    filter:drop-shadow(0 24px 40px rgba(24,23,17,.16));}
  @media(max-width:820px){
    .n3 .grid{grid-template-columns:1fr;gap:clamp(20px,5vw,32px);align-items:center;}
    .n3 .copy{order:1;padding-bottom:0;text-align:left;}
    .n3 .photo{order:-1;}
    .n3 .photo img{max-width:300px;}
  }

  .n3 .brand{font-family:var(--mono);font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;
    color:var(--spruce);display:flex;align-items:center;gap:10px;margin:0 0 30px;}
  .n3 .brand::before{content:"";width:22px;height:1px;background:var(--spruce);display:inline-block;flex:none;}

  .n3 h1{font-family:var(--display);font-weight:600;letter-spacing:-.025em;line-height:1.06;margin:0;
    font-size:clamp(2rem,5.4vw,3.15rem);max-width:16ch;}
  .n3 .sub{font-size:clamp(1.05rem,2.1vw,1.22rem);color:#33322B;margin:22px 0 0;max-width:48ch;}

  .n3 .form{display:flex;gap:12px;margin-top:34px;flex-wrap:wrap;}
  .n3 .form input{flex:1;min-width:220px;font-family:var(--body);font-size:1rem;padding:14px 16px;
    background:#FAF9F5;border:1px solid var(--line);border-radius:4px;color:var(--ink);}
  .n3 .form input::placeholder{color:var(--faint);}
  .n3 .form input:focus{outline:2px solid var(--spruce);outline-offset:1px;border-color:transparent;}
  .n3 .form button{font-family:var(--body);font-weight:500;font-size:1rem;padding:14px 26px;border:0;border-radius:4px;
    background:var(--spruce);color:var(--paper);cursor:pointer;transition:background .18s;}
  .n3 .form button:hover{background:var(--spruce-press);}
  .n3 .form button:disabled{opacity:.6;cursor:default;}
  .n3 .form input:disabled{opacity:.6;}
  .n3 .form .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;}

  .n3 .err{font-family:var(--mono);font-size:.78rem;color:#A6402F;margin-top:14px;}
  .n3 .micro{font-family:var(--mono);font-size:.74rem;color:var(--muted);margin-top:16px;}
  .n3 .ok{display:flex;align-items:flex-start;gap:12px;margin-top:34px;max-width:460px;
    background:rgba(22,70,58,.08);border:1px solid rgba(22,70,58,.3);border-radius:8px;
    padding:18px 20px;font-family:var(--body);font-size:1.05rem;font-weight:500;line-height:1.45;color:var(--spruce);}
  .n3 .ok::before{content:"\\2713";flex:none;width:24px;height:24px;border-radius:50%;
    background:var(--spruce);color:var(--paper);display:flex;align-items:center;justify-content:center;
    font-size:.85rem;font-weight:700;line-height:1;margin-top:1px;}

  .n3 .foot{padding:30px 0 40px;border-top:1px solid var(--line);}
  .n3 .foot .row{display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between;}
  .n3 .foot .social{display:flex;gap:22px;font-family:var(--mono);font-size:.82rem;}
  .n3 .foot .social a{color:var(--muted);}
  .n3 .foot .social a:hover{color:var(--ink);}
  .n3 .foot .cr{font-family:var(--mono);font-size:.74rem;color:var(--faint);}
`;

export function NewsletterPage() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!email || email.indexOf("@") < 1) {
      setStatus("error");
      setErrorMsg("Enter a valid email address.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          website: String(data.get("website") ?? ""),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !body.ok) {
        setStatus("error");
        setErrorMsg(body.error || "Something went wrong. Try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again.");
    }
  };

  return (
    <div className="n3" id="top">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <main className="main">
        <div className="wrap grid">
          <div className="copy">
            <p className="brand">3-Bullet Thursday</p>
            <h1>
              Get the 3 Things I&apos;ve Been Loving, Using, Reading and More.
            </h1>
            <p className="sub">
              Every Thursday, I send out an exclusive email with the 3 coolest
              things I&apos;ve found (or explored) that week.
            </p>

            {status !== "success" ? (
              <>
                <form className="form" onSubmit={handleSubmit} noValidate>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email address"
                    aria-label="Email address"
                    autoComplete="email"
                    disabled={status === "submitting"}
                    required
                  />
                  <input
                    type="text"
                    name="website"
                    className="hp"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <button type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? (
                      "Subscribing…"
                    ) : (
                      <>
                        Subscribe <span className="arrow">→</span>
                      </>
                    )}
                  </button>
                </form>
                {status === "error" && (
                  <p className="err" role="alert">
                    {errorMsg}
                  </p>
                )}
                <p className="micro">No noise. Unsubscribe anytime.</p>
              </>
            ) : (
              <p className="ok">
                Check your inbox to confirm your subscription.
              </p>
            )}
          </div>

          <div className="photo">
            <img
              src="/juliana-cutout.png"
              alt="Juliana Crispo"
              width={625}
              height={977}
              loading="eager"
            />
          </div>
        </div>
      </main>

      <footer className="foot">
        <div className="wrap row">
          <div className="social">
            <a href="https://www.linkedin.com/in/julianacrispo/">LinkedIn</a>
            <a href="https://youtube.com/@heyitsjuliana">YouTube</a>
            <a href="https://www.instagram.com/juliana.crispo/">Instagram</a>
          </div>
          <div className="cr">© Juliana Crispo</div>
        </div>
      </footer>
    </div>
  );
}
