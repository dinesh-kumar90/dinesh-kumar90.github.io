"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink, Terminal, Layers, Zap, Globe, ChevronDown, Send, Menu, X } from "lucide-react";
import Logo from '../components/Logo'
import Link from 'next/link';

const NAV_LINKS = [
  { label: "Expertise", id: "expertise" },
  { label: "Projects", id: "projects" },
  { label: "Timeline", id: "timeline" },
  { label: "Stack", id: "stack" },
  { label: "Contact", id: "contact" },
];

const CODE_SNIPPETS = [
  `const architect = {
  engineers: 15,
  systems: "distributed",
  uptime: "99.99%"
}`,
  `interface TechLead {
  ai: GenerativeAI[];
  stack: FullStack;
  scale: number;
}`,
  `async function deploy() {
  await ci.pipeline();
  await k8s.rollout();
  return "shipped ✓";
}`,
  `SELECT COUNT(*) FROM wins
WHERE impact = 'high'
AND date > '2019-01-01';`,
];

const EXPERTISE = [
  {
    icon: <Zap size={20} />,
    title: "Generative AI",
    desc: "Architecting production LLM systems — RAG pipelines, fine-tuning, GPT-4 integrations, and AI-native product development at scale.",
    tags: ["GPT-4", "LangChain", "RAG", "Vector DBs"],
  },
  {
    icon: <Layers size={20} />,
    title: "Full Stack Mastery",
    desc: "End-to-end ownership from infra to UI. TypeScript, Node.js, React, PostgreSQL, Redis, and cloud-native deployments on AWS.",
    tags: ["Laravel", "Node.js", "React", "AWS"],
  },
  {
    icon: <Globe size={20} />,
    title: "E-commerce Ecosystems",
    desc: "Specialist in Shopify Plus, custom app development, and complex third-party API orchestrations.",
    tags: ["Headless", "Shopify", "Stripe", "CDN"],
  },
];
const PROJECTS = [
  {
    title: "ForChics",
    desc: "Full Shopify store build for a fast-growing beauty brand. Custom theme development, speed optimisation, and upsell flows to maximise average order value.",
    tags: ["Shopify 2.0", "Liquid", "Speed Optimisation", "Custom Theme"],
    impact: "Full build · Core Web Vitals optimised · App-free upsells",
    url: "https://www.forchics.com",
  },
  {
    title: "Tipaw",
    desc: "Complete storefront build with performance-first development. Cleaned up bloated code, lazy loaded assets, and eliminated render-blocking scripts.",
    tags: ["Shopify", "Liquid", "AJAX API", "Performance"],
    impact: "Full build · Page speed improved · App-free",
    url: "https://store.tipaw.com",
  },
  {
    title: "Bleame",
    desc: "Built a custom 'Build a Box' feature using JavaScript and Liquid — customers pick a box size, fill it with products, and add the bundle to cart. Zero apps.",
    tags: ["Custom JS", "Liquid", "AJAX Cart API", "Bundles"],
    impact: "Custom bundle flow · App-free · Higher AOV",
    url: "https://www.bleame.com",
  },
  {
    title: "Vue Swiss",
    desc: "Shopify Plus store with a custom discount function on the Shopify Functions API — automatically applies a free gift at checkout based on cart conditions.",
    tags: ["Shopify Plus", "Functions API", "Metaobjects", "Liquid"],
    impact: "Free gift logic · No third-party app · Shopify Plus",
    url: "https://www.vueswiss.com",
  },
  {
    title: "Nexus Section Library",
    desc: "Published Shopify app that lets merchants add customisable theme sections and build landing pages, banners, and layouts without touching code.",
    tags: ["Shopify App", "Liquid", "Theme Sections", "No-code"],
    impact: "Live on Shopify App Store · Free to install",
    url: "https://apps.shopify.com/nexus-section-library",
  },
  {
    title: "Buy Links Pro",
    desc: "Shopify app that generates direct checkout links with automatic discounts — shareable via email, ads, or social media to reduce checkout friction.",
    tags: ["Shopify App", "Checkout", "Discount Links", "Node.js"],
    impact: "Live on Shopify App Store · Reduces checkout steps",
    url: "https://apps.shopify.com/buylink-pro",
  },
  {
    title: "LPG Enterprise",
    desc: "Hub-and-spoke store syncing app that enables real-time syncing of products, inventory, orders, and fulfilments between multiple Shopify stores.",
    tags: ["Shopify App", "Multi-store Sync", "Inventory", "Orders"],
    impact: "Live on Shopify App Store · Enterprise-grade sync",
    url: "https://apps.shopify.com/lpg-enterprise-partner",
  },
];

