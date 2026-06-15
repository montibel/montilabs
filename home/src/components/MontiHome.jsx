import { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  m,
  LazyMotion,
  domAnimation,
  useMotionValue,
  useSpring,
  useAnimation,
  AnimatePresence,
} from "framer-motion";

const ContactModal = lazy(() => import("./ContactModal"));

const ACCENT = "#c8ff3e";
const ACCENT_VIDEO = "#ff8c42";

const GITHUB_PATH =
  "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z";

const PROJECTS_VIDEO = [
  {
    id: "fintech",
    title: "Tutorial Banca Digital",
    cat: { es: "Videotutorial interactivo", en: "Interactive Video Tutorial" },
    desc: {
      es: "Demo animado que muestra las funciones principales de una app bancaria: login, dashboard, movimientos y transferencias.",
      en: "Animated demo showing the main features of a banking app: login, dashboard, transactions and transfers.",
    },
    url: "fintech/",
    img: "assets/screenshots/fintech.jpg",
    color: "#ff8c42",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(255,140,66,.15) 0%, transparent 70%), #111",
  },
];

const PROJECTS_DISENO = [
  {
    id: "fluid-type",
    title: "Fluid Type",
    cat: { es: "Tipografía interactiva", en: "Interactive Typography" },
    desc: {
      es: "Tipografía formada por partículas que reacciona al movimiento del cursor en tiempo real.",
      en: "Typography made of particles that reacts to cursor movement in real time.",
    },
    url: "tipografia/",
    img: "assets/screenshots/fluid-type.jpg",
    color: "#c8ff3e",
    bg: "radial-gradient(ellipse at 30% 60%, rgba(200,255,62,.18) 0%, transparent 70%), #111",
  },
  {
    id: "gravity",
    title: "Gravity",
    cat: { es: "Tipografía interactiva", en: "Interactive Typography" },
    desc: {
      es: "Letras flotando en un espacio 3D retro que orbitan el cursor al moverlo.",
      en: "Letters floating in a retro 3D space that orbit the cursor as you move it.",
    },
    url: "tipografia2/dist/",
    img: "assets/screenshots/gravity.jpg",
    color: "#ff8c42",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(255,140,66,.18) 0%, transparent 70%), #111",
  },
  {
    id: "iphone",
    title: "iPhone Home",
    cat: { es: "UI / UX", en: "UI / UX" },
    desc: {
      es: "Réplica funcional de la pantalla de inicio de iOS con animaciones y gestos nativos.",
      en: "Functional replica of the iOS home screen with native animations and gestures.",
    },
    url: "iphone/dist/",
    img: "assets/screenshots/iphone.jpg",
    color: "#bf5af2",
    bg: "radial-gradient(ellipse at 60% 30%, rgba(191,90,242,.18) 0%, transparent 70%), #111",
  },
  {
    id: "win95",
    title: "Windows 95",
    cat: { es: "UI / UX", en: "UI / UX" },
    desc: {
      es: "Template de portfolio con estética Windows 95: ventanas arrastrables, taskbar y menú Start.",
      en: "Portfolio template with Windows 95 aesthetics: draggable windows, taskbar and Start menu.",
    },
    url: "win95/",
    img: "assets/screenshots/win95.jpg",
    color: "#1084d0",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(16,132,208,.18) 0%, transparent 70%), #111",
  },
];

