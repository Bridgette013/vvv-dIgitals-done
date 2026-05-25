import { Zap, CreditCard, ShieldOff } from "lucide-react";

const STRIPE_PAYMENT_LINK = "#REPLACE_WITH_STRIPE_PAYMENT_LINK";

export default function StorefrontStrike() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased selection:bg-yellow-400 selection:text-black">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.08),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

        <section className="relative mx-auto max-w-6xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="mb-8 inline-flex items-center gap-2 border border-yellow-400/40 bg-yellow-400/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-400">
            <span className="h-1.5 w-1.5 animate-pulse bg-yellow-400" />
            Ghost Build / 48 Hour Window
          </div>

          <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            You have an audience.
            <br />
            <span className="text-yellow-400">Let's build the machine</span>
            <br />
            that actually gets you paid.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Stop losing money to broken links and terrible checkout flows. Hand off the technical
            friction and start monetizing.
          </p>
        </section>

        <section className="relative mx-auto max-w-6xl px-6 pb-20">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/0 via-yellow-400/60 to-yellow-400/0 opacity-40 blur-lg transition duration-500 group-hover:opacity-70" />
            <div className="relative aspect-video w-full overflow-hidden border-2 border-yellow-400/80 bg-black shadow-[0_0_60px_-15px_rgba(250,204,21,0.5)]">
              <iframe
                className="h-full w-full"
                src="https://www.loom.com/embed/PLACEHOLDER_LOOM_ID"
                title="VVV Digitals Demo"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-12 flex items-end justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
              The Execution
            </h2>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              03 / Deliverables
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Deliverable
              icon={<Zap className="h-7 w-7" strokeWidth={2.5} />}
              number="01"
              title="48-Hour Turnaround"
              body="We build, wire, and deploy your Stan Store or Skool community in two days."
            />
            <Deliverable
              icon={<CreditCard className="h-7 w-7" strokeWidth={2.5} />}
              number="02"
              title="Stripe Integration"
              body="Seamless backend API wiring. You keep the cash flowing directly to your bank."
            />
            <Deliverable
              icon={<ShieldOff className="h-7 w-7" strokeWidth={2.5} />}
              number="03"
              title="Zero Friction"
              body="No scope creep. No retainers. Just a flat $497 to fix the plumbing."
            />
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-6 pb-32">
          <div className="border-2 border-yellow-400 bg-yellow-400/[0.03] p-8 sm:p-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
              Slots are limited. Lock yours.
            </p>
            <p className="mb-10 text-3xl font-black leading-tight sm:text-5xl">
              One payment. One build.
              <br />
              <span className="text-zinc-500">Live in 48 hours.</span>
            </p>

            <a
              href={STRIPE_PAYMENT_LINK}
              className="group relative block w-full overflow-hidden border-2 border-yellow-400 bg-yellow-400 px-8 py-7 text-center text-xl font-black uppercase tracking-wide text-black transition-all duration-200 hover:bg-black hover:text-yellow-400 hover:shadow-[0_0_40px_-5px_rgba(250,204,21,0.7)] sm:text-2xl"
            >
              <span className="relative z-10">Lock In Your Build Slot — $497</span>
            </a>

            <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-zinc-500">
              Secure checkout via Stripe / Instant confirmation
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Deliverable({ icon, number, title, body }) {
  return (
    <div className="group relative border border-zinc-800 bg-zinc-900/30 p-8 transition-all duration-300 hover:border-yellow-400 hover:bg-zinc-900/60">
      <div className="absolute right-6 top-6 text-xs font-bold tracking-widest text-zinc-700 transition-colors group-hover:text-yellow-400">
        {number}
      </div>
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 transition-all group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-black uppercase tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}
