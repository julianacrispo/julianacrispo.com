import { useEffect, useRef, useState } from "react";

// Server route that adds the email to Kit (ConvertKit) and triggers the
// double opt-in welcome email. The API key stays server-side; see
// src/pages/api/subscribe.ts and the KIT_API_KEY / KIT_FORM_ID env vars.
const SUBSCRIBE_ENDPOINT = "/api/subscribe";

/**
 * @ployComponent
 * @ployComponentId HomePage
 * @ployComponentName Juliana Crispo Home
 * @ployComponentType page
 * @ployComponentPattern landing
 * @ployComponentStatus stable
 * @ployComponentDescription Personal homepage for Juliana Crispo. Editorial,
 * paper-and-ink resume-as-narrative: fifteen years in sales told across four acts
 * (the seller, the operator, the founder, what's next) leading to a "get on the list"
 * waitlist for software she's building for people who sell. DISCIPLINED PALETTE: warm
 * paper (#F4F3EE) + ink (#181711) neutrals with a single spruce-green accent (#16463A),
 * mint highlights (#3FBF92 / #7FB7A6) reserved for the dark CTA section. Typography:
 * Bricolage Grotesque (display), Hanken Grotesk (body), IBM Plex Mono (eyebrows/labels).
 * Signature devices: mono eyebrows with a leading rule, a 4-up stat band bordered top and
 * bottom in ink, scroll-reveal fades, and a dark final CTA with a waitlist form (wired to
 * Formspree). Self-contained inline <style> block; no Tailwind/ploy tokens used here so the
 * editorial design renders exactly as authored. The GTM/Fractional CRO site lives at /gtm.
 */

