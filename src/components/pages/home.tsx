import { useCallback } from "react";
import { MotionConfig, motion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight,
  Users,
  FileText,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * @ployComponent
 * @ployComponentId HomePage
 * @ployComponentName Juliana Crispo Home
 * @ployComponentType page
 * @ployComponentPattern landing
 * @ployComponentStatus stable
 * @ployComponentDescription Homepage for Juliana Crispo, a Fractional CRO doing GTM leadership
 * for early-stage founders. Coherent 80s synthwave direction (reworked from an earlier
 * scattered 8-color version that read as visual noise). DISCIPLINED PALETTE: cream paper
 * (#FBF6E8) + ink (#1B1A14) neutrals, with hot pink (#FF2D8F) and electric blue (#2F5BD9)
 * as the only two star accents, cyan (#1FC6D6) as a cool support tint. Signature retro
 * devices: hard offset drop shadows (shadow-[Npx_Npx_0_0_ink]), 2px ink outlines on cards
 * and buttons, a perspective grid floor, and a pink/blue gradient "sun". Section rhythm:
 * cream default with ONE dark ink synthwave band (Process) plus a dark CTA, instead of every
 * section shouting. Composes local sections: Nav, Hero (dotted SCALE lockup + sun + grid),
 * StatBand, ServicesRow (Playbook Creation / 3-Month Fractional CRO / Recruiting & Exec
 * Search), ProcessSection (dark band: Diagnose / Build the playbook / Scale with agents and
 * people), ResultsSection, TestimonialSection (Embla), FinalCta ($1K paid strategy call),
 * Footer. Copy in DEFAULT_* consts. No em dashes by request. Palette tokens: ploy-pink,
 * ploy-cobalt, ploy-cyan, ploy-ink, ploy-cream + *-soft tints in globals.css @theme inline.
 */

const NAV_LINKS = [
  { label: "What I do", href: "#services" },
  { label: "How it works", href: "#process" },
  { label: "Results", href: "#results" },
];

const INK = "var(--color-ploy-ink)";

/* ----------------------------------------------------------------------------
 * Dotted display lockup: signature "wiggly" dot-matrix wordmark.
 * Coherent: alternates only pink + electric blue.
 * -------------------------------------------------------------------------- */

// 5-wide x 7-tall dot matrices. 1 = dot, 0 = empty.
const GLYPHS: Record<string, number[][]> = {
  S: [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  C: [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
};

// Blue-family only — pink is reserved strictly for CTAs.
const LETTER_COLORS = [
  "var(--color-ploy-cobalt)",
  "var(--color-ploy-cyan)",
];

function DottedWord({ word = "SCALE" }: { word?: string }) {
  const letters = word.toUpperCase().split("");
  return (
    <div
      className="flex items-end justify-center gap-[3.5%]"
      role="img"
      aria-label={word}
    >
      {letters.map((char, li) => {
        const grid = GLYPHS[char];
        const color = LETTER_COLORS[li % LETTER_COLORS.length];
        if (!grid) return null;
        return (
          <motion.div
            key={`${char}-${li}`}
            className="grid gap-[14%]"
            style={{ gridTemplateColumns: "repeat(5, 1fr)", width: "18%" }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: li * 0.18,
            }}
          >
            {grid.flat().map((cell, ci) => (
              <span
                key={ci}
                className="aspect-square rounded-full"
                style={{
                  background: cell ? color : "transparent",
                  boxShadow: cell
                    ? "none"
                    : "inset 0 0 0 1px rgba(27,26,20,0.05)",
                }}
              />
            ))}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Retro decorative motifs: perspective grid floor + gradient sun
 * -------------------------------------------------------------------------- */

function GridFloor({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-56 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(var(--grid-color) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--grid-color) 1.5px, transparent 1.5px)",
        backgroundSize: "44px 44px",
        transform: "perspective(340px) rotateX(62deg)",
        transformOrigin: "bottom center",
        maskImage: "linear-gradient(transparent, black 80%)",
        WebkitMaskImage: "linear-gradient(transparent, black 80%)",
      }}
    />
  );
}

function RetroSun({ size = 300 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(180deg, var(--color-ploy-pink) 0%, var(--color-ploy-pink) 38%, var(--color-ploy-cobalt) 100%)",
        opacity: 0.16,
        filter: "blur(2px)",
      }}
    />
  );
}

/* ----------------------------------------------------------------------------
 * Hand-drawn growth illustration (on the Fractional CRO card) — on-palette
 * -------------------------------------------------------------------------- */

function AdvisoryDrawing() {
  return (
    <svg
      width="200"
      height="150"
      viewBox="0 0 200 150"
      fill="none"
      role="img"
      aria-label="Growth chart trending up"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M28 118 H172" stroke={INK} strokeWidth="3" />
      <rect x="40" y="92" width="20" height="26" rx="4" stroke="#2f5bd9" strokeWidth="3" />
      <rect x="74" y="74" width="20" height="44" rx="4" stroke="#1fc6d6" strokeWidth="3" />
      <rect x="108" y="54" width="20" height="64" rx="4" stroke="#ff2d8f" strokeWidth="3" />
      <path
        d="M44 104 C 80 96, 110 70, 158 38"
        stroke="#ff2d8f"
        strokeWidth="3"
        strokeDasharray="2 9"
      />
      <path d="M150 34 L162 34 L162 46" stroke="#ff2d8f" strokeWidth="3" />
      <path d="M168 72 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#2f5bd9" />
      <circle cx="36" cy="40" r="4" fill="#1fc6d6" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * Buttons — retro hard-shadow + ink outline
 * -------------------------------------------------------------------------- */

function PrimaryButton({
  children,
  href = "#contact",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-ploy-ink bg-ploy-pink px-7 py-3.5 text-base font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ploy-ink)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--color-ploy-ink)] ${className}`}
    >
      {children}
    </a>
  );
}

function GhostButton({
  children,
  href = "#process",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-ploy-ink bg-white px-7 py-3.5 text-base font-extrabold text-ploy-ink shadow-[4px_4px_0_0_var(--color-ploy-ink)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--color-ploy-ink)] ${className}`}
    >
      {children}
    </a>
  );
}

/* ----------------------------------------------------------------------------
 * Nav
 * -------------------------------------------------------------------------- */

function Nav() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ploy-ink bg-ploy-cobalt text-sm font-black text-white">
            JC
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-black tracking-tight">
              Juliana Crispo
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-ploy-text-secondary">
              Fractional CRO
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-bold text-ploy-text-secondary transition-colors hover:text-ploy-text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <PrimaryButton href="#contact" className="px-5 py-2.5 text-sm">
          Book a call
        </PrimaryButton>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------------------
 * Hero
 * -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ ["--grid-color" as string]: "var(--color-ploy-cobalt)" }}
    >
      <GridFloor className="opacity-25" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-14 pt-10 text-center md:pt-16">
        <div className="mx-auto mb-12 max-w-2xl">
          <DottedWord word="SCALE" />
        </div>
        <p className="mb-6 text-sm font-extrabold uppercase tracking-[0.18em] text-ploy-cobalt">
          Fractional CRO &middot; GTM leadership
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-4xl font-black leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          Build a GTM function
          <br />
          founders actually trust.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-lg font-medium text-ploy-text-secondary"
        >
          I help early-stage tech founders turn founder-led selling into a GTM
          motion that scales. The kind that 7x&apos;d revenue and took startups
          from $0 to $150M ARR.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <PrimaryButton href="#contact">
            Book a strategy call <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
          <GhostButton href="#results">See the results</GhostButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Stat band — ink-outlined cards, neon numbers alternating pink/blue
 * -------------------------------------------------------------------------- */

const DEFAULT_STATS = [
  { value: "$0 to $150M", label: "ARR scaled across portfolio companies", color: "text-ploy-cobalt" },
  { value: "7x", label: "Revenue growth at Valispace in 8 months", color: "text-ploy-cobalt" },
  { value: "11+ yrs", label: "GTM leadership for early-stage founders", color: "text-ploy-cobalt" },
  { value: "2", label: "Companies guided to acquisition", color: "text-ploy-cobalt" },
];

function StatBand() {
  return (
    <section className="relative z-10 mx-auto mt-2 max-w-6xl px-6 pb-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {DEFAULT_STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-[1.25rem] border-2 border-ploy-ink bg-white px-5 py-6 text-center shadow-[4px_4px_0_0_var(--color-ploy-ink)]"
          >
            <div className={`text-2xl font-black md:text-3xl ${s.color}`}>
              {s.value}
            </div>
            <p className="mt-2 text-sm font-medium leading-snug text-ploy-text-secondary">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Services: three offerings — consistent ink-outlined cards, accent in doses
 * -------------------------------------------------------------------------- */

function ServicesRow() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-ploy-cobalt">
          What I do
        </p>
        <h2 className="font-heading text-3xl font-black tracking-tight text-balance md:text-4xl">
          Everything you need to scale like you&apos;ve done it before.
        </h2>
        <p className="mt-4 text-lg font-medium text-ploy-text-secondary">
          Three ways founders work with me to go from founder led to a scalable
          motion that compounds.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 1. Done with you: Playbook Creation */}
        <div className="flex flex-col rounded-[1.5rem] border-2 border-ploy-ink bg-white p-7 shadow-[6px_6px_0_0_var(--color-ploy-ink)]">
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ploy-text-secondary">
            Done with you
          </span>
          <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ploy-ink bg-ploy-blue-soft text-ploy-cobalt">
            <FileText className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-xl font-black text-ploy-text-primary">
            Playbook Creation
          </h3>
          <p className="mt-2 text-sm font-medium text-ploy-text-secondary">
            We learn your market and ICP, figure out your GTM process, and turn
            around a playbook built to scale.
          </p>
        </div>

        {/* 2. Done for you: 3-Month Fractional CRO (illustration) */}
        <div className="flex flex-col overflow-hidden rounded-[1.5rem] border-2 border-ploy-ink bg-white shadow-[6px_6px_0_0_var(--color-ploy-ink)]">
          <div className="flex h-44 items-center justify-center border-b-2 border-ploy-ink bg-ploy-cyan-soft">
            <AdvisoryDrawing />
          </div>
          <div className="p-7">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ploy-text-secondary">
              Done for you
            </span>
            <h3 className="mt-3 text-xl font-black">3-Month Fractional CRO</h3>
            <p className="mt-2 text-sm font-medium text-ploy-text-secondary">
              Bring me into your team to build the motion hands on, from
              pipeline to process to your first reps.
            </p>
          </div>
        </div>

        {/* 3. Done for you: Recruiting & Executive Search */}
        <div className="flex flex-col justify-between rounded-[1.5rem] border-2 border-ploy-ink bg-ploy-cobalt p-7 text-white shadow-[6px_6px_0_0_var(--color-ploy-ink)]">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/70">
              Done for you
            </span>
            <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/40 bg-white/15">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-black leading-tight">
              Recruiting &amp; Executive Search
            </h3>
            <p className="mt-2 text-sm font-medium text-white/85">
              I build world-class GTM teams and find you your future CRO.
            </p>
          </div>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-white"
          >
            Let&apos;s build yours <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Process — the single dark synthwave band (grid floor + neon steps)
 * -------------------------------------------------------------------------- */

const DEFAULT_STEPS = [
  {
    title: "Diagnose",
    body: "We pressure-test your current motion to find where deals stall, who's really buying, and what's costing you wins.",
    color: "bg-ploy-cobalt",
  },
  {
    title: "Build the playbook",
    body: "Messaging, qualification, and a GTM process your team can run without you in every call.",
    color: "bg-ploy-cobalt",
  },
  {
    title: "Scale it with agents and people",
    body: "We operationalize the motion with the right hires and AI agents so growth compounds without adding chaos.",
    color: "bg-ploy-cobalt",
  },
];

function ProcessSection() {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-ploy-ink py-16 text-white md:py-24"
      style={{ ["--grid-color" as string]: "var(--color-ploy-pink)" }}
    >
      <GridFloor className="opacity-20" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-ploy-cyan">
            How it works
          </p>
          <h2 className="font-heading text-3xl font-black tracking-tight text-balance text-white md:text-4xl">
            A simple path from messy to repeatable.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {DEFAULT_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-[1.5rem] border-2 border-white/15 bg-white/[0.06] p-7 backdrop-blur-sm"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-ploy-ink text-lg font-black text-white ${step.color}`}
              >
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-black text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-white/70">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Results
 * -------------------------------------------------------------------------- */

const DEFAULT_RESULTS = [
  { value: "1 to 42", label: "Enterprise customers at iControl in under 18 months", color: "text-ploy-cobalt" },
  { value: "<5 to 80+", label: "Customers at Skore in 12 months", color: "text-ploy-cobalt" },
  { value: "2x", label: "Close rates at Instaroid in under 90 days", color: "text-ploy-cobalt" },
  { value: "50%", label: "Faster enterprise sales cycle at Appreciation Engine", color: "text-ploy-cobalt" },
];

const RESULTS_LIST = [
  "Pre-revenue to first repeatable deals",
  "Founder-led selling to a hired team",
  "Scrappy outbound to a real pipeline",
  "One-off wins to a forecastable motion",
];

function ResultsSection() {
  return (
    <section id="results" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-ploy-cobalt">
            Real outcomes
          </p>
          <h2 className="font-heading text-3xl font-black tracking-tight text-balance md:text-4xl">
            Founders don&apos;t hire me for theory.
          </h2>
          <p className="mt-4 text-lg font-medium text-ploy-text-secondary">
            Every engagement is measured in pipeline, close rates, and revenue.
            Here&apos;s what that&apos;s looked like across the companies
            I&apos;ve worked with.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {DEFAULT_RESULTS.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl border-2 border-ploy-ink bg-white p-5 shadow-[4px_4px_0_0_var(--color-ploy-ink)]"
              >
                <div className={`text-2xl font-black ${r.color}`}>
                  {r.value}
                </div>
                <p className="mt-1 text-xs font-semibold leading-snug text-ploy-text-secondary">
                  {r.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border-2 border-ploy-ink bg-ploy-blue-soft p-8 shadow-[6px_6px_0_0_var(--color-ploy-ink)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ploy-ink bg-ploy-cobalt text-white">
            <Rocket className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-2xl font-black leading-tight">
            Built for the messy early stage.
          </h3>
          <ul className="mt-6 space-y-4">
            {RESULTS_LIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ploy-cobalt text-[11px] font-black text-white">
                  &#10003;
                </span>
                <span className="text-sm font-semibold text-ploy-text-primary">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Testimonial
 * -------------------------------------------------------------------------- */

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "We were stuck at $60K and couldn't crack repeatable sales. Six months later we hit $1.4M ARR and finally understood exactly why deals closed.",
    detail: "Founder, Involvesoft (AI SaaS)",
    accent: "bg-ploy-cobalt",
  },
  {
    quote:
      "She rebuilt our motion from the ground up. Revenue 7x'd in eight months and the team actually owned the process.",
    detail: "Founder, Valispace (Engineering SaaS)",
    accent: "bg-ploy-cobalt",
  },
  {
    quote:
      "We went from a single enterprise logo to 42 in under 18 months. The playbook she left us still runs the floor.",
    detail: "Founder, iControl App (Construction SaaS)",
    accent: "bg-ploy-cyan",
  },
  {
    quote:
      "Our pipeline was pure guesswork. Within a year we grew from 5 customers to more than 80, predictably.",
    detail: "Founder, Skore (Education SaaS)",
    accent: "bg-ploy-cobalt",
  },
  {
    quote:
      "Our enterprise deals used to drag on forever. She cut our sales cycle in half and gave us a process we could forecast against.",
    detail: "Founder, Appreciation Engine (Marketing SaaS)",
    accent: "bg-ploy-cobalt",
  },
];

function TestimonialSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-heading text-3xl font-black tracking-tight text-balance md:text-4xl">
            What founders say after working together.
          </h2>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ploy-ink bg-white text-ploy-ink shadow-[3px_3px_0_0_var(--color-ploy-ink)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_var(--color-ploy-ink)]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ploy-ink bg-ploy-cobalt text-white shadow-[3px_3px_0_0_var(--color-ploy-ink)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_var(--color-ploy-ink)]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 py-2">
            {DEFAULT_TESTIMONIALS.map((t) => (
              <figure
                key={t.detail}
                className="flex min-w-0 shrink-0 grow-0 basis-full flex-col justify-between rounded-[1.5rem] border-2 border-ploy-ink bg-ploy-cream p-8 shadow-[6px_6px_0_0_var(--color-ploy-ink)] md:basis-[calc(50%-12px)]"
              >
                <blockquote className="text-xl font-black leading-snug text-ploy-text-primary">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ploy-ink text-sm font-black text-white ${t.accent}`}
                  >
                    {t.detail.charAt(t.detail.indexOf(",") + 2)}
                  </span>
                  <span className="text-sm font-extrabold text-ploy-text-secondary">
                    {t.detail}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Final CTA + Footer
 * -------------------------------------------------------------------------- */

function FinalCta() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div
        className="relative overflow-hidden rounded-[2rem] border-2 border-ploy-ink bg-ploy-ink px-8 py-16 text-center text-white shadow-[8px_8px_0_0_var(--color-ploy-cobalt)] md:py-20"
        style={{ ["--grid-color" as string]: "var(--color-ploy-cobalt)" }}
      >
        <GridFloor className="opacity-25" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl font-black leading-tight tracking-tight text-balance text-white md:text-5xl">
            Ready to scale how you sell?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg font-medium text-white/85">
            Book a 1-hour strategy call for $1,000. We&apos;ll pinpoint where
            your GTM motion is stuck and map the fastest path to repeatable
            revenue. You&apos;ll leave with a plan whether or not we work
            together.
          </p>
          <a
            href="mailto:hello@julianacrispo.com"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border-2 border-ploy-ink bg-ploy-pink px-8 py-4 text-base font-extrabold text-white shadow-[4px_4px_0_0_#ffffff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#ffffff]"
          >
            Book a strategy call ($1K) <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-ploy-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ploy-ink bg-ploy-cobalt text-xs font-black text-white">
            JC
          </span>
          <span className="text-sm font-bold">
            Juliana Crispo &middot; Fractional CRO
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-ploy-text-secondary">
          Helping founders scale since 2015.
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * -------------------------------------------------------------------------- */

export function HomePage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-ploy-background-primary text-ploy-text-primary">
        <Nav />
        <main>
          <Hero />
          <StatBand />
          <ServicesRow />
          <ProcessSection />
          <ResultsSection />
          <TestimonialSection />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
