import { MotionConfig, motion } from "motion/react";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Compass,
  Rocket,
  LineChart,
  CheckCircle2,
} from "lucide-react";

/**
 * @ployComponent
 * @ployComponentId HomePage
 * @ployComponentName Juliana Crispo Home
 * @ployComponentType page
 * @ployComponentPattern landing
 * @ployComponentStatus stable
 * @ployComponentDescription Homepage for Juliana Crispo's sales-process consulting & advisory
 * practice for early-stage founders. Playful "bright/bouncy" direction adapted from the Kids
 * Smart Learning lookbook (lb_sgm0motwqq): cream canvas (#FBF6E8), multi-color dotted display
 * lockup, cobalt-blue pill CTAs, primary-palette rounded cards (butter yellow / cobalt / mint),
 * floating geometric shapes, Nunito rounded-sans type. Composes local sections: Nav, Hero,
 * StatBand, ServicesRow, ProcessSection, ResultsSection, TestimonialSection, FinalCta, Footer.
 * All copy lives in DEFAULT_* consts for easy editing. Brand palette tokens: ploy-cobalt,
 * ploy-red, ploy-yellow, ploy-mint, ploy-orange, ploy-cream in globals.css @theme inline.
 */

const NAV_LINKS = [
  { label: "What I do", href: "#services" },
  { label: "How it works", href: "#process" },
  { label: "Results", href: "#results" },
];

const PROOF_IMAGE =
  "https://storage.googleapis.com/ployai/1128baac-0f0d-4b3b-aa46-b9e9e0069105/user/b5e4598d-ai-generated-1781843437984.png";

/* ----------------------------------------------------------------------------
 * Dotted display lockup — the signature "wiggly" multi-color dot-matrix wordmark
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

const LETTER_COLORS = [
  "var(--color-ploy-red)",
  "var(--color-ploy-orange)",
  "var(--color-ploy-yellow)",
  "var(--color-ploy-mint-deep)",
  "var(--color-ploy-cobalt)",
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
                  boxShadow: cell ? "none" : "inset 0 0 0 1px rgba(0,0,0,0.03)",
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
 * Decorative floating shapes
 * -------------------------------------------------------------------------- */

function FloatingShapes() {
  const float = (delay: number, dist = 10) => ({
    animate: { y: [0, -dist, 0] },
    transition: {
      duration: 4 + delay,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  });
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* red half circle, left */}
      <motion.div
        {...float(0.2, 8)}
        className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-ploy-red/90"
        style={{ clipPath: "inset(0 0 50% 0)" }}
      />
      {/* mint capsule */}
      <motion.div
        {...float(0.8, 12)}
        className="absolute left-[14%] top-[42%] h-10 w-24 rounded-full bg-ploy-mint"
      />
      {/* yellow square */}
      <motion.div
        {...float(1.1, 10)}
        className="absolute right-[16%] top-16 h-16 w-16 rotate-6 rounded-2xl bg-ploy-yellow"
      />
      {/* cobalt square */}
      <motion.div
        {...float(0.5, 14)}
        className="absolute right-[8%] top-[46%] h-12 w-12 -rotate-6 rounded-xl bg-ploy-cobalt"
      />
      {/* orange star */}
      <motion.div
        {...float(1.4, 9)}
        className="absolute left-[40%] top-8 text-ploy-orange"
      >
        <StarShape />
      </motion.div>
      {/* dotted grid, right */}
      <div className="absolute right-[6%] top-32 hidden md:grid grid-cols-5 gap-2 opacity-60">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-ploy-cobalt/50" />
        ))}
      </div>
      {/* dotted grid, left lower */}
      <div className="absolute left-[8%] bottom-16 hidden md:grid grid-cols-4 gap-2 opacity-50">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-ploy-red/40" />
        ))}
      </div>
    </div>
  );
}

