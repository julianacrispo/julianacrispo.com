import { useEffect, useRef, useState } from "react";

// Adds the email to Kit (ConvertKit) and fires the double opt-in confirmation.
// See src/pages/api/subscribe.ts.
const SUBSCRIBE_ENDPOINT = "/api/subscribe";

// Interactive bitmap portrait: six stills in /public/portrait. The browser
// picks which one to show based on where the pointer is relative to the
// portrait; click/tap/Enter shows the wink briefly.
type Pose = "front" | "left" | "right" | "up" | "down";
const POSES: Pose[] = ["front", "left", "right", "up", "down"];
const WINK_MS = 900;
// Pointer within this fraction of the portrait's width from its centre keeps
// the portrait looking forward instead of twitching between directions.
const NEUTRAL_RADIUS = 0.28;
// The other axis has to beat the current one by this much before we switch,
// so diagonals don't flicker.
const AXIS_BIAS = 1.25;
// Short settle delay before committing a new direction.
const SETTLE_MS = 70;

/**
 * @ployComponent
 * @ployComponentId NewsletterPage
 * @ployComponentName 3 Minute Friday Signup
 * @ployComponentType page
 * @ployComponentPattern landing
 * @ployComponentStatus stable
 * @ployComponentDescription Root homepage for julianacrispo.com. A chill two-column
 * newsletter capture for "3 Minute Friday": interactive bitmap portrait on the left
 * (follows the cursor, winks on click), copy + Kit subscribe form on the right.
 * Wired to /api/subscribe with double opt-in.
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
  .n3 .wrap{width:100%;max-width:1180px;margin:0 auto;padding:0 clamp(20px,5vw,56px);}
  .n3 .arrow{display:inline-block;transition:transform .22s ease;}
  .n3 button:hover .arrow{transform:translateX(4px);}

  .n3 .main{flex:1;display:flex;align-items:center;padding:clamp(32px,6vh,72px) 0;}
  .n3 .grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(36px,6vw,72px);align-items:center;width:100%;}
  .n3 .copy{max-width:34rem;}
  .n3 .photo{display:flex;justify-content:center;}
  .n3 .portrait{position:relative;width:100%;max-width:min(100%,calc(78vh * 3 / 4));aspect-ratio:3/4;
    cursor:pointer;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;
    outline:none;border-radius:16px;}
  .n3 .portrait:focus-visible{outline:2px solid var(--spruce);outline-offset:6px;}
  .n3 .portrait img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;
    mix-blend-mode:multiply;opacity:0;pointer-events:none;image-rendering:auto;}
  .n3 .portrait img.on{opacity:1;}
  @media(max-width:820px){
    .n3 .grid{grid-template-columns:1fr;gap:28px;}
    .n3 .copy{max-width:none;}
    .n3 .portrait{max-width:min(100%,calc(52vh * 3 / 4));}
  }

  .n3 .brand{font-family:var(--mono);font-size:.82rem;letter-spacing:.16em;text-transform:uppercase;
    color:var(--spruce);display:flex;align-items:center;gap:10px;margin:0 0 22px;}
  .n3 .brand::before{content:"";width:22px;height:1px;background:var(--spruce);display:inline-block;flex:none;}

  .n3 .loved{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:0 0 22px;}
  .n3 .loved-row{display:flex;align-items:center;gap:12px;}
  .n3 .faces{display:flex;}
  .n3 .faces img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid var(--paper);
    margin-left:-10px;background:#ddd;}
  .n3 .faces img:first-child{margin-left:0;}
  .n3 .stars{display:flex;gap:1px;}
  .n3 .stars svg{width:18px;height:18px;display:block;}
  .n3 .loved-copy{font-size:.86rem;color:var(--muted);margin:0;}

  .n3 h1{font-family:var(--display);font-weight:600;letter-spacing:-.03em;line-height:1.02;margin:0;
    font-size:clamp(2.4rem,6vw,4.1rem);}
  .n3 .sub{font-size:clamp(1.08rem,2vw,1.28rem);color:#33322B;margin:22px 0 0;max-width:36ch;line-height:1.55;}

  .n3 .form{display:flex;flex-direction:column;align-items:stretch;gap:12px;margin-top:32px;max-width:380px;}
  .n3 .form input[type="email"]{width:100%;font-family:var(--body);font-size:1rem;padding:15px 16px;
    background:#FAF9F5;border:1px solid var(--line);border-radius:10px;color:var(--ink);}
  .n3 .form input::placeholder{color:var(--faint);}
  .n3 .form input:focus{outline:2px solid var(--spruce);outline-offset:1px;border-color:transparent;}
  .n3 .form button{font-family:var(--body);font-weight:500;font-size:1rem;padding:15px 22px;border:0;border-radius:10px;
    background:var(--ink);color:var(--paper);cursor:pointer;transition:opacity .18s;}
  .n3 .form button:hover{background:var(--ink);opacity:.86;}
  .n3 .form button:disabled{opacity:.6;cursor:default;}
  .n3 .form input:disabled{opacity:.6;}
  .n3 .form .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;}

  .n3 .err{font-family:var(--mono);font-size:.78rem;color:#A6402F;margin-top:14px;}
  .n3 .micro{font-family:var(--mono);font-size:.74rem;color:var(--muted);margin-top:16px;}
  .n3 .ok{display:flex;align-items:flex-start;gap:12px;margin-top:32px;max-width:420px;
    background:rgba(22,70,58,.08);border:1px solid rgba(22,70,58,.3);border-radius:12px;
    padding:18px 20px;font-family:var(--body);font-size:1.05rem;font-weight:500;line-height:1.45;color:var(--spruce);}
  .n3 .ok::before{content:"\\2713";flex:none;width:24px;height:24px;border-radius:50%;
    background:var(--spruce);color:var(--paper);display:flex;align-items:center;justify-content:center;
    font-size:.85rem;font-weight:700;line-height:1;margin-top:1px;}
`;

function InteractivePortrait() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState<Pose>("front");
  const [winking, setWinking] = useState(false);
  const poseRef = useRef<Pose>("front");
  const pendingRef = useRef<Pose | null>(null);
  const settleTimer = useRef<number | null>(null);
  const winkTimer = useRef<number | null>(null);
  const lastEval = useRef(0);

  // Commit a direction after a short settle so quick sweeps don't flicker.
  const requestPose = (next: Pose) => {
    if (next === poseRef.current) {
      pendingRef.current = null;
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      settleTimer.current = null;
      return;
    }
    if (pendingRef.current === next) return;
    pendingRef.current = next;
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      if (pendingRef.current) {
        poseRef.current = pendingRef.current;
        setPose(pendingRef.current);
        pendingRef.current = null;
      }
    }, SETTLE_MS);
  };

  const evaluate = (px: number, py: number) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    // Eyes sit in the upper third of the frame, so track from there.
    const cy = r.top + r.height * 0.3;
    const dx = px - cx;
    const dy = py - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < r.width * NEUTRAL_RADIUS) {
      requestPose("front");
      return;
    }
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    const cur = poseRef.current;
    const curIsX = cur === "left" || cur === "right";
    const curIsY = cur === "up" || cur === "down";
    let horizontal: boolean;
    if (curIsX) horizontal = ay < ax * AXIS_BIAS;
    else if (curIsY) horizontal = ax > ay * AXIS_BIAS;
    else horizontal = ax >= ay;
    const next: Pose = horizontal
      ? dx < 0
        ? "left"
        : "right"
      : dy < 0
        ? "up"
        : "down";
    requestPose(next);
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      // Cheap throttle (~60fps) without depending on requestAnimationFrame.
      const now = performance.now();
      if (now - lastEval.current < 16) return;
      lastEval.current = now;
      evaluate(e.clientX, e.clientY);
    };
    const onLeave = () => requestPose("front");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      if (winkTimer.current) window.clearTimeout(winkTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wink = () => {
    setWinking(true);
    if (winkTimer.current) window.clearTimeout(winkTimer.current);
    winkTimer.current = window.setTimeout(() => setWinking(false), WINK_MS);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      wink();
    }
  };

  const shown = winking ? "wink" : pose;

  return (
    <div
      ref={boxRef}
      className="portrait"
      role="button"
      tabIndex={0}
      aria-label="Bitmap portrait of Juliana Crispo. It follows your cursor; click to make her wink."
      onClick={wink}
      onKeyDown={onKeyDown}
    >
      {[...POSES, "wink" as const].map((name) => (
        <img
          key={name}
          src={`/portrait/${name}.png`}
          alt={name === "front" ? "Juliana Crispo" : ""}
          width={864}
          height={1152}
          loading="eager"
          decoding="async"
          draggable={false}
          className={shown === name ? "on" : undefined}
          aria-hidden={name !== "front"}
        />
      ))}
    </div>
  );
}

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
          <div className="photo">
            <InteractivePortrait />
          </div>

          <div className="copy">
            <div className="loved">
              <div className="loved-row">
                <div className="faces">
                  <img src="/loved/face-1.jpg" alt="" />
                  <img src="/loved/face-2.jpg" alt="" />
                  <img src="/loved/face-3.jpg" alt="" />
                  <img src="/loved/face-4.jpg" alt="" />
                </div>
                <div className="stars" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" fill="#F5C542" aria-hidden="true">
                      <path d="M10 1.6l2.35 4.76 5.25.76-3.8 3.7.9 5.23L10 13.58 5.3 16.05l.9-5.23-3.8-3.7 5.25-.76L10 1.6z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="loved-copy">Loved by 1,200+ amazing ladies</p>
            </div>
            <h1>3 Minute Friday</h1>
            <p className="sub">
              Every Friday I breakdown 3 things in under 3 minutes that I&apos;m
              loving/reading/doing this week and why you&apos;ll love them too.
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
        </div>
      </main>
    </div>
  );
}
