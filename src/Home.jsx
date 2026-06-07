import { useState, useEffect, useRef } from "react";

const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const Reveal = ({ children, delay = 0, y = 36, className = "" }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.8s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>{children}</div>
  );
};

const Counter = ({ end, suffix = "" }) => {
  const [n, setN] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let s = 0; const step = end / 80;
    const t = setInterval(() => { s += step; if (s >= end) { setN(end); clearInterval(t); } else setN(Math.floor(s)); }, 20);
    return () => clearInterval(t);
  }, [inView]);
  return <span ref={ref}>{n}{suffix}</span>;
};

const SERVICES = [
  { code: "ITSM",   name: "IT Service Management",       desc: "Incident, Problem, Change & Request Management",          num: "01" },
  { code: "CSM",    name: "Customer Service Management",  desc: "Omnichannel customer support & case management",          num: "02" },
  { code: "FSM",    name: "Field Service Management",     desc: "Work orders, scheduling & field team optimization",       num: "03" },
  { code: "HRSD",   name: "HR Service Delivery",          desc: "Employee onboarding, offboarding & HR workflows",         num: "04" },
  { code: "ITAM",   name: "IT Asset Management",          desc: "Full asset lifecycle management",                         num: "05" },
  { code: "ITOM",   name: "IT Operations Management",     desc: "Infrastructure discovery, health & event management",     num: "06" },
  { code: "SecOps", name: "Security Operations",          desc: "Vulnerability response & security incident management",   num: "07" },
  { code: "GRC",    name: "Governance, Risk & Compliance",desc: "Risk management, audit & policy compliance",              num: "08" },
  { code: "SAM",    name: "Software Asset Management",    desc: "License management, compliance & cost control",           num: "09" },
  { code: "HAM",    name: "Hardware Asset Management",    desc: "Hardware tracking, lifecycle & compliance",               num: "10" },
  { code: "SOM",    name: "Service Operations Management",desc: "End-to-end service operations visibility",                num: "11" },
];

const TEAM = [
  { name: "Hari",      role: "Co-Founder & CEO",       desc: "Visionary leader and ServiceNow strategist driving the mission and growth of Nexus Hub.", initials: "H" },
  { name: "Gokul",     role: "Co-Founder & CTO",       desc: "Technical expert across ServiceNow modules, platform architecture, and enterprise integrations.", initials: "G" },
  { name: "Priya Raj", role: "Head of Operations",     desc: "Ensures seamless project delivery and exceptional client experience at every touchpoint.", initials: "PR" },
];

const REVIEWS = [
  { name: "Arjun Kumar", co: "TechBridge India",      role: "CEO",         q: "Nexus Hub transformed how our company manages IT. Their ITSM implementation was flawless and the team was incredibly responsive throughout." },
  { name: "Sunita Rao",  co: "Pinnacle Enterprises",  role: "COO",         q: "From HRSD to SecOps, Nexus Hub handled everything with precision. What impressed us most was how deeply they understood our business." },
  { name: "Vijay Mohan", co: "GlobalEdge Corp",       role: "IT Director", q: "Their 24/7 support is worth every rupee. We had a critical ServiceNow incident at 2AM and the Nexus Hub team resolved it within the hour." },
];

const WHY = [
  { n:"01", t:"Experienced Team",   d:"Deep ServiceNow expertise across all major modules and real enterprise implementations." },
  { n:"02", t:"Fast Delivery",      d:"Agile methodology ensures faster time-to-value without sacrificing quality." },
  { n:"03", t:"Affordable Pricing", d:"Competitive, transparent pricing for businesses of all sizes — no hidden costs." },
  { n:"04", t:"24/7 Support",       d:"Round-the-clock support so your ServiceNow platform never sleeps." },
  { n:"05", t:"Custom Solutions",   d:"No templates. Every implementation is tailored precisely to your business needs." },
  { n:"06", t:"Global Vision",      d:"Born in Tamil Nadu, India — built to serve clients across the globe." },
];

const NAV = ["Home","About","Services","Team","Reviews","Contact"];