function StarShape() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0l2.4 7.6L22 8.4l-5.8 4.6 2 7.6L12 16.8 5.8 20.6l2-7.6L2 8.4l7.6-.8z" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * Buttons
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
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-ploy-cobalt px-7 py-3.5 text-base font-extrabold text-white shadow-sm transition-colors hover:bg-ploy-cobalt/90 ${className}`}
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
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-ploy-border-primary bg-white/60 px-7 py-3.5 text-base font-extrabold text-ploy-text-primary transition-colors hover:bg-white ${className}`}
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
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ploy-cobalt text-sm font-black text-white">
            JC
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-black tracking-tight">
              Juliana Crispo
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-ploy-text-secondary">
              Sales Advisory
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
    <section id="top" className="relative">
      <FloatingShapes />
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-10 pt-10 text-center md:pt-16">
        <div className="mx-auto mb-7 max-w-2xl">
          <DottedWord word="SCALE" />
        </div>
        <p className="mb-6 text-sm font-extrabold uppercase tracking-[0.18em] text-ploy-text-secondary">
          Sales process consulting &amp; advisory
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-4xl font-black leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          Build a sales engine
          <br />
          founders actually trust.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-lg font-medium text-ploy-text-secondary"
        >
          I help early-stage tech companies turn scrappy, founder-led selling
          into a repeatable motion — the kind that 7x&apos;d revenue and took
          startups from $0 to $150M.
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
 * Stat band
 * -------------------------------------------------------------------------- */

const DEFAULT_STATS = [
  { value: "$0→$150M", label: "Revenue scaled across portfolio companies" },
  { value: "7x", label: "Revenue growth at Valispace in 8 months" },
  { value: "11+ yrs", label: "Advising early-stage founders on GTM" },
  { value: "2", label: "Companies guided to acquisition" },
];

