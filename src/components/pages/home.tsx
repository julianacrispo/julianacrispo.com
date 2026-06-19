import { useCallback, useState } from "react";
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
import { submitForm } from "@/lib/ploy-forms/submit-form";

/**
 * @ployComponent
 * @ployComponentId HomePage
 * @ployComponentName Juliana Crispo Home
 * @ployComponentType page
 * @ployComponentPattern landing
 * @ployComponentStatus stable
 * @ployComponentDescription Homepage for Juliana Crispo, a Fractional CRO doing GTM leadership
 * for early-stage founders. DARK SYNTHWAVE direction: deep indigo night base (#0F0A24) with
 * panel cards (#1B1540), subtle light borders, deep offset shadows, and a perspective grid
 * floor. DISCIPLINED ACCENTS: hot pink (#FF2D8F) is reserved ONLY for CTA buttons (with a soft
 * neon glow); every other accent (eyebrows, stats, dotted lockup, icons, step badges) uses
 * bright blue (#5B86FF / cobalt #2F5BD9) with cyan (#1FC6D6) as a cool support. (An earlier
 * cream/paper version of this page also exists in git history if a light base is preferred.)
 * Composes local sections: Nav (links left, JC brand right, no nav CTA), Hero (dotted SCALE
 * lockup + grid floor), StatBand (3 stats), ServicesRow (Playbook Creation / 3-Month Fractional
 * CRO / Recruiting & Exec Search, eyebrow leads every card), ProcessSection (Diagnose / Build
 * the playbook / Scale it), ResultsSection, TestimonialSection (Embla), FinalCta (request-a-
 * strategy-call form, no public pricing), Footer. Copy in DEFAULT_* consts. No em dashes by
 * request. Dark tokens: ploy-night, ploy-panel, ploy-panel-2, ploy-line, ploy-text-soft,
 * ploy-shadow-deep, ploy-blue-bright in globals.css @theme inline.
 */

const NAV_LINKS = [
  { label: "What I do", href: "#services" },
  { label: "How it works", href: "#process" },
  { label: "Results", href: "#results" },
];

const INPUT_CLASS =
  "w-full rounded-xl border border-ploy-line bg-ploy-night px-4 py-3 text-sm font-semibold text-white placeholder:text-ploy-text-soft/60 focus:outline-none focus:ring-2 focus:ring-ploy-blue-bright";

// Shared card frame: dark panel, soft light border, deep offset shadow (retro look on dark).
const CARD =
  "rounded-[1.5rem] border border-ploy-line bg-ploy-panel shadow-[6px_6px_0_0_var(--color-ploy-shadow-deep)]";

/* ----------------------------------------------------------------------------
 * Dotted display lockup: signature dot-matrix wordmark (blue + cyan only).
 * -------------------------------------------------------------------------- */

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