const STYLES = `
  .jc{
    --paper:#F4F3EE;--card:#FAF9F5;--ink:#181711;--muted:#6E6C61;--faint:#9A988C;
    --line:rgba(24,23,17,0.12);--line-strong:rgba(24,23,17,0.22);
    --spruce:#16463A;--spruce-press:#0E3027;
    --display:"Bricolage Grotesque",system-ui,sans-serif;
    --body:"Hanken Grotesk",system-ui,sans-serif;
    --mono:"IBM Plex Mono",ui-monospace,monospace;
    --maxw:1080px;--textw:720px;
    background:var(--paper);color:var(--ink);font-family:var(--body);
    font-size:17px;line-height:1.7;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  }
  .jc *{box-sizing:border-box;}
  .jc a{color:inherit;text-decoration:none;}
  .jc .wrap{max-width:var(--maxw);margin:0 auto;padding:0 clamp(20px,5vw,56px);}
  .jc .col{max-width:var(--textw);}
  .jc .arrow{display:inline-block;transition:transform .22s ease;}
  .jc a:hover .arrow,.jc button:hover .arrow{transform:translateX(4px);}
  .jc h1,.jc h2,.jc h3{font-family:var(--display);font-weight:600;margin:0;letter-spacing:-.02em;line-height:1.05;}

  .jc .eyebrow{font-family:var(--mono);font-size:.78rem;letter-spacing:.04em;color:var(--spruce);
    margin:0 0 18px;display:flex;align-items:center;gap:10px;}
  .jc .eyebrow::before{content:"";width:18px;height:1px;background:var(--spruce);display:inline-block;flex:none;}

  .jc-header{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--paper) 88%,transparent);
    backdrop-filter:blur(8px);border-bottom:1px solid var(--line);}
  .jc .bar{display:flex;align-items:center;justify-content:space-between;height:64px;}
  .jc .logo{font-family:var(--display);font-weight:700;font-size:1.06rem;letter-spacing:-.01em;}
  .jc .navcta{font-family:var(--mono);font-size:.82rem;color:var(--spruce);}
  .jc .navcta:hover{color:var(--spruce-press);}

  .jc .hero{padding:clamp(64px,12vw,124px) 0 clamp(40px,6vw,64px);}
  .jc .hero h1{font-size:clamp(3rem,9vw,6rem);letter-spacing:-.03em;}
  .jc .hero .sub{font-size:clamp(1.08rem,2.1vw,1.3rem);color:#33322B;max-width:54ch;margin:30px 0 0;}
  .jc .hero .sub b{font-weight:500;color:var(--ink);}
  .jc .cta{display:inline-block;font-family:var(--body);font-weight:500;font-size:1rem;
    padding:14px 24px;border-radius:4px;background:var(--spruce);color:var(--paper);margin-top:38px;
    transition:background .18s;}
  .jc .cta:hover{background:var(--spruce-press);}

  .jc .band{border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);}
  .jc .band .grid{display:grid;grid-template-columns:repeat(4,1fr);}
  .jc .cell{padding:28px clamp(8px,1.6vw,22px);border-left:1px solid var(--line);}
  .jc .cell:first-child{border-left:0;}
  .jc .cell .n{font-family:var(--display);font-weight:600;font-size:clamp(1.5rem,3.4vw,2.1rem);letter-spacing:-.02em;line-height:1;}
  .jc .cell .l{font-family:var(--mono);font-size:.71rem;color:var(--muted);margin-top:12px;line-height:1.5;}
  @media(max-width:720px){.jc .band .grid{grid-template-columns:repeat(2,1fr);}
    .jc .cell:nth-child(odd){border-left:0;}.jc .cell{border-top:1px solid var(--line);}
    .jc .cell:nth-child(1),.jc .cell:nth-child(2){border-top:0;}}

  .jc section.mv{padding:clamp(60px,9vw,108px) 0;border-bottom:1px solid var(--line);}
  .jc .mv h2{font-size:clamp(2rem,5vw,3.2rem);}
  .jc .mv .lede{font-size:1.16rem;color:var(--ink);margin:22px 0 0;max-width:62ch;}
  .jc .mv p{color:#33322B;margin:18px 0 0;max-width:62ch;}

  .jc .figs{display:flex;flex-wrap:wrap;gap:clamp(20px,5vw,56px);margin-top:40px;}
  .jc .fig .n{font-family:var(--display);font-weight:600;font-size:clamp(1.7rem,4vw,2.6rem);letter-spacing:-.02em;line-height:1;}
  .jc .fig .l{font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:10px;max-width:18ch;}

  .jc .logos{font-family:var(--mono);font-size:.76rem;color:var(--faint);margin-top:34px;letter-spacing:.01em;}

  .jc .results{margin-top:40px;border-top:1px solid var(--line);max-width:640px;}
  .jc .row{display:grid;grid-template-columns:1.1fr 1.4fr auto;gap:16px;align-items:baseline;
    padding:16px 0;border-bottom:1px solid var(--line);}
  .jc .row .co{font-family:var(--display);font-weight:600;font-size:1.05rem;}
  .jc .row .me{font-family:var(--mono);font-size:.92rem;color:var(--spruce);}
  .jc .row .ti{font-family:var(--mono);font-size:.74rem;color:var(--muted);text-align:right;}
  @media(max-width:560px){.jc .row{grid-template-columns:1fr;gap:4px;}.jc .row .ti{text-align:left;}}

  .jc .thread{padding:clamp(60px,9vw,104px) 0;border-bottom:1px solid var(--line);}
  .jc .thread p{font-family:var(--display);font-weight:500;font-size:clamp(1.5rem,3.6vw,2.3rem);
    letter-spacing:-.02em;line-height:1.25;max-width:20ch;margin:0;}
  .jc .thread .t2{font-family:var(--body);font-weight:400;font-size:1.12rem;color:var(--muted);
    margin-top:24px;max-width:50ch;letter-spacing:0;line-height:1.7;}

  .jc .next{background:var(--ink);color:var(--paper);}
  .jc .next .inner{padding:clamp(64px,10vw,120px) 0;}
  .jc .next .eyebrow{color:#7FB7A6;}.jc .next .eyebrow::before{background:#7FB7A6;}
  .jc .next h2{color:var(--paper);font-size:clamp(2rem,5vw,3rem);max-width:18ch;}
  .jc .next p{color:#C9C7BD;margin:22px 0 0;max-width:52ch;}
  .jc .form{display:flex;gap:12px;margin-top:36px;max-width:460px;flex-wrap:wrap;}
  .jc .form input{flex:1;min-width:210px;font-family:var(--body);font-size:1rem;padding:14px 16px;
    background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.2);border-radius:4px;color:var(--paper);}
  .jc .form input::placeholder{color:#8C8A80;}
  .jc .form input:focus{outline:2px solid #3FBF92;outline-offset:1px;border-color:transparent;}
  .jc .form button{font-family:var(--body);font-weight:500;font-size:1rem;padding:14px 22px;border:0;border-radius:4px;
    background:#3FBF92;color:#0C231C;cursor:pointer;transition:background .18s;}
  .jc .form button:hover{background:#5FD0A8;}
  .jc .form button:disabled{opacity:.6;cursor:default;}
  .jc .form input:disabled{opacity:.6;}
  .jc .form .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;}
  .jc .err{font-family:var(--mono);font-size:.78rem;color:#F0A8A0;margin-top:14px;}
  .jc .micro{font-family:var(--mono);font-size:.74rem;color:#8C8A80;margin-top:16px;}
  .jc .ok{display:flex;align-items:flex-start;gap:12px;margin-top:36px;max-width:460px;
    background:rgba(63,191,146,.12);border:1px solid rgba(63,191,146,.45);border-radius:8px;
    padding:18px 20px;font-family:var(--body);font-size:1.06rem;font-weight:500;
    line-height:1.45;color:#8FE6C5;}
  .jc .ok::before{content:"\\2713";flex:none;width:24px;height:24px;border-radius:50%;
    background:#3FBF92;color:#0C231C;display:flex;align-items:center;justify-content:center;
    font-size:.85rem;font-weight:700;line-height:1;margin-top:1px;}

  .jc-footer{padding:46px 0 60px;}
  .jc .foot{display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between;}
  .jc .foot .social{display:flex;gap:22px;font-family:var(--mono);font-size:.82rem;}
  .jc .foot .social a{color:var(--muted);}.jc .foot .social a:hover{color:var(--ink);}
  .jc .foot .cr{font-family:var(--mono);font-size:.74rem;color:var(--faint);}

  .jc .reveal{opacity:0;transform:translateY(14px);transition:opacity .7s ease,transform .7s ease;}
  .jc .reveal.in{opacity:1;transform:none;}
  @media(prefers-reduced-motion:reduce){.jc .reveal{opacity:1;transform:none;transition:none;}.jc .arrow{transition:none;}}
`;

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
        headers: { "Content-Type": "application/json", Accept: "application/json" },
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
    <div className="jc" id="top" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <header className="jc-header">
        <div className="wrap bar">
          <a href="#top" className="logo">
            Juliana Crispo
          </a>
          <a href="#list" className="navcta">
            Get on the list
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow reveal">Since 2010 · sales, from every angle</p>
            <h1 className="reveal">
              One problem.
              <br />
              Every seat.
            </h1>
            <p className="sub reveal">
              I&apos;ve worked a single thing from every angle in sales: the{" "}
              <b>top rep</b>, the <b>sales leader</b>, the <b>fractional CRO</b>,
              the <b>trainer to 10,000+ sellers</b>, and the <b>founder</b> who
              built and sold her own products. Now I&apos;m building for the
              people who sell.
            </p>
            <a className="cta reveal" href="#list">
              Get on the list <span className="arrow">→</span>
            </a>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <div className="grid">
              <div className="cell">
                <div className="n">15 yrs</div>
                <div className="l">in sales, every seat</div>
              </div>
              <div className="cell">
                <div className="n">#1</div>
                <div className="l">rep of 800+, at 241% of quota</div>
              </div>
              <div className="cell">
                <div className="n">10,000+</div>
                <div className="l">sellers trained</div>
              </div>
              <div className="cell">
                <div className="n">120k+</div>
                <div className="l">audience built solo</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mv">
          <div className="wrap col">
            <p className="eyebrow reveal">2010 – 2015 · the seller</p>
            <h2 className="reveal">Carried the bag.</h2>
            <p className="lede reveal">
              I started as a seller and became the best one in the building.
            </p>
            <p className="reveal">
              Number one rep out of an 800-person org at Meltwater, 241% of
              quota, then built and ran the top-producing team. At Fuze, net-new
              logos with Groupon, Samsung, and Sony, over quota every quarter. At
              Ghostery, enterprise deals across financial services. Five years,
              one conclusion: I could close anything.
            </p>
            <div className="figs reveal">
              <div className="fig">
                <div className="n">#1</div>
                <div className="l">rep of 800+ at Meltwater</div>
              </div>
              <div className="fig">
                <div className="n">241%</div>
                <div className="l">of quota</div>
              </div>
              <div className="fig">
                <div className="n">40%</div>
                <div className="l">
                  of new-product revenue, from the team I built
                </div>
              </div>
            </div>
            <p className="logos reveal">
              Net-new logos: American Express · Chase · Mastercard · Visa ·
              Groupon · Samsung · Sony · Staples · Airbnb
            </p>
          </div>
        </section>

        <section className="mv">
          <div className="wrap col">
            <p className="eyebrow reveal">2015 – 2021 · the operator</p>
            <h2 className="reveal">Built the motion.</h2>
            <p className="lede reveal">
              Then I stopped carrying my own bag and started building revenue for
              everyone else.
            </p>
            <p className="reveal">
              Six years as a fractional CRO across AI, engineering, construction,
              education, and marketing SaaS. I built the playbooks, then hired the
              teams to run them. And I taught the rest: a sales program that
              trained 10,000+ sellers, backed by Gong, Outreach, and Guru. I built
              that curriculum the slow way, by sitting inside real sales calls for
              years to find what actually closed deals.
            </p>
            <div className="results reveal">
              <div className="row">
                <span className="co">Involvesoft</span>
                <span className="me">$60K → $1.4M ARR</span>
                <span className="ti">6 months</span>
              </div>
              <div className="row">
                <span className="co">iControl</span>
                <span className="me">1 → 42 enterprise customers</span>
                <span className="ti">18 months</span>
              </div>
              <div className="row">
                <span className="co">Skore</span>
                <span className="me">5 → 80+ customers</span>
                <span className="ti">12 months</span>
              </div>
              <div className="row">
                <span className="co">Valispace</span>
                <span className="me">7× revenue</span>
                <span className="ti">8 months</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mv">
          <div className="wrap col">
            <p className="eyebrow reveal">2021 – now · the founder</p>
            <h2 className="reveal">Built from zero.</h2>
            <p className="lede reveal">
              Then I left the org chart behind and built something that was
              entirely my own.
            </p>
            <p className="reveal">
              I built a YouTube audience from zero to 120,000+, earned sponsors
              like LMNT, Function Health, and Oura, and turned it into a
              six-figure business: a coaching practice, a cookbook, and an app,
              teaching 10,000+ women. No employer, no category, no brand handed
              to me, all built while birthing and raising 2 kids.
            </p>
            <div className="figs reveal">
              <div className="fig">
                <div className="n">120k+</div>
                <div className="l">subscribers, from zero</div>
              </div>
              <div className="fig">
                <div className="n">10,000+</div>
                <div className="l">women taught</div>
              </div>
              <div className="fig">
                <div className="n">6-figure</div>
                <div className="l">business</div>
              </div>
              <div className="fig">
                <div className="n">2 kids</div>
                <div className="l">birthed and raised</div>
              </div>
            </div>
            <p className="logos reveal">LMNT · Function Health · Oura</p>
          </div>
        </section>

        <section className="thread">
          <div className="wrap col">
            <p className="reveal">Rep, leader, CRO, teacher, founder.</p>
            <p className="t2 reveal">
              I&apos;ve seen how people sell from every seat in the building, and
              I&apos;ve sold everything from enterprise software to a cookbook.
              Almost no one has sat in all those chairs.
            </p>
          </div>
        </section>

        <section className="next" id="list">
          <div className="wrap col inner">
            <p className="eyebrow reveal">What&apos;s next</p>
            <h2 className="reveal">
              I&apos;m building software for the people who sell.
            </h2>
            <p className="reveal">
              It draws on all of it, and most of all on the years I spent inside
              the sales call itself. Quiet for now. If you sell, or you back the
              people who do, get on the list.
            </p>
            {status !== "success" ? (
              <>
                <form className="form reveal" onSubmit={handleSubmit} noValidate>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
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
                      "Adding you…"
                    ) : (
                      <>
                        Get on the list <span className="arrow">→</span>
                      </>
                    )}
                  </button>
                </form>
                {status === "error" && (
                  <p className="err" role="alert">
                    {errorMsg}
                  </p>
                )}
                <p className="micro reveal">
                  No noise. You&apos;ll hear from me when there&apos;s something
                  worth showing.
                </p>
              </>
            ) : (
              <p className="ok">
                You&apos;re on the list. Check your inbox to confirm.
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="jc-footer">
        <div className="wrap foot">
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