function StatBand() {
  return (
    <section className="relative z-10 mx-auto mt-4 max-w-6xl px-6 pb-4">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-ploy-border-primary md:grid-cols-4">
        {DEFAULT_STATS.map((s) => (
          <div key={s.label} className="bg-white px-6 py-7 text-center">
            <div className="text-2xl font-black text-ploy-cobalt md:text-3xl">
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
 * Services — three-color card row
 * -------------------------------------------------------------------------- */

const DEFAULT_SERVICE_ROWS = [
  { icon: Target, title: "Ideal customer & messaging", note: "Find your real buyer" },
  { icon: Compass, title: "Repeatable sales process", note: "Stop winging every deal" },
  { icon: Users, title: "Hiring & coaching your first reps", note: "Build the team right" },
];

function ServicesRow() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-black tracking-tight text-balance md:text-4xl">
          Everything you need to sell like you&apos;ve done it before.
        </h2>
        <p className="mt-4 text-lg font-medium text-ploy-text-secondary">
          Three ways founders work with me to go from founder-led hustle to a
          sales motion that compounds.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {/* Yellow feature card */}
        <div className="rounded-[1.5rem] bg-ploy-yellow p-7">
          <h3 className="text-xl font-black text-ploy-text-primary">
            Sales strategy
          </h3>
          <p className="mt-2 text-sm font-semibold text-ploy-text-primary/70">
            The foundation under every deal.
          </p>
          <ul className="mt-6 space-y-5">
            {DEFAULT_SERVICE_ROWS.map((row) => (
              <li key={row.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-ploy-text-primary">
                  <row.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-extrabold leading-tight text-ploy-text-primary">
                    {row.title}
                  </span>
                  <span className="block text-xs font-semibold text-ploy-text-primary/60">
                    {row.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Center photo card */}
        <div className="overflow-hidden rounded-[1.5rem] bg-white">
          <img
            src={PROOF_IMAGE}
            alt="A founder and sales advisor mapping out a go-to-market strategy together at a sunlit table"
            className="h-56 w-full object-cover"
            loading="lazy"
          />
          <div className="p-7">
            <h3 className="text-xl font-black">Hands-on advisory</h3>
            <p className="mt-2 text-sm font-medium text-ploy-text-secondary">
              We work side by side — pipeline reviews, call breakdowns, and live
              deal strategy until the motion sticks with your team.
            </p>
          </div>
        </div>

        {/* Cobalt trust card */}
        <div className="flex flex-col justify-between rounded-[1.5rem] bg-ploy-cobalt p-7 text-white">
          <div>
            <Rocket className="h-8 w-8" />
            <h3 className="mt-4 text-2xl font-black leading-tight">
              From first hire to Series&nbsp;B.
            </h3>
            <p className="mt-3 text-sm font-medium text-white/80">
              I&apos;ve built the sales teams and playbooks that carried
              startups through their hardest growth chapters.
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
 * Process
 * -------------------------------------------------------------------------- */

const DEFAULT_STEPS = [
  {
    title: "Diagnose",
    body: "We pressure-test your current motion — where deals stall, who's really buying, and what's costing you wins.",
  },
  {
    title: "Build the playbook",
    body: "Messaging, qualification, and a process your team can actually run without you in every call.",
  },
  {
    title: "Coach it in",
    body: "Live deal strategy and rep coaching until the new motion is muscle memory and the numbers move.",
  },
];

function ProcessSection() {
  return (
    <section id="process" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-ploy-cobalt">
            How it works
          </p>
          <h2 className="font-heading text-3xl font-black tracking-tight text-balance md:text-4xl">
            A simple path from messy to repeatable.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {DEFAULT_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-[1.5rem] bg-ploy-cream p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ploy-cobalt text-lg font-black text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-black">{step.title}</h3>
              <p className="mt-2 text-sm font-medium text-ploy-text-secondary">
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
  { value: "1 → 42", label: "Enterprise customers at iControl in <18 months" },
  { value: "<5 → 80+", label: "Customers at Skore in 12 months" },
  { value: "2x", label: "Close rates at Instaroid in <90 days" },
  { value: "50%", label: "Faster enterprise sales cycle at Appreciation Engine" },
];

function ResultsSection() {
  return (
    <section id="results" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-ploy-red">
            Real outcomes
          </p>
          <h2 className="font-heading text-3xl font-black tracking-tight text-balance md:text-4xl">
            Founders don&apos;t hire me for theory.
          </h2>
          <p className="mt-4 text-lg font-medium text-ploy-text-secondary">
            Every engagement is measured in pipeline, close rates, and revenue —
            here&apos;s what that&apos;s looked like across the companies
            I&apos;ve worked with.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {DEFAULT_RESULTS.map((r) => (
              <div key={r.label} className="rounded-2xl bg-white p-5">
                <div className="text-2xl font-black text-ploy-cobalt">
                  {r.value}
                </div>
                <p className="mt-1 text-xs font-semibold leading-snug text-ploy-text-secondary">
                  {r.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-ploy-mint p-8">
          <LineChart className="h-8 w-8 text-ploy-mint-deep" />
          <h3 className="mt-4 text-2xl font-black leading-tight">
            Built for the messy early stage.
          </h3>
          <ul className="mt-6 space-y-4">
            {[
              "Pre-revenue to first repeatable deals",
              "Founder-led selling to a hired team",
              "Scrappy outbound to a real pipeline",
              "One-off wins to a forecastable motion",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ploy-mint-deep" />
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
      "In a matter of 4 months, using the learnings from the program, we landed a new six-figure client and beat out a number of established competitors.",
    name: "Christopher Coger",
    detail: "Founder",
  },
  {
    quote:
      "Juliana's approach helped me create a more relevant communication strategy with new customers that led to two F500 clients in a short 4 months.",
    name: "Cristina Sergi Knellinger",
    detail: "Sales Leader",
  },
];

function TestimonialSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 text-center font-heading text-3xl font-black tracking-tight text-balance md:text-4xl">
          What founders say after working together.
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {DEFAULT_TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-[1.5rem] bg-ploy-cream p-8"
            >
              <blockquote className="text-lg font-bold leading-relaxed text-ploy-text-primary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ploy-yellow text-sm font-black">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-extrabold">{t.name}</span>
                  <span className="block text-xs font-semibold text-ploy-text-secondary">
                    {t.detail}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
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
      <div className="relative overflow-hidden rounded-[2rem] bg-ploy-cobalt px-8 py-16 text-center text-white md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-6 top-8 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute right-10 top-10 h-12 w-12 rotate-6 rounded-xl bg-ploy-yellow/80" />
          <div className="absolute bottom-8 left-1/3 h-10 w-24 rounded-full bg-white/10" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl font-black leading-tight tracking-tight text-balance md:text-5xl">
            Ready to scale how you sell?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg font-medium text-white/85">
            Tell me where your sales motion is stuck. We&apos;ll map the fastest
            path to repeatable revenue on a free strategy call.
          </p>
          <a
            href="mailto:hello@julianacrispo.com"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-ploy-cobalt transition-colors hover:bg-white/90"
          >
            Book a strategy call <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ploy-border-primary">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ploy-cobalt text-xs font-black text-white">
            JC
          </span>
          <span className="text-sm font-bold">
            Juliana Crispo · Sales Advisory
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-ploy-text-secondary">
          <TrendingUp className="h-4 w-4 text-ploy-cobalt" />
          Helping founders sell since 2015.
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