const TIMELINE = [
  {
    role: "Senior Technical Lead",
    company: "Code Corners",
    period: "Jan 2020 – Present",
    desc: "Leading a 15-engineer org across 4 squads. Shipped AI-native product suite generating $12M ARR.",
    side: "right",
  },
  {
    role: "Team Lead, Backend",
    company: "Code Corners",
    period: "Mar 2016 – Dec 2019",
    desc: "Built the real-time inventory platform from 0→1. Scaled to 300+ warehouses and 40M GMV/month.",
    side: "left",
  },
  {
    role: "Freelance Web Developer",
    company: "Self-Employed",
    period: "Apr 2015 – Feb 2016",
    desc: "Delivered 15+ custom web applications and Shopify stores for SMBs with 100% client satisfaction; built Laravel-based CMS and e-commerce platforms with Stripe, PayPal integrations.",
    side: "right",
  },
  {
    role: "Junior Web Developer",
    company: "RV Technology",
    period: "June 2013 – Mar 2015",
    desc: "Developed and maintained PHP-based web applications and custom Shopify themes (Liquid, HTML5, CSS3, JavaScript) for 20+ clients; integrated payment gateways, shipping providers, and CRM systems.",
    side: "left",
  },
];

const STACK = [
  { name: "TypeScript", level: 96 },
  { name: "PHP", level: 95 },
  { name: "Shopify", level: 95 },
  { name: "Shopify Apps", level: 96 },
  { name: "React", level: 95 },
  { name: "Node.js", level: 93 },
  { name: "AWS", level: 90 },
  { name: "Go", level: 60 },
  { name: "Databases", level: 90 },
  { name: "Redis", level: 85 },
  { name: "Docker", level: 92 },
  { name: "Python", level: 70 },
];

const STATS = [
  { value: "15+", label: "Engineers Led" },
  { value: "99.99%", label: "System Uptime" },
  { value: "$40M", label: "GMV Processed" },
  { value: "13+", label: "Years Experience" },
];