const COPY = {
  es: {
    eyebrow: "Diseño Web · Video · Santiago, Chile",
    h1: ["Más allá", "de tu", "imaginación."],
    explore: "Explorar",
    about:
      "Estudio creativo en Santiago, Chile. Interfaces dinámicas y animaciones interactivas para dar vida a productos digitales únicos.",
    contact: "Hablemos",
    open: "Abrir →",
    footer: "© 2026 montilabs",
    privacy: "Política de privacidad",
    terms: "Términos",
    back: "← Volver",
    sectionDiseno: {
      title: "Diseño Web",
      desc: "Interfaces interactivas, tipografía y UI/UX.",
      count: "4 proyectos",
      process: [
        { n: "01", title: "Briefing", desc: "Entendemos el proyecto, objetivos y audiencia." },
        { n: "02", title: "Diseño & Prototipo", desc: "Iteramos hasta que la visión sea clara." },
        { n: "03", title: "Desarrollo & Entrega", desc: "Código limpio, animaciones y detalle final." },
      ],
    },
    sectionVideo: {
      title: "Video",
      desc: "Producción audiovisual y motion design.",
      count: "1 proyecto",
      comingSoon: "Próximamente",
      comingSoonDesc: "Los proyectos de video están en producción.",
      process: [
        { n: "01", title: "Briefing", desc: "Definimos el mensaje, tono y audiencia." },
        { n: "02", title: "Guión & Storyboard", desc: "Estructuramos la narrativa visual." },
        { n: "03", title: "Producción & Entrega", desc: "Animación, edición y ajustes finales." },
      ],
    },
  },
  en: {
    eyebrow: "Web Design · Video · Santiago, Chile",
    h1: ["Beyond", "your", "imagination."],
    explore: "Explore",
    about:
      "Creative studio based in Santiago, Chile. Dynamic interfaces and interactive animations to bring unique digital products to life.",
    contact: "Let's talk",
    open: "Open →",
    footer: "© 2026 montilabs",
    privacy: "Privacy policy",
    terms: "Terms",
    back: "← Back",
    sectionDiseno: {
      title: "Web Design",
      desc: "Interactive interfaces, typography and UI/UX.",
      count: "4 projects",
      process: [
        { n: "01", title: "Briefing", desc: "We understand the project, goals and audience." },
        { n: "02", title: "Design & Prototype", desc: "We iterate until the vision is clear." },
        { n: "03", title: "Development & Delivery", desc: "Clean code, animations and final detail." },
      ],
    },
    sectionVideo: {
      title: "Video",
      desc: "Audiovisual production and motion design.",
      count: "1 project",
      comingSoon: "Coming soon",
      comingSoonDesc: "Video projects are in production.",
      process: [
        { n: "01", title: "Briefing", desc: "We define the message, tone and audience." },
        { n: "02", title: "Script & Storyboard", desc: "We structure the visual narrative." },
        { n: "03", title: "Production & Delivery", desc: "Animation, editing and final adjustments." },
      ],
    },
  },
};

function getPageFromHash() {
  const hash = window.location.hash;
  if (hash === "#diseno-web") return "diseno";
  if (hash === "#video") return "video";
  return "home";
}