const LETTER_COLORS = [
  "var(--color-ploy-blue-bright)",
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
                    : "inset 0 0 0 1px rgba(255,255,255,0.06)",
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
 * Retro perspective grid floor
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

/* ----------------------------------------------------------------------------
 * Growth illustration (on the Fractional CRO card) — blue/cyan on dark
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
      <path d="M28 118 H172" stroke="#c4bce6" strokeWidth="3" />
      <rect x="40" y="92" width="20" height="26" rx="4" stroke="#5b86ff" strokeWidth="3" />
      <rect x="74" y="74" width="20" height="44" rx="4" stroke="#1fc6d6" strokeWidth="3" />
      <rect x="108" y="54" width="20" height="64" rx="4" stroke="#5b86ff" strokeWidth="3" />
      <path
        d="M44 104 C 80 96, 110 70, 158 38"
        stroke="#5b86ff"
        strokeWidth="3"
        strokeDasharray="2 9"
      />
      <path d="M150 34 L162 34 L162 46" stroke="#5b86ff" strokeWidth="3" />
      <path d="M168 72 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#1fc6d6" />
      <circle cx="36" cy="40" r="4" fill="#1fc6d6" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * Buttons — pink CTA with neon glow; ghost outline
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
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-ploy-pink px-7 py-3.5 text-base font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ploy-shadow-deep),0_0_26px_rgba(255,45,143,0.4)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--color-ploy-shadow-deep),0_0_30px_rgba(255,45,143,0.55)] ${className}`}
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
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-ploy-line bg-white/5 px-7 py-3.5 text-base font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ploy-shadow-deep)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-white/10 hover:shadow-[2px_2px_0_0_var(--color-ploy-shadow-deep)] ${className}`}
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
      <div className="mx-auto flex max-w-6xl items-center justify-end gap-8 px-6 py-5 md:justify-between">
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-bold text-ploy-text-soft transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ploy-blue-bright/50 bg-ploy-cobalt text-sm font-black text-white">
            JC
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-black tracking-tight text-white">
              Juliana Crispo
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-ploy-text-soft">
              Fractional CRO
            </span>
          </span>
        </a>
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
      style={{ ["--grid-color" as string]: "var(--color-ploy-blue-bright)" }}
    >
      <GridFloor className="opacity-40" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-14 pt-10 text-center md:pt-16">
        <p className="mb-8 text-sm font-extrabold uppercase tracking-[0.18em] text-ploy-blue-bright">
          Fractional CRO &middot; GTM leadership
        </p>
        <div className="mx-auto mb-20 max-w-md">
          <DottedWord word="SCALE" />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-4xl font-black leading-[1.05] tracking-tight text-balance text-white sm:text-5xl md:text-6xl"
        >
          Build a GTM function
          <br />
          founders actually trust.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-lg font-medium text-ploy-text-soft"
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
            Request a strategy call <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
          <GhostButton href="#results">See the results</GhostButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Stat band
 * -------------------------------------------------------------------------- */

const DEFAULT_STATS = [
  { value: "$0 to $150M+", label: "ARR scaled across portfolio companies" },
  { value: "11+ yrs", label: "GTM leadership for early-stage founders" },
  { value: "2", label: "Companies guided to profitable acquisition" },
];

function StatBand() {
  return (
    <section className="relative z-10 mx-auto mt-2 max-w-6xl px-6 pb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DEFAULT_STATS.map((s) => (
          <div
            key={s.label}
            className={`px-5 py-6 text-center ${CARD} rounded-[1.25rem]`}
          >
            <div className="text-2xl font-black text-ploy-blue-bright md:text-3xl">
              {s.value}
            </div>
            <p className="mt-2 text-sm font-medium leading-snug text-ploy-text-soft">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Services: three offerings
 * -------------------------------------------------------------------------- */

function ServicesRow() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-ploy-blue-bright">
          What I do
        </p>
        <h2 className="font-heading text-3xl font-black tracking-tight text-balance text-white md:text-4xl">
          Everything you need to scale like you&apos;ve done it before.
        </h2>
        <p className="mt-4 text-lg font-medium text-ploy-text-soft">
          Three ways founders work with me to go from founder led to a scalable
          motion that compounds.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 1. Done with you: Playbook Creation */}
        <div className={`flex flex-col p-7 ${CARD}`}>
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ploy-text-soft">
            Done with you
          </span>
          <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border border-ploy-line bg-ploy-blue-bright/15 text-ploy-blue-bright">
            <FileText className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-xl font-black text-white">
            Playbook Creation
          </h3>
          <p className="mt-2 text-sm font-medium text-ploy-text-soft">
            We learn your market and ICP, figure out your GTM process, and turn
            around a playbook built to scale.
          </p>
        </div>

        {/* 2. Done for you: 3-Month Fractional CRO (illustration) */}
        <div className={`flex flex-col p-7 ${CARD}`}>
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ploy-text-soft">
            Done for you
          </span>
          <div className="mt-4 flex h-28 items-center justify-center rounded-2xl border border-ploy-line bg-ploy-night">
            <AdvisoryDrawing />
          </div>
          <h3 className="mt-4 text-xl font-black text-white">
            3-Month Fractional CRO
          </h3>
          <p className="mt-2 text-sm font-medium text-ploy-text-soft">
            Bring me into your team to build the motion hands on, from pipeline
            to process to your first reps.
          </p>
        </div>

        {/* 3. Done for you: Recruiting & Executive Search */}
        <div className="flex flex-col justify-between rounded-[1.5rem] border border-ploy-blue-bright/40 bg-ploy-panel p-7 shadow-[6px_6px_0_0_var(--color-ploy-shadow-deep)]">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ploy-text-soft">
              Done for you
            </span>
            <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border border-ploy-line bg-ploy-blue-bright/15 text-ploy-blue-bright">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-black leading-tight text-white">
              Recruiting &amp; Executive Search
            </h3>
            <p className="mt-2 text-sm font-medium text-ploy-text-soft">
              I build world-class GTM teams and find you your future CRO.
            </p>
          </div>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-ploy-blue-bright"
          >
            Let&apos;s build yours <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Process — banded section with grid floor + neon steps
 * -------------------------------------------------------------------------- */

const DEFAULT_STEPS = [
  {
    title: "Diagnose",
    body: "We pressure-test your current motion to find where deals stall, who's really buying, and what's costing you wins.",
    color: "bg-ploy-blue-bright",
  },
  {
    title: "Build the playbook",
    body: "Messaging, qualification, and a GTM process your team can run without you in every call.",
    color: "bg-ploy-cobalt",
  },
  {
    title: "Scale it",
    body: "We operationalize the motion with the right hires and AI agents so growth compounds without adding chaos.",
    color: "bg-ploy-cyan",
  },
];

function ProcessSection() {
  return (
    <section
      id="process"
      className="relative overflow-hidden border-y border-ploy-line bg-white/[0.03] py-16 text-white md:py-24"
      style={{ ["--grid-color" as string]: "var(--color-ploy-pink)" }}
    >
      <GridFloor className="opacity-25" />
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
              className="rounded-[1.5rem] border border-ploy-line bg-ploy-panel p-7"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-white ${step.color}`}
              >
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-black text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-ploy-text-soft">
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
  { value: "1 to 42", label: "Enterprise customers at iControl in under 18 months" },
  { value: "<5 to 80+", label: "Customers at Skore in 12 months" },
  { value: "2x", label: "Close rates at Instaroid in under 90 days" },
  { value: "50%", label: "Faster enterprise sales cycle at Appreciation Engine" },
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
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-ploy-blue-bright">
            Real outcomes
          </p>
          <h2 className="font-heading text-3xl font-black tracking-tight text-balance text-white md:text-4xl">
            Founders don&apos;t hire me for theory.
          </h2>
          <p className="mt-4 text-lg font-medium text-ploy-text-soft">
            Every engagement is measured in pipeline, close rates, and revenue.
            Here&apos;s what that&apos;s looked like across the companies
            I&apos;ve worked with.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {DEFAULT_RESULTS.map((r) => (
              <div key={r.label} className={`p-5 ${CARD} rounded-2xl`}>
                <div className="text-2xl font-black text-ploy-blue-bright">
                  {r.value}
                </div>
                <p className="mt-1 text-xs font-semibold leading-snug text-ploy-text-soft">
                  {r.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-ploy-blue-bright/40 bg-ploy-panel p-8 shadow-[6px_6px_0_0_var(--color-ploy-shadow-deep)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ploy-line bg-ploy-blue-bright/15 text-ploy-blue-bright">
            <Rocket className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-2xl font-black leading-tight text-white">
            Built for the messy early stage.
          </h3>
          <ul className="mt-6 space-y-4">
            {RESULTS_LIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ploy-blue-bright text-[11px] font-black text-white">
                  &#10003;
                </span>
                <span className="text-sm font-semibold text-white">
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
  },
  {
    quote:
      "She rebuilt our motion from the ground up. Revenue 7x'd in eight months and the team actually owned the process.",
    detail: "Founder, Valispace (Engineering SaaS)",
  },
  {
    quote:
      "We went from a single enterprise logo to 42 in under 18 months. The playbook she left us still runs the floor.",
    detail: "Founder, iControl App (Construction SaaS)",
  },
  {
    quote:
      "Our pipeline was pure guesswork. Within a year we grew from 5 customers to more than 80, predictably.",
    detail: "Founder, Skore (Education SaaS)",
  },
  {
    quote:
      "Our enterprise deals used to drag on forever. She cut our sales cycle in half and gave us a process we could forecast against.",
    detail: "Founder, Appreciation Engine (Marketing SaaS)",
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
    <section className="border-y border-ploy-line bg-white/[0.03] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-heading text-3xl font-black tracking-tight text-balance text-white md:text-4xl">
            What founders say after working together.
          </h2>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ploy-line bg-ploy-panel text-white shadow-[3px_3px_0_0_var(--color-ploy-shadow-deep)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_var(--color-ploy-shadow-deep)]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ploy-cobalt text-white shadow-[3px_3px_0_0_var(--color-ploy-shadow-deep)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_var(--color-ploy-shadow-deep)]"
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
                className={`flex min-w-0 shrink-0 grow-0 basis-full flex-col justify-between p-8 md:basis-[calc(50%-12px)] ${CARD}`}
              >
                <blockquote className="text-xl font-black leading-snug text-white">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ploy-cobalt text-sm font-black text-white">
                    {t.detail.charAt(t.detail.indexOf(",") + 2)}
                  </span>
                  <span className="text-sm font-extrabold text-ploy-text-soft">
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
 * Final CTA (request form) + Footer
 * -------------------------------------------------------------------------- */

function FinalCta() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      goal: String(data.get("goal") || ""),
    };
    setStatus("submitting");
    try {
      await submitForm("strategy-call-request", payload);
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div
        className="relative overflow-hidden rounded-[2rem] border border-ploy-line bg-ploy-panel-2 px-6 py-14 text-white shadow-[8px_8px_0_0_var(--color-ploy-shadow-deep),0_0_40px_rgba(255,45,143,0.18)] md:px-12 md:py-16"
        style={{ ["--grid-color" as string]: "var(--color-ploy-pink)" }}
      >
        <GridFloor className="opacity-25" />
        <div className="relative z-10 grid items-center gap-10 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-3xl font-black leading-tight tracking-tight text-balance text-white md:text-4xl">
              Ready to scale how you sell?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg font-medium text-ploy-text-soft md:mx-0">
              Tell me where your GTM motion is stuck and what you are trying to
              hit. If it looks like a fit, I will reach out to set up a strategy
              call.
            </p>
          </div>

          {status === "done" ? (
            <div className="rounded-[1.5rem] border border-ploy-line bg-ploy-panel p-8 text-center shadow-[6px_6px_0_0_var(--color-ploy-shadow-deep)]">
              <h3 className="text-xl font-black text-white">
                Request received.
              </h3>
              <p className="mt-2 text-sm font-medium text-ploy-text-soft">
                Thanks for reaching out. I will be in touch shortly to find
                time.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[1.5rem] border border-ploy-line bg-ploy-panel p-6 shadow-[6px_6px_0_0_var(--color-ploy-shadow-deep)] md:p-7"
            >
              <div className="grid gap-3">
                <input
                  name="name"
                  required
                  placeholder="Your name"
                  className={INPUT_CLASS}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Work email"
                  className={INPUT_CLASS}
                />
                <input
                  name="company"
                  placeholder="Company"
                  className={INPUT_CLASS}
                />
                <textarea
                  name="goal"
                  rows={3}
                  placeholder="What are you trying to hit?"
                  className={INPUT_CLASS}
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ploy-pink px-8 py-3.5 text-base font-extrabold text-white shadow-[4px_4px_0_0_var(--color-ploy-shadow-deep),0_0_26px_rgba(255,45,143,0.4)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--color-ploy-shadow-deep),0_0_30px_rgba(255,45,143,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? (
                  "Sending..."
                ) : (
                  <>
                    Request a strategy call <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              {status === "error" && (
                <p className="mt-3 text-center text-sm font-semibold text-ploy-pink">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ploy-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ploy-blue-bright/50 bg-ploy-cobalt text-xs font-black text-white">
            JC
          </span>
          <span className="text-sm font-bold text-white">
            Juliana Crispo &middot; Fractional CRO
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-ploy-text-soft">
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
      <div className="min-h-screen bg-ploy-night text-white">
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