function Github({size = 24}) {
  return <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"  width={size}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
          <path d="M4.0744 2.9938C4.13263 1.96371 4.37869 1.51577 5.08432 1.15606C5.84357 0.768899 7.04106 0.949072 8.45014 1.66261C9.05706 1.97009 9.11886 1.97635 10.1825 1.83998C11.5963 1.65865 13.4164 1.65929 14.7213 1.84164C15.7081 1.97954 15.7729 1.97265 16.3813 1.66453C18.3814 0.651679 19.9605 0.71795 20.5323 1.8387C20.8177 2.39812 20.8707 3.84971 20.6494 5.04695C20.5267 5.71069 20.5397 5.79356 20.8353 6.22912C22.915 9.29385 21.4165 14.2616 17.8528 16.1155C17.5801 16.2574 17.3503 16.3452 17.163 16.4167C16.5879 16.6363 16.4133 16.703 16.6247 17.7138C16.7265 18.2 16.8491 19.4088 16.8973 20.4002C16.9844 22.1922 16.9831 22.2047 16.6688 22.5703C16.241 23.0676 15.6244 23.076 15.2066 22.5902C14.9341 22.2734 14.9075 22.1238 14.9075 20.9015C14.9075 19.0952 14.7095 17.8946 14.2417 16.8658C13.6854 15.6415 14.0978 15.185 15.37 14.9114C17.1383 14.531 18.5194 13.4397 19.2892 11.8146C20.0211 10.2698 20.1314 8.13501 18.8082 6.83668C18.4319 6.3895 18.4057 5.98446 18.6744 4.76309C18.7748 4.3066 18.859 3.71768 18.8615 3.45425C18.8653 3.03823 18.8274 2.97541 18.5719 2.97541C18.4102 2.97541 17.7924 3.21062 17.1992 3.49805L16.2524 3.95695C16.1663 3.99866 16.07 4.0147 15.975 4.0038C13.5675 3.72746 11.2799 3.72319 8.86062 4.00488C8.76526 4.01598 8.66853 3.99994 8.58215 3.95802L7.63585 3.49882C7.04259 3.21087 6.42482 2.97541 6.26317 2.97541C5.88941 2.97541 5.88379 3.25135 6.22447 4.89078C6.43258 5.89203 6.57262 6.11513 5.97101 6.91572C5.06925 8.11576 4.844 9.60592 5.32757 11.1716C5.93704 13.1446 7.4295 14.4775 9.52773 14.9222C10.7926 15.1903 11.1232 15.5401 10.6402 16.9905C10.26 18.1319 10.0196 18.4261 9.46707 18.4261C8.72365 18.4261 8.25796 17.7821 8.51424 17.1082C8.62712 16.8112 8.59354 16.7795 7.89711 16.5255C5.77117 15.7504 4.14514 14.0131 3.40172 11.7223C2.82711 9.95184 3.07994 7.64739 4.00175 6.25453C4.31561 5.78028 4.32047 5.74006 4.174 4.83217C4.09113 4.31822 4.04631 3.49103 4.0744 2.9938Z" fill="currentColor"></path>
          <path d="M3.33203 15.9454C3.02568 15.4859 2.40481 15.3617 1.94528 15.6681C1.48576 15.9744 1.36158 16.5953 1.66793 17.0548C1.8941 17.3941 2.16467 17.6728 2.39444 17.9025C2.4368 17.9449 2.47796 17.9858 2.51815 18.0257C2.71062 18.2169 2.88056 18.3857 3.05124 18.5861C3.42875 19.0292 3.80536 19.626 4.0194 20.6962C4.11474 21.1729 4.45739 21.4297 4.64725 21.5419C4.85315 21.6635 5.07812 21.7352 5.26325 21.7819C5.64196 21.8774 6.10169 21.927 6.53799 21.9559C7.01695 21.9877 7.53592 21.998 7.99999 22.0008C8.00033 22.5527 8.44791 23.0001 8.99998 23.0001C9.55227 23.0001 9.99998 22.5524 9.99998 22.0001V21.0001C9.99998 20.4478 9.55227 20.0001 8.99998 20.0001C8.90571 20.0001 8.80372 20.0004 8.69569 20.0008C8.10883 20.0026 7.34388 20.0049 6.67018 19.9603C6.34531 19.9388 6.07825 19.9083 5.88241 19.871C5.58083 18.6871 5.09362 17.8994 4.57373 17.2891C4.34391 17.0194 4.10593 16.7834 3.91236 16.5914C3.87612 16.5555 3.84144 16.5211 3.80865 16.4883C3.5853 16.265 3.4392 16.1062 3.33203 15.9454Z" fill="currentColor"></path>
      </g>
  </svg>
}

function Linkedin({size = 24}) {
  return <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" fill="currentColor"></path>
        <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" fill="currentColor"></path>
        <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" fill="currentColor"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="currentColor"></path>
      </g>
  </svg>
}