// ── Viewport width hook ───────────────────────────────────────────────
function useWide(breakpoint = 768) {
  const [wide, setWide] = useState(() => window.innerWidth >= breakpoint);
  useEffect(() => {
    const check = () => setWide(window.innerWidth >= breakpoint);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return wide;
}

// ── Custom Cursor ────────────────────────────────────────────────────
function Cursor({ hovering }) {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.6 });
  const ry = useSpring(my, { stiffness: 140, damping: 18, mass: 0.6 });

  useEffect(() => {
    const move = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <>
      <m.div
        style={{
          x: mx,
          y: my,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          borderRadius: "50%",
        }}
        animate={{
          width: 6,
          height: 6,
          background: hovering ? ACCENT : "#f0f0f0",
        }}
        transition={{ duration: 0.15 }}
      />
      <m.div
        style={{
          x: rx,
          y: ry,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
          borderRadius: "50%",
          border: "1px solid",
        }}
        animate={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          borderColor: hovering ? ACCENT : "rgba(240,240,240,0.35)",
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

// ── Hero logo reveal ─────────────────────────────────────────────────
function HeroLogo({ onHover }) {
  const PATH =
    "M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z";
  const glowCtrl = useAnimation();
  const fillCtrl = useAnimation();
  const [isOn, setIsOn] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const startFlicker = () => {
    fillCtrl.start({
      opacity: [1, 0.88, 1, 0.91, 0.72, 1, 0.94, 0.79, 1, 0.87, 0.66, 1, 0.83, 1, 0.92, 0.75, 1, 0.86, 0.97, 1],
      transition: {
        duration: 6.5,
        times: [0, 0.04, 0.09, 0.15, 0.23, 0.29, 0.36, 0.44, 0.5, 0.57, 0.64, 0.7, 0.75, 0.8, 0.85, 0.89, 0.93, 0.96, 0.99, 1],
        repeat: Infinity,
        ease: "linear",
      },
    });
  };

  useEffect(() => {
    const run = async () => {
      await new Promise((r) => setTimeout(r, 1850));
      fillCtrl.start({ opacity: 1, transition: { duration: 0.15 } });
      await glowCtrl.start({ opacity: 0.9, scale: 1.5, transition: { duration: 0.25 } });
      await glowCtrl.start({ opacity: 0.4, scale: 1, transition: { duration: 0.9, ease: "easeOut" } });
      setRevealed(true);
      startFlicker();
      glowCtrl.start({
        opacity: [0.4, 0.72],
        scale: [1, 1.12],
        transition: { duration: 2.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
      });
    };
    run();
  }, []);

  useEffect(() => {
    if (!revealed) return;
    if (isOn) {
      fillCtrl.start({ opacity: 1, transition: { duration: 0.12 } }).then(startFlicker);
      glowCtrl.start({
        opacity: [0.4, 0.72],
        scale: [1, 1.12],
        transition: { duration: 2.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
      });
    } else {
      fillCtrl.stop();
      fillCtrl.start({
        opacity: [1, 0.12, 0.82, 0.06, 0.55, 0.07],
        transition: { duration: 0.55, times: [0, 0.1, 0.28, 0.48, 0.72, 1], ease: "linear" },
      });
      glowCtrl.start({ opacity: 0, scale: 1, transition: { duration: 0.6 } });
    }
  }, [isOn, revealed]);

  return (
    <div style={{ position: "relative", width: 280, height: 280 }}>
      <m.div
        animate={glowCtrl}
        initial={{ opacity: 0, scale: 1 }}
        style={{
          position: "absolute", top: "50%", left: "50%",
          translateX: "-50%", translateY: "-50%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,255,62,.32) 0%, transparent 65%)",
          filter: "blur(36px)",
          pointerEvents: "none",
        }}
      />
      <m.div
        animate={glowCtrl}
        initial={{ opacity: 0, scale: 1 }}
        style={{
          position: "absolute", top: "50%", left: "50%",
          translateX: "-50%", translateY: "-50%",
          width: 150, height: 150, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,255,62,.7) 0%, transparent 60%)",
          filter: "blur(14px)",
          pointerEvents: "none",
        }}
      />
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.22, 0] }}
        transition={{ delay: 1.85, duration: 0.6, times: [0, 0.08, 1] }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(circle at 50% 50%, rgba(200,255,62,.5) 0%, transparent 55%)",
          filter: "blur(18px)",
        }}
      />
      <svg
        viewBox="0 0 48 46"
        style={{
          position: "absolute", top: "50%", left: "50%",
          translateX: "-50%", translateY: "-50%",
          width: 130, height: 125, overflow: "visible",
        }}
      >
        <m.path
          d={PATH} fill="none" stroke="#c8ff3e"
          strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 2px #c8ff3e) drop-shadow(0 0 7px rgba(200,255,62,.6))" }}
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 0 }}
          transition={{
            pathLength: { delay: 0.4, duration: 1.4, ease: [0.42, 0, 0.58, 1] },
            opacity: { delay: 1.75, duration: 0.2 },
          }}
        />
        <m.path
          d={PATH} fill="#c8ff3e"
          animate={fillCtrl}
          initial={{ opacity: 0 }}
          style={{ filter: "drop-shadow(0 0 3px #c8ff3e) drop-shadow(0 0 10px rgba(200,255,62,.8)) drop-shadow(0 0 22px rgba(200,255,62,.5))" }}
        />
      </svg>
      <m.button
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setIsOn((v) => !v)}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
        style={{
          position: "absolute", bottom: 8, left: "50%", translateX: "-50%",
          background: "none", border: "none", cursor: "none",
          display: "flex", alignItems: "center", gap: 8, padding: "4px 0",
        }}
      >
        <div style={{
          width: 32, height: 18, borderRadius: 9,
          background: isOn ? ACCENT : "rgba(255,255,255,0.1)",
          border: isOn ? "none" : "1px solid rgba(255,255,255,0.15)",
          position: "relative", transition: "background 0.3s, border 0.3s", flexShrink: 0,
        }}>
          <m.div
            animate={{ x: isOn ? 15 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            style={{
              position: "absolute", top: 2, left: 0,
              width: 14, height: 14, borderRadius: "50%",
              background: isOn ? "#080808" : "rgba(255,255,255,0.35)",
            }}
          />
        </div>
        <span style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase",
          color: isOn ? "rgba(200,255,62,.5)" : "rgba(255,255,255,.2)",
          transition: "color 0.3s", userSelect: "none",
        }}>
          {isOn ? "on" : "off"}
        </span>
      </m.button>
    </div>
  );
}