export default function App() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIdx, setActiveIdx]  = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        .font-display  { font-family: 'Playfair Display', Georgia, serif; }
        .font-bebas    { font-family: 'Bebas Neue', sans-serif; letter-spacing:.04em; }
        .font-body     { font-family: 'Outfit', sans-serif; }
        *, body        { font-family: 'Outfit', sans-serif; }

        /* ── NAV ── */
        .nav-wrap { background:#fff; border-bottom:1px solid #e5e5e5; }
        .nav-link  { color:#111; font-weight:500; font-size:14px; transition:color .2s; position:relative; }
        .nav-link::after { content:''; position:absolute; left:0; bottom:-2px; width:0; height:2px; background:#111; transition:width .25s; }
        .nav-link:hover::after { width:100%; }
        .nav-link:hover { color:#000; }

        /* ── Buttons ── */
        .btn-dark  { background:#111; color:#fff; padding:13px 30px; border-radius:8px; font-weight:600; font-size:14px; border:none; cursor:pointer; transition:background .2s, transform .2s; display:inline-block; font-family:'Outfit',sans-serif; }
        .btn-dark:hover  { background:#000; transform:translateY(-1px); }
        .btn-ghost-dark  { background:transparent; color:#111; padding:13px 30px; border-radius:8px; font-weight:500; font-size:14px; border:1.5px solid #d0d0d0; cursor:pointer; transition:border-color .2s,color .2s; display:inline-block; }
        .btn-ghost-dark:hover { border-color:#111; color:#000; }
        .btn-light { background:#fff; color:#111; padding:13px 30px; border-radius:8px; font-weight:600; font-size:14px; border:none; cursor:pointer; transition:opacity .2s, transform .2s; display:inline-block; }
        .btn-light:hover { opacity:.88; transform:translateY(-1px); }
        .btn-ghost-light { background:transparent; color:#fff; padding:13px 30px; border-radius:8px; font-weight:500; font-size:14px; border:1.5px solid rgba(255,255,255,.3); cursor:pointer; transition:border-color .2s; display:inline-block; }
        .btn-ghost-light:hover { border-color:#fff; }

        /* ── HERO (grey bg) ── */
        .sec-hero    { background:#C8C8C8; }
        .sec-hero *  { color:#111; }
        .hero-tag    { display:inline-flex; align-items:center; gap:8px; background:#d8d8d8; border:1px solid #b0b0b0; border-radius:999px; padding:7px 18px; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#333; }
        .live-dot    { width:7px; height:7px; background:#22c55e; border-radius:50%; animation:livepulse 2s ease-in-out infinite; }
        @keyframes livepulse { 0%,100%{box-shadow:0 0 0 2px rgba(34,197,94,.3)} 50%{box-shadow:0 0 0 5px rgba(34,197,94,.08)} }
        .stat-val    { font-family:'Bebas Neue',sans-serif; font-size:52px; letter-spacing:.04em; color:#111; line-height:1; }
        .stat-lbl    { color:#555; font-size:13px; margin-top:4px; }
        .hero-divider{ height:1px; background:linear-gradient(90deg,transparent,#999,transparent); }
        .dot-grid-light { background-image:radial-gradient(#aaa 1px,transparent 1px); background-size:26px 26px; }

        /* ── MARQUEE ── */
        .marquee-wrap-dark  { background:#111; border-top:1px solid #222; border-bottom:1px solid #222; }
        .marquee-wrap-light { background:#C8C8C8; border-top:1px solid #b0b0b0; border-bottom:1px solid #b0b0b0; }
        .marquee { animation:marquee 24s linear infinite; white-space:nowrap; display:inline-block; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

        /* ── BLACK sections ── */
        .sec-black   { background:#111; }

        /* ── SERVICE rows (black bg) ── */
        .srv-row { border-bottom:1px solid rgba(255,255,255,.07); transition:background .2s; cursor:pointer; }
        .srv-row:hover { background:rgba(255,255,255,.04); }
        .srv-row:hover .srv-arr { opacity:1; transform:translateX(0); color:#fff; }
        .srv-arr { opacity:0; transform:translateX(-10px); transition:all .25s; }
        .srv-row:hover .srv-code { color:#fff; }
        .srv-code { color:rgba(255,255,255,.2); transition:color .25s; font-size:11px; font-family:'Outfit',monospace; }

        /* ── WHY cards (grey bg) ── */
        .why-card { border:1px solid #b0b0b0; border-radius:16px; padding:32px; background:#d4d4d4; transition:border-color .25s, box-shadow .25s, transform .25s; }
        .why-card:hover { border-color:#111; box-shadow:0 8px 32px rgba(0,0,0,.15); transform:translateY(-3px); }
        .why-num { font-family:'Bebas Neue',sans-serif; font-size:52px; color:#e8e8e8; line-height:1; }
        .why-card:hover .why-num { color:#111; }

        /* ── TEAM cards (black bg) ── */
        .team-card { border:1px solid rgba(255,255,255,.08); border-radius:20px; padding:36px; background:rgba(255,255,255,.02); transition:border-color .3s,transform .3s; }
        .team-card:hover { border-color:rgba(255,255,255,.3); transform:translateY(-4px); }
        .initials-ring { width:72px; height:72px; border-radius:50%; border:1.5px solid rgba(255,255,255,.2); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:20px; font-weight:700; background:rgba(255,255,255,.05); color:#fff; }

        /* ── REVIEW cards (grey bg) ── */
        .review-card { border:1px solid #b0b0b0; border-radius:16px; padding:32px; background:#d4d4d4; transition:border-color .25s, box-shadow .25s; }
        .review-card:hover { border-color:#111; box-shadow:0 6px 24px rgba(0,0,0,.15); }

        /* ── CTA (black bg) ── */
        .cta-inner { border:1px solid rgba(255,255,255,.1); border-radius:28px; }

        /* ── CONTACT (grey bg) ── */
        .ci { background:#d8d8d8; border:1.5px solid #aaa; color:#111; width:100%; padding:13px 18px; border-radius:10px; font-size:14px; font-family:'Outfit',sans-serif; transition:border-color .2s; }
        .ci:focus { outline:none; border-color:#111; background:#ccc; }
        .ci::placeholder { color:#777; }
        .contact-card { background:#d4d4d4; border:1px solid #b0b0b0; border-radius:20px; padding:36px; }

        /* ── FOOTER (black) ── */
        .footer-wrap { background:#111; border-top:1px solid #222; }

        .scroll-bob { animation:scrollBob 2.2s ease-in-out infinite; }
        @keyframes scrollBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        .line-deco { width:36px; height:2px; background:#fff; border-radius:2px; }
        .line-deco-dark { width:36px; height:2px; background:#111; border-radius:2px; }

        /* tag variants */
        .tag-dark  { display:inline-block; padding:4px 14px; border-radius:999px; font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; border:1px solid rgba(255,255,255,.15); color:rgba(255,255,255,.5); }
        .tag-light { display:inline-block; padding:4px 14px; border-radius:999px; font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; border:1px solid #999; color:#444; background:rgba(0,0,0,0.06); }

        .about-accordion { border:1.5px solid #222; border-radius:14px; padding:22px 24px; background:#1a1a1a; cursor:pointer; transition:border-color .2s, background .2s; }
        .about-accordion:hover { border-color:#fff; background:#222; }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#c8c8c8; }
        ::-webkit-scrollbar-thumb { background:#111; border-radius:2px; }
      `}</style>

      {/* ══════════════════════════════════════
          NAV — White background, black text
      ══════════════════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 nav-wrap transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <span className="text-white font-bebas text-lg leading-none">N</span>
            </div>
            <span className="font-display font-black text-xl text-black tracking-tight leading-none">
              NexusHub
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(l => (
              <button key={l} onClick={() => go(l)} className="nav-link font-body">{l}</button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="hero-tag">
              <div className="live-dot" />
              Open for Work
            </div>
            <button onClick={() => go("Contact")} className="btn-dark">Let's Talk →</button>
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className={`w-5 h-px bg-black mb-1.5 transition-all origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <div className={`w-5 h-px bg-black mb-1.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-px bg-black transition-all origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-6 flex flex-col gap-5">
            {NAV.map(l => <button key={l} onClick={() => go(l)} className="text-left text-black/70 hover:text-black text-sm font-medium font-body">{l}</button>)}
            <button onClick={() => go("Contact")} className="btn-dark text-center">Let's Talk →</button>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
          HERO — Grey background, black text
      ══════════════════════════════════════ */}
      <section id="home" className="sec-hero dot-grid-light relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10">
          <Reveal delay={0.05}>
            <div className="hero-tag mb-8">
              <div className="live-dot" />
              Tamil Nadu's Leading ServiceNow Partner
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 className="font-bebas text-[clamp(4rem,11vw,9.5rem)] leading-none tracking-wide text-black mb-2">
              Where Connections
            </h1>
            <h1 className="font-display italic text-[clamp(3rem,8vw,7rem)] leading-none text-black mb-8">
              Power Solutions
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="font-body text-black/50 text-lg max-w-xl leading-relaxed mb-12">
              A next-generation ServiceNow consulting firm helping businesses unlock the full power of the platform through expert implementation, support, and optimization.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="flex flex-wrap gap-4 mb-20">
              <button onClick={() => go("Services")} className="btn-dark">Explore Services →</button>
              <button onClick={() => go("About")} className="btn-ghost-dark">Our Story</button>
            </div>
          </Reveal>

          <div className="hero-divider mb-14" />

          <Reveal delay={0.4}>
            <div className="flex flex-wrap gap-12 md:gap-20">
              {[
                { val: 11, suf: "+", label: "ServiceNow Modules" },
                { val: 50, suf: "+", label: "Projects Delivered" },
                { val: 24, suf: "/7", label: "Support Coverage" },
                { val: 100, suf: "%", label: "Client Satisfaction" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="stat-val"><Counter end={s.val} suffix={s.suf} /></div>
                  <div className="stat-lbl font-body">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 scroll-bob flex flex-col items-center gap-2 text-black/25 text-[10px] uppercase tracking-widest font-body">
          <div className="w-px h-10 bg-gradient-to-b from-black/20 to-transparent" />
          Scroll
        </div>
      </section>

      {/* Marquee — dark */}
      <div className="marquee-wrap-dark py-4 overflow-hidden">
        <div className="marquee text-white/15 text-sm font-body font-medium tracking-widest uppercase">
          {Array(8).fill("ITSM · CSM · FSM · HRSD · ITAM · ITOM · SecOps · GRC · SAM · SOM · ServiceNow · Nexus Hub · ").join("")}
        </div>
      </div>

      {/* ══════════════════════════════════════
          ABOUT — Black background, white text
      ══════════════════════════════════════ */}
      <section id="about" className="sec-black py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <Reveal><div className="tag-dark mb-6">About Us</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bebas text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-wide text-white mb-2">India's Most</h2>
              <h2 className="font-display italic text-[clamp(2rem,4vw,3.8rem)] leading-tight text-white/80 mb-8">Focused Partner</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-body text-white/45 leading-relaxed mb-5">
                Founded in 2026 in Tamil Nadu by a passionate team of ServiceNow professionals. We specialize exclusively in the ServiceNow ecosystem — making us one of the most focused and capable partners in the region.
              </p>
              <p className="font-body text-white/30 leading-relaxed mb-10">
                Young, ambitious, and global in vision — built on the belief that the right implementation can unlock unlimited potential for any organization.
              </p>
              <button onClick={() => go("Contact")} className="btn-light">Work With Us →</button>
            </Reveal>
          </div>

          <div className="space-y-4 pt-4">
            {[
              { num:"01", title:"Mission", body:"Empower organizations with expert ServiceNow consulting that drives efficiency, automation, and sustainable growth — making enterprise-grade technology accessible to every business." },
              { num:"02", title:"Vision", body:"Become India's most trusted ServiceNow hub — a center of excellence where innovation meets execution, and every client achieves digital transformation at scale." },
              { num:"03", title:"Approach", body:"No templates, no shortcuts. Every engagement begins with deep discovery. We tailor every implementation to your exact business context, goals, and constraints." },
            ].map((item, i) => (
              <Reveal key={item.num} delay={i * 0.1}>
                <div className="about-accordion" onClick={() => setActiveIdx(activeIdx === i ? null : i)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-white/20 text-xs font-mono">{item.num}</span>
                      <span className="font-display font-bold text-white text-lg">{item.title}</span>
                    </div>
                    <span className="text-white/50 text-xl leading-none">{activeIdx === i ? "−" : "+"}</span>
                  </div>
                  {activeIdx === i && (
                    <p className="font-body text-white/40 text-sm leading-relaxed mt-4 pt-4 border-t border-white/8">{item.body}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES — Grey background, black text
      ══════════════════════════════════════ */}
      <section id="services" className="sec-hero py-32 border-t border-black/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <Reveal><div className="tag-light mb-4">What We Do</div></Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-bebas text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-wide text-black">ServiceNow</h2>
                <h2 className="font-display italic text-[clamp(2rem,4vw,3.5rem)] leading-tight text-black/70">Expertise</h2>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <p className="font-body text-black/40 max-w-xs text-sm leading-relaxed">End-to-end implementation across all major ServiceNow modules</p>
            </Reveal>
          </div>

          {/* Service rows on a white card */}
          <div className="bg-[#d4d4d4] rounded-2xl border border-[#b0b0b0] overflow-hidden">
            {SERVICES.map((s, i) => (
              <Reveal key={s.code} delay={i * 0.03}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#b8b8b8] last:border-0 hover:bg-[#bebebe] transition-colors group cursor-pointer">
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="text-black/20 text-xs font-mono w-6 text-right">{s.num}</span>
                    <div>
                      <span className="font-display font-bold text-black text-base md:text-lg mr-4">{s.name}</span>
                      <span className="hidden md:inline font-body text-black/35 text-sm">{s.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-mono font-600">{s.code}</span>
                    <span className="text-black/0 group-hover:text-black transition-all text-lg">→</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee — light */}
      <div className="marquee-wrap-light py-4 overflow-hidden">
        <div className="marquee text-black/20 text-sm font-body font-medium tracking-widest uppercase">
          {Array(8).fill("Experienced Team · Fast Delivery · Affordable · 24/7 Support · Custom Solutions · Global Vision · ").join("")}
        </div>
      </div>

      {/* ══════════════════════════════════════
          WHY US — Black background, white text
      ══════════════════════════════════════ */}
      <section className="sec-black py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16">
            <Reveal><div className="tag-dark mb-4">Why Choose Us</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bebas text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-wide text-white">Built Different.</h2>
              <h2 className="font-display italic text-[clamp(2rem,4vw,3.5rem)] leading-tight text-white/70">Delivers Better.</h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w, i) => (
              <Reveal key={w.n} delay={i * 0.08}>
                <div className="h-full p-8 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="font-bebas text-5xl text-white/10 leading-none mb-4">{w.n}</div>
                  <h3 className="font-display font-bold text-white text-xl mb-3">{w.t}</h3>
                  <div className="line-deco mb-4" />
                  <p className="font-body text-white/35 text-sm leading-relaxed">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TEAM — Grey background, black text
      ══════════════════════════════════════ */}
      <section id="team" className="sec-hero py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16">
            <Reveal><div className="tag-light mb-4">Our Team</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bebas text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-wide text-black">The People</h2>
              <h2 className="font-display italic text-[clamp(2rem,4vw,3.5rem)] leading-tight text-black/60">Behind Nexus Hub</h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.12}>
                <div className="bg-[#d4d4d4] border border-[#b0b0b0] rounded-2xl p-8 h-full hover:border-black hover:shadow-lg transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center font-display font-bold text-black text-lg mb-6 bg-gray-50">
                    {m.initials}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-black mb-1">{m.name}</h3>
                  <div className="font-body text-black/50 text-sm font-semibold mb-4">{m.role}</div>
                  <div className="line-deco-dark mb-4" />
                  <p className="font-body text-black/45 text-sm leading-relaxed">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          REVIEWS — Black background, white text
      ══════════════════════════════════════ */}
      <section id="reviews" className="sec-black py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16">
            <Reveal><div className="tag-dark mb-4">Testimonials</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bebas text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-wide text-white">What Our</h2>
              <h2 className="font-display italic text-[clamp(2rem,4vw,3.5rem)] leading-tight text-white/70">Clients Say</h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.12}>
                <div className="h-full p-8 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/25 transition-all duration-300">
                  <div className="flex gap-0.5 mb-6">
                    {Array.from({length:5}).map((_,j) => <span key={j} className="text-white text-base">★</span>)}
                  </div>
                  <p className="font-body text-white/50 text-sm leading-relaxed mb-8 italic">"{r.q}"</p>
                  <div className="border-t border-white/8 pt-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center font-display font-bold text-white text-xs">
                      {r.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-body font-600 text-white text-sm">{r.name}</div>
                      <div className="font-body text-white/30 text-xs">{r.role}, {r.co}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — Grey background, black text
      ══════════════════════════════════════ */}
      <section className="sec-hero py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl border-2 border-black bg-white p-16 md:p-24 text-center overflow-hidden">
              <div className="absolute inset-0 dot-grid-light opacity-50" />
              <div className="relative z-10">
                <div className="tag-light mx-auto mb-6">Ready to start?</div>
                <h2 className="font-bebas text-[clamp(3rem,7vw,6rem)] leading-none tracking-wide text-black mb-2">Transform Your</h2>
                <h2 className="font-display italic text-[clamp(2rem,5vw,4.5rem)] leading-tight text-black/70 mb-8">Operations Today</h2>
                <p className="font-body text-black/40 max-w-md mx-auto mb-10 text-sm leading-relaxed">
                  Let's talk about how Nexus Hub can unlock the full potential of ServiceNow for your organization.
                </p>
                <button onClick={() => go("contact")} className="btn-dark text-base px-10 py-4">Start Your Journey →</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT — Black background, white text
      ══════════════════════════════════════ */}
      <section id="contact" className="sec-black py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <Reveal><div className="tag-dark mb-6">Contact</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bebas text-[clamp(3rem,5vw,5rem)] leading-none tracking-wide text-white">Let's Build</h2>
              <h2 className="font-display italic text-[clamp(2rem,3.5vw,3.2rem)] leading-tight text-white/70 mb-8">Something Great</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-body text-white/35 text-sm leading-relaxed mb-12 max-w-sm">Reach out to discuss your ServiceNow needs. Our team responds within one business day.</p>
              <div className="space-y-5">
                {[
                  { label:"Phone",    val:"+91 98765 43210" },
                  { label:"Email",    val:"hari@nexushubglobalsolutions.com" },
                  { label:"General",  val:"info@nexushubglobalsolutions.com" },
                  { label:"Location", val:"Sulur, Coimbatore, Tamil Nadu — 641402" },
                  { label:"Hours",    val:"Mon–Fri 9AM–6PM IST · Support 24/7" },
                ].map(c => (
                  <div key={c.label} className="flex gap-5 items-start">
                    <span className="font-mono text-white/20 text-xs w-16 pt-0.5 shrink-0">{c.label}</span>
                    <span className="font-body text-white/60 text-sm">{c.val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-10">
                {[["in","LinkedIn"],["tw","Twitter"],["ig","Instagram"],["yt","YouTube"]].map(([s,l]) => (
                  <div key={s} title={l} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-xs text-white/25 hover:border-white/40 hover:text-white transition-all cursor-pointer font-mono">{s}</div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-8">
              <h3 className="font-display font-bold text-white text-xl mb-8">Send a Message</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-white/30 text-xs mb-2 block">First Name</label>
                    <input className="ci" placeholder="Arjun" />
                  </div>
                  <div>
                    <label className="font-body text-white/30 text-xs mb-2 block">Last Name</label>
                    <input className="ci" placeholder="Kumar" />
                  </div>
                </div>
                <div>
                  <label className="font-body text-white/30 text-xs mb-2 block">Email Address</label>
                  <input className="ci" placeholder="arjun@company.com" />
                </div>
                <div>
                  <label className="font-body text-white/30 text-xs mb-2 block">Module of Interest</label>
                  <select className="ci">
                    <option value="">Select a module...</option>
                    {SERVICES.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-white/30 text-xs mb-2 block">Message</label>
                  <textarea className="ci resize-none" rows={4} placeholder="Tell us about your project..." />
                </div>
                <button className="btn-light w-full text-center font-body">Send Message →</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER — Black
      ══════════════════════════════════════ */}
      <footer className="footer-wrap py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <span className="font-bebas text-black text-sm leading-none">N</span>
            </div>
            <span className="font-display font-black text-white text-sm">NexusHub <span className="text-white/40">Global Solutions</span></span>
          </div>
          <p className="font-body text-white/20 text-xs text-center">© 2026 Nexus Hub Global Solutions · Sulur, Tamil Nadu, India</p>
          <div className="flex gap-6">
            {NAV.map(l => <button key={l} onClick={() => go(l)} className="font-body text-white/20 hover:text-white/60 text-xs transition-colors">{l}</button>)}
          </div>
        </div>
      </footer>
    </div>
  );
}