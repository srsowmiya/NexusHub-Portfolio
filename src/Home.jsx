import { useState, useEffect, useRef } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

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

const SERVICES = [
  { code: "ITSM",   name: "IT Service Management",        desc: "Incident, Problem, Change & Request Management",         num: "01" },
  { code: "CSM",    name: "Customer Service Management",   desc: "Omnichannel customer support & case management",         num: "02" },
  { code: "FSM",    name: "Field Service Management",      desc: "Work orders, scheduling & field team optimization",      num: "03" },
  { code: "HRSD",   name: "HR Service Delivery",           desc: "Employee onboarding, offboarding & HR workflows",        num: "04" },
  { code: "ITAM",   name: "IT Asset Management",           desc: "Full asset lifecycle management",                        num: "05" },
  { code: "ITOM",   name: "IT Operations Management",      desc: "Infrastructure discovery, health & event management",    num: "06" },
  { code: "SecOps", name: "Security Operations",           desc: "Vulnerability response & security incident management",  num: "07" },
  { code: "GRC",    name: "Governance, Risk & Compliance", desc: "Risk management, audit & policy compliance",             num: "08" },
  { code: "SAM",    name: "Software Asset Management",     desc: "License management, compliance & cost control",          num: "09" },
  { code: "HAM",    name: "Hardware Asset Management",     desc: "Hardware tracking, lifecycle & compliance",              num: "10" },
  { code: "SOM",    name: "Sales Operations Management",   desc: "End-to-end service operations visibility",               num: "11" },
];

const TEAM = [
  {
    name: "Hari",
    role: "Founder & CEO",
    initials: "H",
    photo: "/images/Hari.png",
    desc: "Visionary leader and ServiceNow strategist driving the mission and growth of Nexus Hub.",
    experience: "8+ Years",
    location: "Coimbatore, India",
    expertise: ["ServiceNow Strategy", "Business Development", "Enterprise Architecture", "Digital Transformation"],
    about: "Hari is the driving force behind Nexus Hub Global Solutions. With over 8 years of experience in the ServiceNow ecosystem, he has led end-to-end implementations for enterprise clients across India and internationally. His vision is to make Nexus Hub the go-to ServiceNow partner for businesses seeking reliable, tailored, and scalable solutions.",
    modules: ["ITSM", "CSM", "HRSD", "GRC"],
  },
  {
    name: "Gokul",
    role: "Co-Founder & CTO",
    initials: "G",
    photo: "/images/Gokul.jpeg",
    desc: "Technical expert across ServiceNow modules, platform architecture, and enterprise integrations.",
    experience: "7+ Years",
    location: "Coimbatore, India",
    expertise: ["Platform Architecture", "API Integrations", "ServiceNow Development", "SecOps & ITOM"],
    about: "Gokul is the technical backbone of Nexus Hub. He specializes in deep ServiceNow platform customization, complex enterprise integrations, and building scalable architectures. His hands-on experience across 11+ modules ensures every implementation is built to last.",
    modules: ["ITOM", "SecOps", "SAM", "HAM", "ITAM"],
  },
  {
    name: "Priya Raj",
    role: "Head of Operations",
    initials: "PR",
    photo: null,
    desc: "Ensures seamless project delivery and exceptional client experience at every touchpoint.",
    experience: "6+ Years",
    location: "Coimbatore, India",
    expertise: ["Project Management", "Client Relations", "Agile Delivery", "Quality Assurance"],
    about: "Priya Raj oversees the operational engine of Nexus Hub. She ensures every project is delivered on time, within scope, and to the highest quality standards. Her client-first mindset and process discipline have been key to the company's 100% satisfaction record.",
    modules: ["FSM", "HRSD", "SOM", "CSM"],
  },
];

const WHY = [
  { t:"Experienced Team",   d:"Deep ServiceNow expertise across all major modules and real enterprise implementations. Our consultants have delivered projects across ITSM, CSM, HRSD, SecOps, and more.", highlight:"5+ years avg. experience" },
  { t:"Fast Delivery",      d:"Agile delivery methodology ensures faster time-to-value without sacrificing quality. We work in sprints, deliver early, and iterate quickly to meet your deadlines.", highlight:"30% faster than industry avg." },
  { t:"Affordable Pricing", d:"Competitive, transparent pricing for businesses of all sizes — no hidden costs, no surprises. We offer flexible engagement models from fixed-price to time & material.", highlight:"Flexible engagement models" },
  { t:"24/7 Support",       d:"Round-the-clock support so your ServiceNow platform never sleeps. Our dedicated support team is always on call — critical incidents are resolved within the hour.", highlight:"< 1hr critical response time" },
  { t:"Custom Solutions",   d:"No templates, no copy-paste implementations. Every engagement begins with deep discovery. We tailor every workflow, integration, and UI to your exact business context.", highlight:"100% tailored implementations" },
  { t:"Global Vision",      d:"Born in India — built to serve clients across the globe. We combine local understanding with international delivery standards and best practices.", highlight:"Clients across 5+ countries" },
];

const NAV = ["Home","About","Services","Team","Contact"];