function FadeIn({ children, delay = 0, y = 30, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GlassCard({ children, className = "", hover = true }) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
            scale: 1.02,
            y: -4,
            boxShadow: "0 0 32px 0 rgba(138,235,255,0.10)",
            borderColor: "rgba(138,235,255,0.25)",
          }
          : {}
      }
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-sm text-slate-300">{name}</span>
        <span className="font-mono text-xs text-cyan-400">{level}%</span>
      </div>
      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.1, delay: delay * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #22d3ee 0%, #8aebff 100%)" }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("expertise");
  const [openProject, setOpenProject] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSent(true);
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "2b4f2678-f473-48ae-a720-4850e60e148e",
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }),
    });

    const data = await response.json();
    //setResult(data.success ? "Success!" : "Error");
    setTimeout(() => setSent(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    const navOffset = 65;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - navOffset;
    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
    });
  };

  useEffect(() => {
    const getSections = () =>
      NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean);

    let ticking = false;
    const updateActiveSection = () => {
      const sections = getSections();
      const offset = 140;
      let nextActive = NAV_LINKS[0].id;

      sections.forEach((section) => {
        const top = section.offsetTop - offset;
        if (window.scrollY >= top) {
          nextActive = section.id;
        }
      });

      setActiveSection(nextActive);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <div
      className="min-h-screen text-slate-100 overflow-x-hidden"
      style={{
        background: "#0b1326",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "600px",
            background:
              "radial-gradient(ellipse at center, rgba(138,235,255,0.06) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "-10%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.05) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "-5%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(ellipse at center, rgba(16,185,129,0.04) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
          background: "rgba(11,19,38,0.75)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a
            href={'/'}
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: "15px",
              letterSpacing: "0.04em",
              color: "#8aebff",
              fontWeight: 500,
            }}
          >
            <Logo compact width={300} />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm transition-colors duration-200"
                style={{ fontFamily: "'Inter', sans-serif", background: "none", border: "none", cursor: "pointer" }}
              >
                <span
                  style={{
                    color: activeSection === l.id ? "#8aebff" : "#94a3b8",
                    paddingBottom: "3px",
                    borderBottom: activeSection === l.id ? "1px solid rgba(138,235,255,0.55)" : "1px solid transparent",
                  }}
                >
                  {l.label}
                </span>
              </button>
            ))}
            <Link href="/blog" className="text-sm transition-colors duration-200 text-[#94a3b8] hover:text-[#8aebff]" style={{ fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>
              Blog
            </Link>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(138,235,255,0.2)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("contact")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid rgba(138,235,255,0.35)",
                background: "rgba(138,235,255,0.07)",
                color: "#8aebff",
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Hire Me
            </motion.button>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-400"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                overflow: "hidden",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(11,19,38,0.95)",
              }}
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {NAV_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    className="text-left text-sm transition-colors"
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    <span style={{ color: activeSection === l.id ? "#8aebff" : "#94a3b8" }}>{l.label}</span>
                  </button>
                ))}
                <Link href="/blog" className="text-left text-sm transition-colors text-[#94a3b8] hover:text-[#8aebff]" style={{ fontFamily: "Inter, sans-serif", textDecoration: 'none' }}>
                  Blog
                </Link>
                <button
                  onClick={() => scrollTo("contact")}
                  className="text-sm w-fit"
                  style={{
                    marginTop: "6px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(138,235,255,0.35)",
                    background: "rgba(138,235,255,0.07)",
                    color: "#8aebff",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Hire Me
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ paddingTop: "80px" }}
      >
        {/* Floating code snippets */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {CODE_SNIPPETS.map((snippet, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.055, y: 0 }}
              transition={{ duration: 1.5, delay: 0.3 + i * 0.2 }}
              style={{
                position: "absolute",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                lineHeight: "1.7",
                color: "#8aebff",
                whiteSpace: "pre",
                ...(i === 0 && { top: "15%", left: "3%" }),
                ...(i === 1 && { top: "20%", right: "3%" }),
                ...(i === 2 && { bottom: "22%", left: "2%" }),
                ...(i === 3 && { bottom: "18%", right: "4%" }),
              }}
            >
              {snippet}
            </motion.div>
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(138,235,255,0.2)",
              background: "rgba(138,235,255,0.06)",
              marginBottom: "32px",
            }}
          >
            {/*<span*/}
            {/*  style={{*/}
            {/*    width: "6px",*/}
            {/*    height: "6px",*/}
            {/*    borderRadius: "50%",*/}
            {/*    background: "#4ade80",*/}
            {/*    display: "inline-block",*/}
            {/*  }}*/}
            {/*/>*/}
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                color: "#8aebff",
                letterSpacing: "0.05em",
              }}
            >
              // SENIOR TECHNICAL LEAD & ARCHITECT
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: "28px",
              color: "#f1f5f9",
            }}
          >
            Dinesh Kumar
            {/*<br />*/}
            {/*<span style={{ color: "#8aebff" }}>That Don&apos;t Break.</span>*/}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#94a3b8",
              maxWidth: "560px",
              margin: "0 auto 48px",
            }}
          >
            13+ years of architecting scalable enterprise systems. Specializing in the intersection of High-Scale E-commerce and Generative AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(138,235,255,0.30)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("projects")}
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                background: "#8aebff",
                color: "#0b1326",
                fontWeight: 600,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              View Engineering Works <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, borderColor: "rgba(138,235,255,0.5)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("contact")}
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent",
                color: "#e2e8f0",
                fontWeight: 500,
                fontSize: "15px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Initiate Contact
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} style={{ color: "rgba(138,235,255,0.4)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* EXPERTISE */}
      <section
        id="expertise"
        className="flex items-center"
        style={{
          minHeight: "100svh",
          paddingTop: "128px",
          paddingBottom: "128px",
          background: "linear-gradient(180deg, rgba(138,235,255,0.03) 0%, rgba(11,19,38,0) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Stats */}
            <FadeIn>
              <div>
                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    color: "#8aebff",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  // 01. EXPERTISE
                </p>
                <h2
                  style={{
                    fontSize: "clamp(32px, 4vw, 48px)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    marginBottom: "28px",
                    color: "#f1f5f9",
                  }}
                >
                  Technical Leadership at Scale
                </h2>
                <p className="text-[#f1f5f9] text-base mb-[48px]">Currently leading a high-performance team of 15+ developers. I bridge the gap between complex business requirements and robust technical architecture, focusing on AI-driven transformations in e-commerce.</p>
                <div className="grid grid-cols-2 gap-6">
                  {STATS.map((s, i) => (
                    <FadeIn key={s.label} delay={i * 0.1}>
                      <div
                        style={{
                          padding: "24px",
                          borderRadius: "16px",
                          border: "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "#8aebff",
                            lineHeight: 1,
                            marginBottom: "6px",
                          }}
                        >
                          {s.value}
                        </div>
                        <div style={{ fontSize: "13px", color: "#64748b" }}>{s.label}</div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Cards */}
            <div className="flex flex-col gap-5">
              {EXPERTISE.map((e, i) => (
                <FadeIn key={e.title} delay={i * 0.12} y={20}>
                  <GlassCard>
                    <div className="flex items-start gap-4">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: "rgba(138,235,255,0.1)",
                          border: "1px solid rgba(138,235,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#8aebff",
                          flexShrink: 0,
                        }}
                      >
                        {e.icon}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#f1f5f9",
                            marginBottom: "6px",
                          }}
                        >
                          {e.title}
                        </h3>
                        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", marginBottom: "12px" }}>
                          {e.desc}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {e.tags.map((t) => (
                            <span
                              key={t}
                              style={{
                                fontFamily: "JetBrains Mono, monospace",
                                fontSize: "11px",
                                padding: "3px 10px",
                                borderRadius: "999px",
                                border: "1px solid rgba(138,235,255,0.15)",
                                background: "rgba(138,235,255,0.05)",
                                color: "#8aebff",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="flex items-center"
        style={{
          minHeight: "100svh",
          paddingTop: "128px",
          paddingBottom: "128px",
          background: "linear-gradient(180deg, rgba(99,102,241,0.03) 0%, rgba(11,19,38,0) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: "#8aebff",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                // engineering works
              </p>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#f1f5f9",
                }}
              >
                Selected Projects
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROJECTS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.08} y={24}>
                <motion.div
                  whileHover={{
                    scale: 1.03,
                    y: -6,
                    boxShadow: "0 0 40px rgba(138,235,255,0.08)",
                    borderColor: "rgba(138,235,255,0.2)",
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.02)",
                    padding: "28px",
                    cursor: "pointer",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onClick={() => setOpenProject(openProject === p.title ? null : p.title)}
                >
                  {/* Color accent top */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background: `linear-gradient(90deg, transparent, rgba(138,235,255,0.4), transparent)`,
                    }}
                  />
                  {/* <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(138,235,255,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Terminal size={16} style={{ color: "#8aebff" }} />
                  </div> */}
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#f1f5f9",
                      marginBottom: "8px",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: "1.65", marginBottom: "20px" }}>
                    {p.desc}
                  </p>
                  <AnimatePresence initial={false}>
                    {openProject === p.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "11px",
                          letterSpacing: "0.03em",
                          color: "#8aebff",
                          marginBottom: "14px",
                        }}
                      >
                        Impact: {p.impact}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "10px",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "#94a3b8",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 justify-between">
                    <button
                      className="flex items-center justify-center cursor-pointer border-none bg-none text-xs p-0 gap-4 text-[#8aebff]"
                      style={{
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {openProject === p.title ? "Hide Impact" : "Show Impact"} 
                    </button>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center cursor-pointer border-none bg-none text-xs p-0 gap-4 text-[#8aebff]"
                >
                      {p.url ? "Visit " + p.title : "Source Code"} <ExternalLink size={12} />
                    </a>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section
        id="timeline"
        className="flex items-center"
        style={{
          minHeight: "100svh",
          paddingTop: "128px",
          paddingBottom: "128px",
          background: "linear-gradient(180deg, rgba(16,185,129,0.03) 0%, rgba(11,19,38,0) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: "#8aebff",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                // career path
              </p>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#f1f5f9",
                }}
              >
                Professional Journey
              </h2>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Center line — hidden on mobile */}
            <div
              className="hidden md:block"
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: "1px",
                background:
                  "linear-gradient(to bottom, transparent, rgba(138,235,255,0.2) 10%, rgba(138,235,255,0.2) 90%, transparent)",
                transform: "translateX(-50%)",
              }}
            />

            <div className="flex flex-col gap-12">
              {TIMELINE.map((item, i) => (
                <FadeIn key={item.role} delay={i * 0.1} y={20}>
                  <div
                    className={`relative flex flex-col md:flex-row ${
                      item.side === "right" ? "md:flex-row" : "md:flex-row-reverse"
                    } items-center gap-6 md:gap-0`}
                  >
                    {/* Card */}
                    <div className={`w-full md:w-[45%] ${item.side === "right" ? "md:pr-12" : "md:pl-12"}`}>
                      <GlassCard>
                        <div
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "11px",
                            color: "#8aebff",
                            marginBottom: "6px",
                          }}
                        >
                          {item.period}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#f1f5f9", marginBottom: "2px" }}>
                          {item.role}
                        </div>
                        <div style={{ fontSize: "13px", color: "#475569", marginBottom: "10px" }}>
                          {item.company}
                        </div>
                        <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: "1.6" }}>{item.desc}</p>
                      </GlassCard>
                    </div>

                    {/* Center dot */}
                    <div
                      className="hidden md:flex"
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "#8aebff",
                        boxShadow: "0 0 12px rgba(138,235,255,0.6)",
                        zIndex: 1,
                        flexShrink: 0,
                      }}
                    />

                    <div className="hidden md:block w-[45%]" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section
        id="stack"
        className="flex items-center"
        style={{
          minHeight: "100svh",
          paddingTop: "128px",
          paddingBottom: "128px",
          background: "linear-gradient(180deg, rgba(245,158,11,0.03) 0%, rgba(11,19,38,0) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: "#8aebff",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                // technical arsenal
              </p>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#f1f5f9",
                }}
              >
                Stack & Proficiency
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {STACK.map((s, i) => (
              <SkillBar key={s.name} name={s.name} level={s.level} delay={i} />
            ))}
          </div>

          {/* Extra chip row */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap justify-center gap-3 mt-16">
              {["CI/CD", "GraphQL", "REST", "Microservices", "Event-Driven", "OAuth2", "WebSockets", "gRPC", "Elasticsearch", "Shopify Apps"].map(
                (tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.07, borderColor: "rgba(138,235,255,0.4)", color: "#8aebff" }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.02)",
                      fontSize: "13px",
                      color: "#64748b",
                      fontFamily: "JetBrains Mono, monospace",
                      cursor: "default",
                      transition: "all 0.2s",
                    }}
                  >
                    {tag}
                  </motion.span>
                )
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="flex items-center"
        style={{
          minHeight: "100svh",
          paddingTop: "128px",
          paddingBottom: "128px",
          background: "linear-gradient(180deg, rgba(236,72,153,0.03) 0%, rgba(11,19,38,0) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: "#8aebff",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                // initiate connection
              </p>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#f1f5f9",
                  marginBottom: "16px",
                }}
              >
                Let&apos;s Build Together
              </h2>
              <p style={{ fontSize: "16px", color: "#64748b", lineHeight: "1.7" }}>
                Open to senior IC and leadership roles. Particularly interested in AI-native product
                companies and high-scale infrastructure challenges.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                padding: "40px",
              }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                    style={{ padding: "40px 0" }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: "rgba(138,235,255,0.1)",
                        border: "1px solid rgba(138,235,255,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        color: "#8aebff",
                      }}
                    >
                      <Send size={22} />
                    </div>
                    <p style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9", marginBottom: "8px" }}>
                      Protocol Sent
                    </p>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                      I&apos;ll respond within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSend}
                    className="flex flex-col gap-8"
                  >
                    {[
                      { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                      { id: "email", label: "Email", type: "email", placeholder: "you@company.com" },
                    ].map((f) => (
                      <div key={f.id}>
                        <label
                          htmlFor={f.id}
                          style={{
                            display: "block",
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            color: "#8aebff",
                            marginBottom: "8px",
                          }}
                        >
                          {f.label.toUpperCase()}
                        </label>
                        <input
                          id={f.id}
                          type={f.type}
                          placeholder={f.placeholder}
                          value={formData[f.id]}
                          onChange={(e) => setFormData((p) => ({ ...p, [f.id]: e.target.value }))}
                          required
                          style={{
                            width: "100%",
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid rgba(255,255,255,0.12)",
                            outline: "none",
                            color: "#f1f5f9",
                            fontSize: "16px",
                            padding: "8px 0",
                            fontFamily: "Inter, sans-serif",
                            boxSizing: "border-box",
                            transition: "border-color 0.2s",
                          }}
                          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-0 rounded-sm"
                          onFocus={(e) => (e.target.style.borderBottomColor = "rgba(138,235,255,0.5)")}
                          onBlur={(e) => (e.target.style.borderBottomColor = "rgba(255,255,255,0.12)")}
                        />
                      </div>
                    ))}
                    <div>
                      <label
                        htmlFor="message"
                        style={{
                          display: "block",
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "11px",
                          letterSpacing: "0.08em",
                          color: "#8aebff",
                          marginBottom: "8px",
                        }}
                      >
                        MESSAGE
                      </label>
                      <textarea
                        id="message"
                        placeholder="Tell me about the role or project..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        required
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.12)",
                          outline: "none",
                          color: "#f1f5f9",
                          fontSize: "16px",
                          padding: "8px 0",
                          fontFamily: "Inter, sans-serif",
                          resize: "none",
                          boxSizing: "border-box",
                          transition: "border-color 0.2s",
                        }}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-0 rounded-sm"
                        onFocus={(e) => (e.target.style.borderBottomColor = "rgba(138,235,255,0.5)")}
                        onBlur={(e) => (e.target.style.borderBottomColor = "rgba(255,255,255,0.12)")}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03, boxShadow: "0 0 36px rgba(138,235,255,0.28)" }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "10px",
                        background: "#8aebff",
                        color: "#0b1326",
                        fontWeight: 700,
                        fontSize: "15px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontFamily: "Inter, sans-serif",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Send Protocol <ArrowRight size={16} />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "40px 24px",
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Logo width={300} compact={true} />
          </div>

          <div
            className="flex-1 items-center justify-center flex"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              color: "#475569",
              letterSpacing: "0.04em",
            }}
          >
            © 2026 — Build by Dinesh Kumar
          </div>

          <div className="flex items-center gap-4">
            {[
              { icon: <Github size={18} />, label: "GitHub", href: "https://github.com/" },
              { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://www.linkedin.com/" },
            ].map((s) => (
              <motion.button
                key={s.label}
                whileHover={{ scale: 1.15, color: "#8aebff" }}
                whileTap={{ scale: 0.9 }}
                title={s.label}
                onClick={() => window.open(s.href, "_blank", "noopener,noreferrer")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#475569",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
              >
                {s.icon}
              </motion.button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