// ── Project Card ─────────────────────────────────────────────────────
function ProjectCard({ project, lang, index, onHover }) {
  const t = COPY[lang];
  return (
    <m.a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.015 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 18,
        background: "#111",
        border: "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
        cursor: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Screenshot */}
      <div style={{ position: "relative", height: 210, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={project.img}
          alt={project.title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Gradient fade into card bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(to bottom, transparent, #111)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "4px 10px", borderRadius: 99,
            background: project.color + "18",
            color: project.color,
          }}>
            {project.cat[lang]}
          </span>
          <m.span
            style={{ fontSize: 13, fontWeight: 500, color: project.color }}
            initial={{ opacity: 0, x: -4 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            {t.open}
          </m.span>
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 600, color: "#f0f0f0", marginBottom: 6 }}>
            {project.title}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(240,240,240,0.4)" }}>
            {project.desc[lang]}
          </p>
        </div>
      </div>
    </m.a>
  );
}

// ── Category Card ────────────────────────────────────────────────────
function CategoryCard({ title, desc, count, color, href, icon, onHover, index }) {
  return (
    <m.a
      href={href}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
        borderRadius: 24,
        minHeight: 320,
        background: `radial-gradient(ellipse at 20% 80%, ${color}14 0%, transparent 65%), #111`,
        border: "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
        cursor: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ color, opacity: 0.85 }}>{icon}</div>

      <div>
        <p style={{
          fontSize: "clamp(28px, 3.5vw, 42px)",
          fontWeight: 700,
          color: "#f0f0f0",
          marginBottom: 10,
          letterSpacing: "-0.02em",
        }}>
          {title}
        </p>
        <p style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(240,240,240,0.4)",
          marginBottom: 28,
        }}>
          {desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "4px 10px", borderRadius: 99,
            background: color + "18",
            color,
          }}>
            {count}
          </span>
          <span style={{ color, fontSize: 20, fontWeight: 300, opacity: 0.7 }}>→</span>
        </div>
      </div>

      <m.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 100%, ${color}08 0%, transparent 60%)`,
          pointerEvents: "none",
          borderRadius: 24,
        }}
      />
    </m.a>
  );
}

// ── Process Section ──────────────────────────────────────────────────
function ProcessSection({ steps, color, wide }) {
  return (
    <section style={{ padding: wide ? "0 64px 80px" : "0 24px 64px" }}>
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 40,
        }}
      >
        <span style={{
          fontSize: 11, fontWeight: 500, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "rgba(240,240,240,0.3)",
        }}>
          Proceso
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      </m.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: wide ? "1fr 1fr 1fr" : "1fr",
        gap: wide ? 0 : 24,
      }}>
        {steps.map((step, i) => (
          <m.div
            key={step.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: wide ? "0 40px 0 0" : 0,
              borderRight: wide && i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
              paddingRight: wide && i < 2 ? 40 : 0,
              paddingLeft: wide && i > 0 ? 40 : 0,
            }}
          >
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
              color, opacity: 0.6, display: "block", marginBottom: 16,
            }}>
              {step.n}
            </span>
            <p style={{
              fontSize: 17, fontWeight: 600, color: "#f0f0f0",
              marginBottom: 10, letterSpacing: "-0.01em",
            }}>
              {step.title}
            </p>
            <p style={{
              fontSize: 14, lineHeight: 1.65, color: "rgba(240,240,240,0.4)",
            }}>
              {step.desc}
            </p>
          </m.div>
        ))}
      </div>
    </section>
  );
}

// ── GitHub icon ──────────────────────────────────────────────────────
function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={GITHUB_PATH} />
    </svg>
  );
}

// ── Shared footer ────────────────────────────────────────────────────
function Footer({ t, full, setHovering }) {
  return (
    <footer style={{
      padding: "24px 64px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <span style={{ fontSize: 12, color: "rgba(240,240,240,0.2)", display: "flex", gap: 16, alignItems: "center" }}>
        <span>{t.footer}</span>
        {full && (
          <>
            <a
              href="privacy.html"
              style={{ color: "rgba(240,240,240,0.2)" }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {t.privacy}
            </a>
            <a
              href="terms.html"
              style={{ color: "rgba(240,240,240,0.2)" }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {t.terms}
            </a>
          </>
        )}
      </span>
      <a
        href="https://github.com/montibel"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub de Montilabs"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ fontSize: 12, color: "rgba(240,240,240,0.2)", display: "flex", alignItems: "center", gap: 6 }}
      >
        <GithubIcon />
        GitHub
      </a>
    </footer>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export default function MontiHome() {
  const [lang, setLang] = useState(
    () => localStorage.getItem("ml_lang") || "es",
  );
  const [hovering, setHovering] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [page, setPage] = useState(getPageFromHash);
  const cardsRef = useRef(null);
  const wide = useWide(820);
  const t = COPY[lang];

  useEffect(() => {
    const onHashChange = () => {
      setPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const toggleLang = () =>
    setLang((l) => {
      const n = l === "es" ? "en" : "es";
      localStorage.setItem("ml_lang", n);
      return n;
    });

  return (
    <LazyMotion features={domAnimation}>
      <div style={{ minHeight: "100vh", background: "#0b0b0b" }}>
        <Cursor hovering={hovering} />

        {/* ── Header ── */}
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          background: "rgba(11,11,11,0.85)",
        }}>
          {page === "home" ? (
            <m.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                fontSize: 18, fontWeight: 400, color: "rgba(240,240,240,0.4)",
                textDecoration: "none", cursor: "none", lineHeight: 1,
              }}
              onHoverStart={() => setHovering(true)}
              onHoverEnd={() => setHovering(false)}
              whileHover={{ color: "#f0f0f0" }}
            >
              ↑
            </m.a>
          ) : (
            <m.a
              href="#"
              style={{
                fontSize: 13, fontWeight: 500, letterSpacing: "0.05em",
                color: "rgba(240,240,240,0.4)", textDecoration: "none", cursor: "none",
              }}
              onHoverStart={() => setHovering(true)}
              onHoverEnd={() => setHovering(false)}
              whileHover={{ color: "#f0f0f0" }}
            >
              {t.back}
            </m.a>
          )}

          {page !== "home" && (
            <m.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: 15, fontWeight: 700, color: ACCENT,
                letterSpacing: "-0.02em",
                position: "absolute", left: "50%", transform: "translateX(-50%)",
              }}
            >
              montilabs
            </m.span>
          )}

          <button
            aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}
            onClick={toggleLang}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
              display: "flex", alignItems: "center",
              padding: "6px 14px", borderRadius: 99,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent", color: "rgba(240,240,240,0.5)",
              fontSize: 11, fontWeight: 500, letterSpacing: "0.15em",
              textTransform: "uppercase", cursor: "none", fontFamily: "inherit",
            }}
          >
            <AnimatePresence mode="wait">
              <m.span
                key={lang}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {lang === "es" ? "EN" : "ES"}
              </m.span>
            </AnimatePresence>
          </button>
        </header>

        {/* ── Pages ── */}
        <AnimatePresence mode="wait">

          {/* HOME */}
          {page === "home" && (
            <m.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero */}
              <section style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: wide ? "row" : "column",
                alignItems: "center",
                paddingTop: 96, paddingBottom: 64,
                paddingLeft: wide ? 72 : 32,
                paddingRight: wide ? 72 : 32,
                gap: wide ? 56 : 52,
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <m.p
                    style={{
                      marginBottom: 20,
                      fontSize: "clamp(56px, 8.5vw, 116px)",
                      fontWeight: 900, letterSpacing: "-0.04em",
                      color: ACCENT, lineHeight: 0.88,
                    }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{
                      opacity: 1, y: 0,
                      textShadow: [
                        `0 0 12px ${ACCENT}cc, 0 0 32px ${ACCENT}88, 0 0 64px ${ACCENT}44, 0 0 120px ${ACCENT}22`,
                        `0 0 6px ${ACCENT}88, 0 0 16px ${ACCENT}44, 0 0 32px ${ACCENT}22, 0 0 60px ${ACCENT}11`,
                        `0 0 12px ${ACCENT}cc, 0 0 32px ${ACCENT}88, 0 0 64px ${ACCENT}44, 0 0 120px ${ACCENT}22`,
                      ],
                    }}
                    transition={{
                      opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                      y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                      textShadow: { repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.7 },
                    }}
                  >
                    montilabs
                  </m.p>

                  <m.p
                    style={{
                      fontSize: 11, fontWeight: 500, letterSpacing: "0.22em",
                      textTransform: "uppercase", color: "rgba(240,240,240,0.35)", marginBottom: 18,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    {t.eyebrow}
                  </m.p>

                  <h1 style={{
                    fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.02em",
                    color: "rgba(240,240,240,0.75)",
                    fontSize: "clamp(26px, 3vw, 42px)",
                    marginBottom: "2.5rem", maxWidth: 480,
                  }}>
                    {t.h1.map((line, i) => (
                      <m.span
                        key={line}
                        style={{ display: "block" }}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {i === 2 ? (
                          <>
                            {line.replace(".", "")}
                            <span style={{ color: ACCENT }}>.</span>
                          </>
                        ) : (
                          line
                        )}
                      </m.span>
                    ))}
                  </h1>

                  <m.button
                    onClick={() => cardsRef.current?.scrollIntoView({ behavior: "smooth" })}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 12,
                      padding: "15px 32px", borderRadius: 99, border: "none",
                      background: ACCENT, color: "#0b0b0b",
                      fontSize: 14, fontWeight: 700, alignSelf: "flex-start",
                      cursor: "none", fontFamily: "inherit", letterSpacing: "-0.01em",
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.48, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t.explore}
                    <m.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    >
                      ↓
                    </m.span>
                  </m.button>
                </div>

                {wide && (
                  <m.div
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <HeroLogo onHover={setHovering} />
                  </m.div>
                )}
              </section>

              {/* Category Cards */}
              <section ref={cardsRef} style={{ padding: wide ? "0 64px 96px" : "0 24px 64px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: wide ? "1fr 1fr" : "1fr",
                  gap: 20,
                }}>
                  <CategoryCard
                    index={0}
                    title={t.sectionDiseno.title}
                    desc={t.sectionDiseno.desc}
                    count={t.sectionDiseno.count}
                    color={ACCENT}
                    href="#diseno-web"
                    onHover={setHovering}
                    icon={
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect x="3" y="6" width="34" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M14 34h12M20 28v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M9 14l5 5-5 5M18 23h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                  />
                  <CategoryCard
                    index={1}
                    title={t.sectionVideo.title}
                    desc={t.sectionVideo.desc}
                    count={t.sectionVideo.count}
                    color={ACCENT_VIDEO}
                    href="#video"
                    onHover={setHovering}
                    icon={
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect x="3" y="9" width="26" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M29 15l8-5v20l-8-5V15z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M14 17l8 5.5-8 5.5V17z" fill="currentColor" />
                      </svg>
                    }
                  />
                </div>
              </section>

              {/* About + Contact */}
              <section style={{ padding: wide ? "0 64px 80px" : "0 24px 64px" }}>
                <div style={{
                  borderRadius: 20,
                  padding: wide ? "56px 64px" : 32,
                  display: "flex", flexDirection: wide ? "row" : "column",
                  gap: 48, alignItems: "flex-start",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <m.p
                    style={{
                      flex: 1, fontSize: 18, lineHeight: 1.7, fontWeight: 300,
                      color: "rgba(240,240,240,0.6)", maxWidth: 540,
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {t.about}
                  </m.p>
                  <m.button
                    onClick={() => setContactOpen(true)}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    style={{
                      flexShrink: 0,
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "16px 28px", borderRadius: 99,
                      border: `1px solid ${ACCENT}`, color: ACCENT,
                      fontSize: 14, fontWeight: 600, background: "transparent",
                      cursor: "none", fontFamily: "inherit",
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    whileHover={{ background: ACCENT + "12", scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t.contact} →
                  </m.button>
                </div>
              </section>

              <Footer t={t} full setHovering={setHovering} />
            </m.div>
          )}

          {/* DISEÑO WEB */}
          {page === "diseno" && (
            <m.div
              key="diseno"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <section style={{
                paddingTop: 140, paddingBottom: 48,
                paddingLeft: wide ? 72 : 32, paddingRight: wide ? 72 : 32,
              }}>
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 style={{
                    fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900,
                    letterSpacing: "-0.04em", color: ACCENT, lineHeight: 1,
                    textShadow: `0 0 32px ${ACCENT}44`,
                  }}>
                    {t.sectionDiseno.title}
                  </h1>
                  <p style={{
                    marginTop: 12, fontSize: 16, fontWeight: 300,
                    color: "rgba(240,240,240,0.4)",
                  }}>
                    {t.sectionDiseno.desc}
                  </p>
                </m.div>
              </section>

              <section style={{ padding: wide ? "0 64px 96px" : "0 24px 64px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: wide ? "1fr 1fr" : "1fr",
                  gap: 20,
                }}>
                  {PROJECTS_DISENO.map((p, i) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      lang={lang}
                      index={i}
                      onHover={setHovering}
                    />
                  ))}
                </div>
              </section>

              <ProcessSection steps={t.sectionDiseno.process} color={ACCENT} wide={wide} />
              <Footer t={t} setHovering={setHovering} />
            </m.div>
          )}

          {/* VIDEO */}
          {page === "video" && (
            <m.div
              key="video"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <section style={{
                paddingTop: 140, paddingBottom: 48,
                paddingLeft: wide ? 72 : 32, paddingRight: wide ? 72 : 32,
              }}>
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 style={{
                    fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 900,
                    letterSpacing: "-0.04em", color: ACCENT_VIDEO, lineHeight: 1,
                    textShadow: `0 0 32px ${ACCENT_VIDEO}44`,
                  }}>
                    {t.sectionVideo.title}
                  </h1>
                  <p style={{
                    marginTop: 12, fontSize: 16, fontWeight: 300,
                    color: "rgba(240,240,240,0.4)",
                  }}>
                    {t.sectionVideo.desc}
                  </p>
                </m.div>
              </section>

              <ProcessSection steps={t.sectionVideo.process} color={ACCENT_VIDEO} wide={wide} />

              <section style={{ padding: wide ? "0 64px 96px" : "0 24px 64px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: wide ? "1fr 1fr" : "1fr",
                  gap: 20,
                }}>
                  {PROJECTS_VIDEO.map((p, i) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      lang={lang}
                      index={i}
                      onHover={setHovering}
                    />
                  ))}
                </div>
              </section>

              <Footer t={t} setHovering={setHovering} />
            </m.div>
          )}

        </AnimatePresence>

        <Suspense fallback={null}>
          <ContactModal
            lang={lang}
            open={contactOpen}
            onClose={() => setContactOpen(false)}
            setHovering={setHovering}
          />
        </Suspense>
      </div>
    </LazyMotion>
  );
}