/* ── Custom Multi-Select Dropdown ── */
const ModuleDropdown = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (s) => {
    setSelected(prev =>
      prev.find(x => x.code === s.code)
        ? prev.filter(x => x.code !== s.code)
        : [...prev, s]
    );
  };

  const isSelected = (code) => selected.some(x => x.code === code);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ci w-full text-left flex items-center justify-between"
        style={{cursor:"pointer", minHeight:"48px", height:"auto", padding:"10px 18px"}}
      >
        <div style={{flex:1, display:"flex", flexWrap:"wrap", gap:"5px", minHeight:"22px"}}>
          {selected.length === 0 ? (
            <span style={{color:"#777", fontSize:"14px", lineHeight:"22px"}}>Select modules...</span>
          ) : (
            selected.map(s => (
              <span key={s.code} style={{
                display:"inline-flex", alignItems:"center", gap:"5px",
                background:"#2C1810", color:"#fff", fontSize:"11px", fontFamily:"monospace",
                fontWeight:"700", padding:"3px 8px", borderRadius:"6px", letterSpacing:".03em",
              }}>
                {s.code}
                <span
                  onClick={(e) => { e.stopPropagation(); toggle(s); }}
                  style={{cursor:"pointer", opacity:0.5, fontSize:"12px", lineHeight:1, marginLeft:"2px"}}
                >×</span>
              </span>
            ))
          )}
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"8px", flexShrink:0, marginLeft:"8px"}}>
          {selected.length > 0 && (
            <span style={{background:"rgba(0,0,0,0.15)", color:"#555", fontSize:"10px", fontWeight:"700", padding:"2px 7px", borderRadius:"999px"}}>
              {selected.length}
            </span>
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2"
            style={{transition:"transform .25s", transform: open ? "rotate(180deg)" : "rotate(0deg)"}}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:50,
          background:"#1a1a1a", border:"1.5px solid #333", borderRadius:"12px",
          overflow:"hidden", boxShadow:"0 16px 48px rgba(0,0,0,0.4)",
          maxHeight:"320px", overflowY:"auto",
        }}>
          <div style={{padding:"8px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:"10px"}}>
            <button type="button" onClick={() => setSelected([...SERVICES])}
              style={{background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:"11px", cursor:"pointer", fontFamily:"'Outfit',sans-serif", padding:0}}>
              Select all
            </button>
            <span style={{color:"rgba(255,255,255,0.15)"}}>·</span>
            <button type="button" onClick={() => setSelected([])}
              style={{background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:"11px", cursor:"pointer", fontFamily:"'Outfit',sans-serif", padding:0}}>
              Clear
            </button>
          </div>

          {SERVICES.map((s) => {
            const checked = isSelected(s.code);
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => toggle(s)}
                style={{
                  display:"flex", alignItems:"center", gap:"12px", width:"100%",
                  padding:"11px 16px", background: checked ? "rgba(255,255,255,0.05)" : "transparent",
                  border:"none", cursor:"pointer", textAlign:"left",
                  borderBottom:"1px solid rgba(255,255,255,0.04)",
                  transition:"background .15s",
                }}
                onMouseEnter={e => { if (!checked) e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!checked) e.currentTarget.style.background="transparent"; }}
              >
                <div style={{
                  width:"16px", height:"16px", borderRadius:"4px", flexShrink:0,
                  border: checked ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  background: checked ? "#fff" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .15s",
                }}>
                  {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span style={{
                  padding:"2px 8px", borderRadius:"6px",
                  background: checked ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
                  color: checked ? "#fff" : "rgba(255,255,255,0.6)",
                  fontSize:"11px", fontFamily:"monospace", fontWeight:"700", flexShrink:0,
                  letterSpacing:".03em",
                }}>{s.code}</span>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{color: checked ? "#fff" : "rgba(255,255,255,0.75)", fontSize:"13px", fontWeight:"500", fontFamily:"'Outfit',sans-serif"}}>{s.name}</div>
                  <div style={{color:"rgba(255,255,255,.25)", fontSize:"11px", fontFamily:"'Outfit',sans-serif", marginTop:"1px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeIdx, setActiveIdx]   = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Contact form state
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [formModules, setFormModules] = useState([]);
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendMessage = async () => {
    if (!formData.firstName || !formData.email) {
      setFormStatus("error_validation");
      return;
    }
    setFormStatus("sending");
    try {
      await addDoc(collection(db, "contacts"), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        modules: formModules.map(m => m.code),
        message: formData.message,
        submittedAt: serverTimestamp(),
      });
      setFormStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
      setFormModules([]);
    } catch (err) {
      console.error("Firestore error:", err);
      setFormStatus("error");
    }
  };

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  const go = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleMemberClick = (m) => {
    setSelectedMember(prev => prev?.name === m.name ? null : m);
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
        .nav-wrap { background:#2C1810; border-bottom:none; }
        .nav-link  { color:#FFF; font-weight:500; font-size:14px; transition:color .2s; position:relative; }
        .nav-link::after { content:''; position:absolute; left:0; bottom:-2px; width:0; height:2px; background:#FF6B35; transition:width .25s; }
        .nav-link:hover::after { width:100%; }
        .nav-link:hover { color:#FF6B35; }

        /* ── Buttons ── */
        .btn-dark  { background:#2C1810; color:#fff; padding:13px 30px; border-radius:8px; font-weight:600; font-size:14px; border:none; cursor:pointer; transition:background .2s, transform .2s; display:inline-block; font-family:'Outfit',sans-serif; }
        .btn-dark:hover  { background:#3E2723; transform:translateY(-1px); }
        .btn-ghost-dark  { background:transparent; color:#2C1810; padding:13px 30px; border-radius:8px; font-weight:500; font-size:14px; border:1.5px solid #d0d0d0; cursor:pointer; transition:border-color .2s,color .2s; display:inline-block; }
        .btn-ghost-dark:hover { border-color:#2C1810; color:#2C1810; }
        .btn-light { background:#FF6B35; color:#fff; padding:13px 30px; border-radius:8px; font-weight:600; font-size:14px; border:none; cursor:pointer; transition:opacity .2s, transform .2s; display:inline-block; }
        .btn-light:hover { background:#E55A25; transform:translateY(-1px); }
        .btn-ghost-light { background:transparent; color:#fff; padding:13px 30px; border-radius:8px; font-weight:500; font-size:14px; border:1.5px solid rgba(255,255,255,.3); cursor:pointer; transition:border-color .2s; display:inline-block; }
        .btn-ghost-light:hover { border-color:#FF6B35; }

        /* ── GREY sections ── */
        .sec-hero    { background:#C8C8C8; }
        .hero-tag    { display:inline-flex; align-items:center; gap:8px; background:#d8d8d8; border:1px solid #b0b0b0; border-radius:999px; padding:7px 18px; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#333; }
        .hero-divider{ height:1px; background:linear-gradient(90deg,transparent,#999,transparent); }
        .dot-grid-light { background-image:radial-gradient(#aaa 1px,transparent 1px); background-size:26px 26px; }
        .live-dot { width:7px; height:7px; background:#FF6B35; border-radius:50%; display:inline-block; animation:livepulse 2s ease-in-out infinite; flex-shrink:0; }
        @keyframes livepulse { 0%,100%{box-shadow:0 0 0 2px rgba(255,107,53,.3)} 50%{box-shadow:0 0 0 5px rgba(255,107,53,.1)} }

        /* ── BUTTONS always enforce their own text color ── */
        .btn-dark, .btn-dark:hover, .btn-dark:focus  { color:#fff !important; }
        .btn-ghost-dark, .btn-ghost-dark:hover       { color:#2C1810 !important; }
        .btn-light, .btn-light:hover                 { color:#2C1810 !important; }
        .btn-ghost-light, .btn-ghost-light:hover     { color:#fff !important; }

        /* ── Service code badges always white text ── */
        .svc-badge { background:#2C1810; color:#fff !important; padding:3px 10px; border-radius:999px; font-size:11px; font-family:monospace; font-weight:700; letter-spacing:.04em; display:inline-block; }

        /* ── MARQUEE ── */
        .marquee-wrap-dark  { background:#2C1810; border-top:1px solid #1a0f0a; border-bottom:1px solid #1a0f0a; }
        .marquee-wrap-light { background:#C8C8C8; border-top:1px solid #b0b0b0; border-bottom:1px solid #b0b0b0; }
        .marquee-wrap-dark  .marquee-text { color:rgba(255,255,255,0.35) !important; }
        .marquee-wrap-light .marquee-text { color:rgba(0,0,0,0.7) !important; }
        .marquee { animation:marquee 24s linear infinite; white-space:nowrap; display:inline-block; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

        /* ── CHOCOLATE BROWN sections ── */
        .sec-black   { background:#2C1810; }

        /* ── ABOUT accordions ── */
        .about-accordion { border:1.5px solid #3E2723; border-radius:14px; padding:22px 24px; background:#3E2723; cursor:pointer; transition:border-color .25s, background .25s, transform .25s, box-shadow .25s; position:relative; overflow:hidden; }
        .about-accordion::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:#FF6B35; border-radius:3px 0 0 3px; transform:scaleY(0); transition:transform .25s cubic-bezier(.22,1,.36,1); transform-origin:center; }
        .about-accordion:hover { border-color:#FF6B35; background:#4A2F27; transform:translateX(4px); box-shadow: -4px 0 16px rgba(255,107,53,0.25); }
        .about-accordion:hover::before { transform:scaleY(1); }

        /* ── TEAM ── */
        .team-card { cursor:pointer; transition: border-color .25s, transform .25s, box-shadow .25s; position:relative; }
        .team-card:hover { border-color:#FF6B35 !important; box-shadow: 0 8px 28px rgba(255,107,53,0.2); transform:translateY(-3px); }
        .team-card.active { border-color:#FF6B35 !important; box-shadow: 0 0 0 2px #FF6B35; }
        .team-card-hover-hint { position:absolute; bottom:12px; right:14px; background:#2C1810; color:#fff !important; font-size:10px; font-family:'Outfit',sans-serif; font-weight:600; padding:4px 10px; border-radius:999px; opacity:0; transition:opacity .2s; pointer-events:none; letter-spacing:.03em; white-space:nowrap; }
        .team-card:hover .team-card-hover-hint { opacity:1; }
        .member-panel { background:#2C1810; border-radius:20px; overflow:hidden; transition: opacity .4s ease, transform .4s cubic-bezier(.22,1,.36,1); }
        .member-panel.entering { opacity:0; transform:translateX(20px); }
        .member-panel.entered  { opacity:1; transform:translateX(0); }
        .expertise-tag { display:inline-block; padding:5px 12px; border-radius:999px; border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.55); font-size:12px; font-family:'Outfit',sans-serif; }
        .module-chip { display:inline-block; padding:4px 10px; border-radius:6px; background:rgba(255,107,53,.15); color:#FF6B35; font-size:11px; font-family:monospace; font-weight:600; letter-spacing:.04em; border:1px solid rgba(255,107,53,.4); }

        /* ── decorators ── */
        .line-deco { width:36px; height:2px; background:#FF6B35; border-radius:2px; }
        .line-deco-dark { width:36px; height:2px; background:#FF6B35; border-radius:2px; }

        /* ── CONTACT inputs ── */
        .ci { background:#d8d8d8; border:1.5px solid #aaa; color:#111; width:100%; padding:13px 18px; border-radius:10px; font-size:14px; font-family:'Outfit',sans-serif; transition:border-color .2s, background .2s; }
        .ci:focus { outline:none; border-color:#FF8C42; background:#ccc; }
        .ci::placeholder { color:#777; }
        .ci option { background:#d8d8d8; color:#111; }

        /* scrollbar */
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#c8c8c8; }
        ::-webkit-scrollbar-thumb { background:#2C1810; border-radius:2px; }

        /* tag variants */
        .tag-dark  { display:inline-block; padding:4px 14px; border-radius:999px; font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; border:1px solid rgba(255,255,255,.15); color:rgba(255,255,255,.5); }
        .tag-light { display:inline-block; padding:4px 14px; border-radius:999px; font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; border:1px solid #999; color:#444; background:rgba(0,0,0,0.06); }

        /* footer */
        .footer-wrap { background:#2C1810; border-top:1px solid #1a0f0a; }
      `}</style>

      {/* ══════════════════════════════════════
          NAV — chocolate brown with logo and wavy bottom
      ══════════════════════════════════════ */}
      <header className={`relative left-0 right-0 z-50 nav-wrap transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}>
        <div className="flex items-center justify-between h-28 md:h-40 w-full" style={{paddingLeft: "0px", paddingRight: "40px"}}>
          <div className="flex items-center gap-3" style={{marginLeft: "0", paddingLeft: "0"}}>
            <img src="/images/logo.png" alt="Nexus Hub Logo" style={{height:"110px", width:"auto", maxWidth:"750px", objectFit:"contain"}} />
            <span className="font-bebas text-[clamp(1.5rem,4vw,2.8rem)] leading-none" style={{color:"#FF6B35", letterSpacing:"0.04em"}}>NexusHub</span>
          </div>

          {/* Nav — centre */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(l => (
              <button key={l} onClick={() => go(l)} className="nav-link font-body">{l}</button>
            ))}
          </nav>

          {/* CTA — right */}
          <div className="hidden md:flex items-center gap-3">
            <div className="hero-tag" style={{gap:"8px"}}>
              <span className="live-dot" />
              Open to work
            </div>
            <button onClick={() => go("Contact")} className="btn-dark" style={{background:"#FF6B35"}} onMouseEnter={(e) => e.target.style.background="#E55A25"} onMouseLeave={(e) => e.target.style.background="#FF6B35"}>Let's Talk →</button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className={`w-5 h-px bg-white mb-1.5 transition-all origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <div className={`w-5 h-px bg-white mb-1.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-px bg-white transition-all origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>

        {/* Wavy Bottom - Much More Wavy */}
        <svg className="w-full h-20 md:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{display:"block"}}>
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2C1810" />
              <stop offset="100%" stopColor="#2C1810" />
            </linearGradient>
          </defs>
          <path d="M0,60 Q150,-20 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z" fill="#2C1810" />
          <path d="M0,70 Q150,-10 300,70 T600,70 T900,70 T1200,70 L1200,120 L0,120 Z" fill="#C8C8C8" opacity="1" />
        </svg>

        {mobileOpen && (
          <div className="md:hidden bg-[#2C1810] border-t border-[#1a0f0a] px-6 py-6 flex flex-col gap-5">
            {NAV.map(l => <button key={l} onClick={() => go(l)} className="text-left text-white/70 hover:text-white text-sm font-medium font-body">{l}</button>)}
            <button onClick={() => go("Contact")} className="btn-dark text-center" style={{background:"#FF6B35"}} onMouseEnter={(e) => e.target.style.background="#E55A25"} onMouseLeave={(e) => e.target.style.background="#FF6B35"}>Let's Talk →</button>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
          1. HERO — buttons moved up, no overlap
      ══════════════════════════════════════ */}
      <section id="home" className="sec-hero dot-grid-light relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">

            {/* ── LEFT — content ── */}
            <div className="flex-1 lg:pr-10 pb-16 lg:pb-0">
              <Reveal delay={0.05}>
                <div className="hero-tag mb-6">Leading ServiceNow Firm</div>
              </Reveal>
              <Reveal delay={0.15}>
                <h1 className="font-bebas text-[clamp(3.5rem,9vw,8rem)] leading-none tracking-wide text-black mb-2">
                  Where Connections
                </h1>
                <h1 className="font-display italic text-[clamp(2.5rem,6vw,5.5rem)] leading-none text-black mb-5">
                  Power Solutions
                </h1>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="font-body text-black/50 text-lg max-w-xl leading-relaxed mb-6">
                  A next-generation ServiceNow consulting firm helping businesses unlock the full power of the platform through expert implementation, support, and optimization.
                </p>
              </Reveal>
              {/* Buttons pulled up with reduced margin so they don't overlap next section */}
              <Reveal delay={0.32}>
                <div className="flex flex-wrap gap-4 mb-10">
                  <button onClick={() => go("Services")} className="btn-dark">Explore Services →</button>
                  <button onClick={() => go("About")} className="btn-ghost-dark">Our Story</button>
                </div>
              </Reveal>
            </div>

            {/* ── RIGHT — Lottie animation + floating ServiceNow badge ── */}
            <div className="flex-1 flex items-center justify-end w-full" style={{minHeight:"520px", position:"relative"}}>
              <lottie-player
                src="https://assets2.lottiefiles.com/packages/lf20_iorpbol0.json"
                background="transparent"
                speed="1"
                style={{width:"110%", height:"600px", marginRight:"-40px"}}
                loop
                autoplay
              />
              {/* Floating ServiceNow badge */}
              <div style={{
                position:"absolute",
                bottom:"22%",
                left:"12%",
                animation:"floatSN 4s ease-in-out infinite",
                zIndex:10,
                pointerEvents:"none",
                transform:"rotate(-8deg)",
              }}>
                <div style={{position:"relative", width:"58px", height:"58px"}}>
                  <div style={{
                    position:"absolute", top:"6px", left:"6px",
                    width:"58px", height:"58px", background:"#FF6B35",
                    borderRadius:"13px", transform:"skewY(-4deg)",
                  }} />
                  <div style={{
                    position:"absolute", top:"3px", left:"3px",
                    width:"58px", height:"58px", background:"#FF7F4D",
                    borderRadius:"13px", transform:"skewY(-2deg)",
                  }} />
                  <div style={{
                    position:"absolute", top:"0px", left:"0px",
                    width:"58px", height:"58px", background:"#FF8C5A",
                    borderRadius:"13px", display:"flex", alignItems:"center",
                    justifyContent:"center", flexDirection:"column", gap:"1px",
                  }}>
                    <span style={{color:"#fff", fontSize:"10px", fontWeight:"900", fontFamily:"'Bebas Neue','Outfit',sans-serif", letterSpacing:".05em", lineHeight:1, textShadow:"0 1px 2px rgba(0,0,0,0.2)"}}>Service</span>
                    <span style={{color:"#fff", fontSize:"10px", fontWeight:"900", fontFamily:"'Bebas Neue','Outfit',sans-serif", letterSpacing:".05em", lineHeight:1, textShadow:"0 1px 2px rgba(0,0,0,0.2)"}}>Now</span>
                  </div>
                </div>
              </div>
              <style>{`
                @keyframes floatSN {
                  0%,100% { transform: rotate(-8deg) translateY(0px); }
                  50%     { transform: rotate(-8deg) translateY(-14px); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee — DARK */}
      <div className="marquee-wrap-dark py-4 overflow-hidden">
        <div className="marquee marquee-text text-sm font-body font-medium tracking-widest uppercase">
          {Array(8).fill("ITSM · CSM · FSM · HRSD · ITAM · ITOM · SecOps · GRC · SAM · SOM · ServiceNow · Nexus Hub · ").join("")}
        </div>
      </div>

      {/* ══════════════════════════════════════
          2. ABOUT — CHOCOLATE BROWN bg, white text
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
                Founded in 2026 in India by a passionate team of ServiceNow professionals. We specialize exclusively in the ServiceNow ecosystem — making us one of the most focused and capable partners in the region.
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

      {/* Marquee — LIGHT */}
      <div className="marquee-wrap-light py-4 overflow-hidden">
        <div className="marquee marquee-text text-sm font-body font-medium tracking-widest uppercase">
          {Array(8).fill("ITSM · CSM · FSM · HRSD · ITAM · ITOM · SecOps · GRC · SAM · SOM · ServiceNow · Nexus Hub · ").join("")}
        </div>
      </div>

      {/* ══════════════════════════════════════
          3. SERVICES — GREY bg
      ══════════════════════════════════════ */}
      <section id="services" className="sec-hero py-32">
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
                    <span className="svc-badge">{s.code}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee — DARK */}
      <div className="marquee-wrap-dark py-4 overflow-hidden">
        <div className="marquee marquee-text text-sm font-body font-medium tracking-widest uppercase">
          {Array(8).fill("Experienced Team · Fast Delivery · Affordable · 24/7 Support · Custom Solutions · Global Vision · ").join("")}
        </div>
      </div>

      {/* ══════════════════════════════════════
          4. WHY US — CHOCOLATE BROWN bg, NO icons
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
              <Reveal key={w.t} delay={i * 0.08}>
                <div className="h-full p-8 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-[#FF6B35] hover:bg-white/[0.05] transition-all duration-300 flex flex-col">
                  {/* Number instead of icon */}
                  <div style={{fontSize:"11px", fontFamily:"monospace", color:"#FF6B35", fontWeight:"700", letterSpacing:".1em", marginBottom:"16px"}}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display font-bold text-white text-xl mb-3">{w.t}</h3>
                  <div className="line-deco mb-4" />
                  <p className="font-body text-white/40 text-sm leading-relaxed mb-5 flex-1">{w.d}</p>
                  <div style={{display:"inline-flex", alignItems:"center", gap:"6px", padding:"6px 12px", borderRadius:"8px", background:"rgba(255,107,53,0.15)", border:"1px solid rgba(255,107,53,0.4)", width:"fit-content"}}>
                    <div style={{width:"5px", height:"5px", borderRadius:"50%", background:"#FF6B35", flexShrink:0}} />
                    <span style={{color:"#FF6B35", fontSize:"11px", fontFamily:"'Outfit',sans-serif", fontWeight:500}}>{w.highlight}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee — LIGHT */}
      <div className="marquee-wrap-light py-4 overflow-hidden">
        <div className="marquee marquee-text text-sm font-body font-medium tracking-widest uppercase">
          {Array(8).fill("Experienced Team · Fast Delivery · Affordable · 24/7 Support · Custom Solutions · Global Vision · ").join("")}
        </div>
      </div>

      {/* ══════════════════════════════════════
          5. TEAM — GREY bg
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

          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <div className={`flex flex-col gap-4 transition-all duration-500 ${selectedMember ? "lg:w-[340px] shrink-0" : "w-full grid grid-cols-1 md:grid-cols-3"}`}
              style={selectedMember ? {} : {display:"grid"}}>
              {TEAM.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.1}>
                  <div
                    onClick={() => handleMemberClick(m)}
                    className={`team-card bg-[#d4d4d4] border border-[#b0b0b0] rounded-2xl p-7 h-full ${selectedMember?.name === m.name ? "active" : ""}`}
                    style={{cursor:"pointer"}}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center font-display font-bold text-black text-base bg-[#c8c8c8] shrink-0">
                        {m.initials}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl text-black">{m.name}</h3>
                        <div className="font-body text-black/50 text-sm font-semibold">{m.role}</div>
                      </div>
                      <div className="ml-auto text-black/30 text-lg transition-transform duration-300" style={{transform: selectedMember?.name === m.name ? "rotate(45deg)" : "rotate(0)"}}>+</div>
                    </div>
                    <div className="line-deco-dark mb-3" />
                    <p className="font-body text-black/45 text-sm leading-relaxed">{m.desc}</p>
                    <div className="team-card-hover-hint">Click to know about {m.name}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            {selectedMember && (
              <div className="member-panel entered flex-1 min-w-0 flex flex-col" style={{background:"#2C1810", borderRadius:"16px", overflow:"hidden"}}>
                <div style={{padding:"22px 22px 18px 22px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0}}>
                  <div>
                    <h3 className="font-display font-bold text-white" style={{fontSize:"1.4rem", lineHeight:1.15, marginBottom:"4px"}}>{selectedMember.name}</h3>
                    <div className="font-body text-white/40" style={{fontSize:"12px"}}>{selectedMember.role}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedMember(null); }}
                    style={{background:"rgba(255,107,53,0.15)", border:"1px solid rgba(255,107,53,0.3)", borderRadius:"8px", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", color:"#FF6B35", fontSize:"16px", cursor:"pointer", flexShrink:0, lineHeight:1}}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(255,107,53,0.25)"; e.currentTarget.style.color="#FF6B35"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="rgba(255,107,53,0.15)"; e.currentTarget.style.color="#FF6B35"; }}
                  >×</button>
                </div>
                <div style={{display:"flex", flex:1, minHeight:0, overflow:"hidden"}}>
                  <div style={{flex:1, minWidth:0, padding:"22px 24px", overflowY:"auto", display:"flex", flexDirection:"column", gap:"20px"}}>
                    <div style={{display:"flex", gap:"20px", flexWrap:"wrap"}}>
                      <div>
                        <div style={{color:"rgba(255,255,255,0.22)", fontSize:"9px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:".1em", marginBottom:"4px"}}>Experience</div>
                        <div className="font-body text-white" style={{fontSize:"14px", fontWeight:600}}>{selectedMember.experience}</div>
                      </div>
                      <div style={{width:"1px", background:"rgba(255,255,255,0.08)"}} />
                      <div>
                        <div style={{color:"rgba(255,255,255,0.22)", fontSize:"9px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:".1em", marginBottom:"4px"}}>Based in</div>
                        <div className="font-body text-white" style={{fontSize:"14px", fontWeight:600}}>{selectedMember.location}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{color:"rgba(255,255,255,0.22)", fontSize:"9px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:".1em", marginBottom:"8px"}}>About</div>
                      <p className="font-body text-white/55" style={{fontSize:"13px", lineHeight:"1.75"}}>{selectedMember.about}</p>
                    </div>
                    <div>
                      <div style={{color:"rgba(255,255,255,0.22)", fontSize:"9px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:".1em", marginBottom:"8px"}}>Expertise</div>
                      <div style={{display:"flex", flexWrap:"wrap", gap:"6px"}}>
                        {selectedMember.expertise.map(e => (
                          <span key={e} className="expertise-tag" style={{fontSize:"12px", padding:"5px 12px"}}>{e}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{color:"rgba(255,255,255,0.22)", fontSize:"9px", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:".1em", marginBottom:"8px"}}>Key Modules</div>
                      <div style={{display:"flex", flexWrap:"wrap", gap:"6px"}}>
                        {selectedMember.modules.map(mod => (
                          <span key={mod} className="module-chip" style={{fontSize:"12px"}}>{mod}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{width:"320px", flexShrink:0, overflow:"hidden", borderLeft:"1px solid rgba(255,255,255,0.06)"}}>
                    {selectedMember.photo ? (
                      <img src={selectedMember.photo} alt={selectedMember.name}
                        style={{width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%", display:"block"}} />
                    ) : (
                      <div style={{width:"100%", height:"100%", background:"#3E2723", display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <span style={{fontFamily:"'Playfair Display',serif", fontWeight:"700", fontSize:"4rem", color:"rgba(255,255,255,0.12)"}}>{selectedMember.initials}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Marquee — DARK */}
      <div className="marquee-wrap-dark py-4 overflow-hidden">
        <div className="marquee marquee-text text-sm font-body font-medium tracking-widest uppercase">
          {Array(8).fill("Let's Connect · Start Your Journey · ServiceNow Experts · India · Global Vision · Nexus Hub · ").join("")}
        </div>
      </div>

      {/* ══════════════════════════════════════
          6. CTA — CHOCOLATE BROWN bg
      ══════════════════════════════════════ */}
      <section className="sec-black py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-16 md:p-24 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:"radial-gradient(#fff 1px,transparent 1px)",backgroundSize:"26px 26px"}} />
              <div className="relative z-10">
                <div className="tag-dark mx-auto mb-6">Ready to start?</div>
                <h2 className="font-bebas text-[clamp(3rem,7vw,6rem)] leading-none tracking-wide text-white mb-2">Transform Your</h2>
                <h2 className="font-display italic text-[clamp(2rem,5vw,4.5rem)] leading-tight text-white/60 mb-8">Operations Today</h2>
                <p className="font-body text-white/35 max-w-md mx-auto mb-10 text-sm leading-relaxed">
                  Let's talk about how Nexus Hub can unlock the full potential of ServiceNow for your organization.
                </p>
                <button onClick={() => go("contact")} className="btn-light text-base px-10 py-4">Start Your Journey →</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Marquee — LIGHT */}
      <div className="marquee-wrap-light py-4 overflow-hidden">
        <div className="marquee marquee-text text-sm font-body font-medium tracking-widest uppercase">
          {Array(8).fill("Let's Connect · Start Your Journey · ServiceNow Experts · India · Global Vision · Nexus Hub · ").join("")}
        </div>
      </div>

      {/* ══════════════════════════════════════
          7. CONTACT — GREY bg
      ══════════════════════════════════════ */}
      <section id="contact" className="sec-hero py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <Reveal><div className="tag-light mb-6">Contact</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bebas text-[clamp(3rem,5vw,5rem)] leading-none tracking-wide text-black">Let's Build</h2>
              <h2 className="font-display italic text-[clamp(2rem,3.5vw,3.2rem)] leading-tight text-black/60 mb-8">Something Great</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-body text-black/45 text-sm leading-relaxed mb-12 max-w-sm">Reach out to discuss your ServiceNow needs. Our team responds within one business day.</p>
              <div className="space-y-5">
                {[
                  { label:"Phone",    val:"+91 98765 43210 "   },
                  {val:"+91 9566994093"},
                  { label:"General",  val:"sales@nexushubglobalsolutions.com" },
                  { label:"Location", val:"Trichy Rd, near ELGI, Nadar Colony, Coimbatore, India 641018" },
                ].map(c => (
                  <div key={c.label} className="flex gap-5 items-start">
                    <span className="font-mono text-black/30 text-xs w-16 pt-0.5 shrink-0">{c.label}</span>
                    <span className="font-body text-black/70 text-sm">{c.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <a
                  href="https://www.linkedin.com/company/nexus-hub-global-solutions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{background:"#2C1810",color:"#fff",display:"inline-flex",alignItems:"center",gap:"10px",padding:"12px 22px",borderRadius:"10px",fontWeight:"600",fontSize:"14px",textDecoration:"none",transition:"all .25s",fontFamily:"'Outfit',sans-serif"}}
                  onMouseEnter={e => { e.currentTarget.style.background="#3E2723"; e.currentTarget.style.transform="translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#2C1810"; e.currentTarget.style.transform="translateY(0)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Follow us on LinkedIn
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="bg-[#d4d4d4] border border-[#b0b0b0] rounded-2xl p-8">
              <h3 className="font-display font-bold text-black text-xl mb-8">Send a Message</h3>

              {/* Success state - Custom CSS Celebration */}
              {formStatus === "success" ? (
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"24px", padding:"60px 24px", textAlign:"center", minHeight:"500px", position:"relative", overflow:"hidden"}}>
                  {/* Confetti */}
                  {[...Array(15)].map((_, i) => (
                    <div key={i} style={{
                      position:"absolute",
                      width:"10px",
                      height:"10px",
                      background:["#FF6B35", "#2C1810", "#FF6B35", "#C8C8C8"][Math.floor(Math.random() * 4)],
                      borderRadius:"50%",
                      animation:`confetti-fall ${2 + Math.random() * 1}s ease-in forwards`,
                      left:`${Math.random() * 100}%`,
                      top:"-10px",
                      opacity:0.8
                    }} />
                  ))}
                  
                  {/* Success Checkmark */}
                  <div style={{
                    position:"relative",
                    zIndex:10,
                    animation:"scale-in 0.6s cubic-bezier(.22,1,.36,1)"
                  }}>
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="60" cy="60" r="55" fill="#FF6B35" opacity="0.1" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#FF6B35" strokeWidth="3" strokeDasharray="314" strokeDashoffset="314" style={{animation:"stroke-dash 0.8s ease forwards"}} />
                      <path d="M40 60L55 75L85 45" stroke="#FF6B35" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset="50" style={{animation:"stroke-dash 0.8s ease 0.2s forwards"}} />
                    </svg>
                  </div>

                  <div style={{position:"relative", zIndex:10}}>
                    <div className="font-display font-bold text-black" style={{fontSize:"2rem", marginBottom:"12px"}}>Message Sent!</div>
                    <p className="font-body text-black/60 text-base" style={{marginBottom:"24px", maxWidth:"400px"}}>Thank you! We'll get back to you within one business day.</p>
                    <button
                      onClick={() => setFormStatus("idle")}
                      className="btn-ghost-dark"
                      style={{padding:"12px 28px", fontSize:"14px", fontWeight:"600"}}
                    >Send Another Message →</button>
                  </div>

                  <style>{`
                    @keyframes confetti-fall {
                      to {
                        transform: translateY(400px) rotate(360deg);
                        opacity: 0;
                      }
                    }
                    @keyframes scale-in {
                      from {
                        transform: scale(0);
                        opacity: 0;
                      }
                      to {
                        transform: scale(1);
                        opacity: 1;
                      }
                    }
                    @keyframes stroke-dash {
                      to {
                        stroke-dashoffset: 0;
                      }
                    }
                  `}</style>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-black/40 text-xs mb-2 block">First Name *</label>
                      <input
                        className="ci"
                        placeholder="Arjun"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        style={formStatus === "error_validation" && !formData.firstName ? {borderColor:"#c00"} : {}}
                      />
                    </div>
                    <div>
                      <label className="font-body text-black/40 text-xs mb-2 block">Last Name</label>
                      <input
                        className="ci"
                        placeholder="Kumar"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-black/40 text-xs mb-2 block">Email Address *</label>
                    <input
                      className="ci"
                      placeholder="arjun@company.com"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      style={formStatus === "error_validation" && !formData.email ? {borderColor:"#c00"} : {}}
                    />
                  </div>
                  <div>
                    <label className="font-body text-black/40 text-xs mb-2 block">Module of Interest</label>
                    <ModuleDropdown selected={formModules} setSelected={setFormModules} />
                  </div>
                  <div>
                    <label className="font-body text-black/40 text-xs mb-2 block">Message</label>
                    <textarea
                      className="ci resize-none"
                      rows={4}
                      placeholder="Tell us about your project..."
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                    />
                  </div>

                  {/* Validation / error messages */}
                  {formStatus === "error_validation" && (
                    <p style={{color:"#c00", fontSize:"12px", fontFamily:"'Outfit',sans-serif"}}>Please fill in your first name and email.</p>
                  )}
                  {formStatus === "error" && (
                    <p style={{color:"#c00", fontSize:"12px", fontFamily:"'Outfit',sans-serif"}}>Something went wrong. Please try again.</p>
                  )}

                  <button
                    onClick={handleSendMessage}
                    disabled={formStatus === "sending"}
                    className="btn-dark w-full text-center font-body"
                    style={{opacity: formStatus === "sending" ? 0.6 : 1, cursor: formStatus === "sending" ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px"}}
                  >
                    {formStatus === "sending" ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          style={{animation:"spin 0.8s linear infinite"}}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Sending...
                      </>
                    ) : "Send Message →"}
                  </button>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-wrap py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Nexus Hub Logo" style={{height:"85px", width:"auto", maxWidth:"550px", objectFit:"contain"}} />
          </div>
          <p className="font-body text-white/20 text-xs text-center">© 2026 Nexus Hub Global Solutions · Coimbatore, India</p>
          <a
            href="https://www.linkedin.com/company/nexus-hub-global-solutions/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200 text-xs font-body font-medium"
            style={{borderColor:"#FF6B35", color:"#FF6B35"}}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor="#E55A25"; e.currentTarget.style.color="#E55A25"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor="#FF6B35"; e.currentTarget.style.color="#FF6B35"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}