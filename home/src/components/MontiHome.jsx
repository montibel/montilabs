import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import ContactModal from "./ContactModal";

const ACCENT = "#c8ff3e";

const PROJECTS = [
  {
    id: "fluid-type",
    title: "Fluid Type",
    cat: { es: "Tipografía interactiva", en: "Interactive Typography" },
    desc: {
      es: "Texto que responde al movimiento en tiempo real.",
      en: "Text that responds to movement in real time.",
    },
    url: "tipografia/",
    color: "#c8ff3e",
    bg: "radial-gradient(ellipse at 30% 60%, rgba(200,255,62,.18) 0%, transparent 70%), #111",
  },
  {
    id: "gravity",
    title: "Gravity",
    cat: { es: "Tipografía interactiva", en: "Interactive Typography" },
    desc: {
      es: "Partículas aplicada a la tipografía interactiva.",
      en: "Particles applied to interactive typography.",
    },
    url: "tipografia2/dist/",
    color: "#ff8c42",
    bg: "radial-gradient(ellipse at 70% 40%, rgba(255,140,66,.18) 0%, transparent 70%), #111",
  },
  {
    id: "search",
    title: "Search Sequence",
    cat: { es: "Animación", en: "Animation" },
    desc: {
      es: "Secuencia animada de búsqueda e interacción con resultados.",
      en: "Animated search sequence and results interaction.",
    },
    url: "uxsim/dist/",
    color: "#4bf0c8",
    bg: "radial-gradient(ellipse at 50% 70%, rgba(75,240,200,.15) 0%, transparent 70%), #111",
  },
  {
    id: "iphone",
    title: "iPhone Home",
    cat: { es: "UI / UX", en: "UI / UX" },
    desc: {
      es: "Simulador interactivo de iOS.",
      en: "Interactive iOS simulator.",
    },
    url: "iphone/dist/",
    color: "#bf5af2",
    bg: "radial-gradient(ellipse at 60% 30%, rgba(191,90,242,.18) 0%, transparent 70%), #111",
  },
  {
    id: "win95",
    title: "Windows 95",
    cat: { es: "UI / UX", en: "UI / UX" },
    desc: {
      es: "Plantilla retro de Windows 95",
      en: "Retro Windows 95 template.",
    },
    url: "win95/",
    color: "#1084d0",
    bg: "radial-gradient(ellipse at 30% 70%, rgba(16,132,208,.18) 0%, transparent 70%), #111",
  },
];

const COPY = {
  es: {
    eyebrow: "Interfaces · Animaciones · Código creativo",
    h1: ["Más allá", "de tu", "imaginación."],
    cta: "Ver proyectos",
    projectsLabel: "Proyectos",
    about:
      "Interfaces dinámicas y animaciones interactivas. Diseño y desarrollo para dar vida a productos digitales únicos.",
    contact: "Hablemos",
    open: "Abrir →",
    footer: "© 2026 montilabs",
    privacy: "Política de privacidad",
    terms: "Términos",
  },
  en: {
    eyebrow: "Interfaces · Animations · Creative Code",
    h1: ["Beyond", "your", "imagination."],
    cta: "View projects",
    projectsLabel: "Projects",
    about:
      "Dynamic interfaces and interactive animations. Design and development to bring unique digital products to life.",
    contact: "Let's talk",
    open: "Open →",
    footer: "© 2026 montilabs",
    privacy: "Privacy policy",
    terms: "Terms",
  },
};

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
      <motion.div
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
      <motion.div
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

// ── Hero logo reveal (right side) ───────────────────────────────────
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

      {/* Outer glow */}
      <motion.div
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
      {/* Inner glow */}
      <motion.div
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

      {/* Flash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.22, 0] }}
        transition={{ delay: 1.85, duration: 0.6, times: [0, 0.08, 1] }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(circle at 50% 50%, rgba(200,255,62,.5) 0%, transparent 55%)",
          filter: "blur(18px)",
        }}
      />

      {/* Lightning bolt SVG */}
      <svg
        viewBox="0 0 48 46"
        style={{ position: "absolute", top: "50%", left: "50%",
          translateX: "-50%", translateY: "-50%",
          width: 130, height: 125, overflow: "visible" }}
      >
        <motion.path
          d={PATH} fill="none" stroke="#c8ff3e"
          strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 2px #c8ff3e) drop-shadow(0 0 7px rgba(200,255,62,.6))" }}
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 0 }}
          transition={{
            pathLength: { delay: 0.4, duration: 1.4, ease: [0.42, 0, 0.58, 1] },
            opacity:    { delay: 1.75, duration: 0.2 },
          }}
        />
        <motion.path
          d={PATH} fill="#c8ff3e"
          animate={fillCtrl}
          initial={{ opacity: 0 }}
          style={{ filter: "drop-shadow(0 0 3px #c8ff3e) drop-shadow(0 0 10px rgba(200,255,62,.8)) drop-shadow(0 0 22px rgba(200,255,62,.5))" }}
        />
      </svg>

      {/* Toggle switch */}
      <motion.button
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
          <motion.div
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
      </motion.button>
    </div>
  );
}

// ── Project Card ─────────────────────────────────────────────────────
function ProjectCard({ project, lang, index, onHover }) {
  const t = COPY[lang];
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.015 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 28,
        borderRadius: 18,
        minHeight: 220,
        background: project.bg,
        border: "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
        cursor: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          padding: "4px 10px",
          borderRadius: 99,
          background: project.color + "18",
          color: project.color,
          alignSelf: "flex-start",
        }}
      >
        {project.cat[lang]}
      </span>

      <div>
        <p
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#f0f0f0",
            marginBottom: 8,
          }}
        >
          {project.title}
        </p>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "rgba(240,240,240,0.45)",
          }}
        >
          {project.desc[lang]}
        </p>
      </div>

      <motion.span
        style={{
          position: "absolute",
          bottom: 28,
          right: 28,
          fontSize: 13,
          fontWeight: 500,
          color: project.color,
        }}
        initial={{ opacity: 0, x: -4 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        {t.open}
      </motion.span>
    </motion.a>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export default function MontiHome() {
  const [lang, setLang] = useState(
    () => localStorage.getItem("ml_lang") || "es",
  );
  const [hovering, setHovering] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const projectsRef = useRef(null);
  const wide = useWide(820);
  const t = COPY[lang];

  const scrollToProjects = () =>
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b" }}>
      <Cursor hovering={hovering} />

      {/* ── Header ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          background: "rgba(11,11,11,0.85)",
        }}
      >
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "rgba(240,240,240,0.4)",
            textDecoration: "none",
            cursor: "none",
            lineHeight: 1,
          }}
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
          whileHover={{ color: "#f0f0f0" }}
        >
          ↑
        </motion.a>

        <button
          aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}
          onClick={() =>
            setLang((l) => {
              const n = l === "es" ? "en" : "es";
              localStorage.setItem("ml_lang", n);
              return n;
            })
          }
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px 14px",
            borderRadius: 99,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent",
            color: "rgba(240,240,240,0.5)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "none",
            fontFamily: "inherit",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={lang}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {lang === "es" ? "EN" : "ES"}
            </motion.span>
          </AnimatePresence>
        </button>
      </header>

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: wide ? "row" : "column",
          alignItems: "center",
          paddingTop: 96,
          paddingBottom: 64,
          paddingLeft: wide ? 72 : 32,
          paddingRight: wide ? 72 : 32,
          gap: wide ? 56 : 52,
        }}
      >
        {/* Left — text */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Brand — neon logotype */}
          <motion.p
            style={{
              marginBottom: 20,
              fontSize: "clamp(56px, 8.5vw, 116px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: ACCENT,
              lineHeight: 0.88,
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: 1,
              y: 0,
              textShadow: [
                `0 0 12px ${ACCENT}cc, 0 0 32px ${ACCENT}88, 0 0 64px ${ACCENT}44, 0 0 120px ${ACCENT}22`,
                `0 0 6px ${ACCENT}88, 0 0 16px ${ACCENT}44, 0 0 32px ${ACCENT}22, 0 0 60px ${ACCENT}11`,
                `0 0 12px ${ACCENT}cc, 0 0 32px ${ACCENT}88, 0 0 64px ${ACCENT}44, 0 0 120px ${ACCENT}22`,
              ],
            }}
            transition={{
              opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              textShadow: {
                repeat: Infinity,
                duration: 3.2,
                ease: "easeInOut",
                delay: 0.7,
              },
            }}
          >
            montilabs
          </motion.p>

          {/* Eyebrow */}
          <motion.p
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(240,240,240,0.35)",
              marginBottom: 18,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t.eyebrow}
          </motion.p>

          {/* Tagline — light weight, contrasts with heavy brand */}
          <h1
            style={{
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "rgba(240,240,240,0.75)",
              fontSize: "clamp(26px, 3vw, 42px)",
              marginBottom: "2.5rem",
              maxWidth: 480,
            }}
          >
            {t.h1.map((line, i) => (
              <motion.span
                key={line}
                style={{ display: "block" }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.25 + i * 0.08,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {i === 2 ? (
                  <>
                    {line.replace(".", "")}
                    <span style={{ color: ACCENT }}>.</span>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>

          {/* CTA */}
          <motion.button
            onClick={scrollToProjects}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "15px 32px",
              borderRadius: 99,
              border: "none",
              background: ACCENT,
              color: "#0b0b0b",
              fontSize: 14,
              fontWeight: 700,
              alignSelf: "flex-start",
              cursor: "none",
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.cta}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
            >
              ↓
            </motion.span>
          </motion.button>
        </div>

        {/* Right — tiles */}
        {wide && (
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroLogo onHover={setHovering} />
          </motion.div>
        )}
      </section>

      {/* ── Projects ── */}
      <section ref={projectsRef} style={{ padding: "0 64px 96px" }}>
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 48,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(240,240,240,0.35)",
            }}
          >
            {t.projectsLabel}
          </span>
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
          />
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: wide ? "1fr 1fr" : "1fr",
            gap: 20,
          }}
        >
          {PROJECTS.map((p, i) => (
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

      {/* ── About + Contact ── */}
      <section style={{ padding: "0 64px 80px" }}>
        <div
          style={{
            borderRadius: 20,
            padding: wide ? "56px 64px" : 32,
            display: "flex",
            flexDirection: wide ? "row" : "column",
            gap: 48,
            alignItems: "flex-start",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <motion.p
            style={{
              flex: 1,
              fontSize: 18,
              lineHeight: 1.7,
              fontWeight: 300,
              color: "rgba(240,240,240,0.6)",
              maxWidth: 540,
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.about}
          </motion.p>

          <motion.button
            onClick={() => setContactOpen(true)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 28px",
              borderRadius: 99,
              border: `1px solid ${ACCENT}`,
              color: ACCENT,
              fontSize: 14,
              fontWeight: 600,
              background: "transparent",
              cursor: "none",
              fontFamily: "inherit",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            whileHover={{ background: ACCENT + "12", scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.contact} →
          </motion.button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "24px 64px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "rgba(240,240,240,0.2)", display: "flex", gap: 16, alignItems: "center" }}>
          <span>{t.footer}</span>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub
        </a>
      </footer>

      <ContactModal
        lang={lang}
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        setHovering={setHovering}
      />
    </div>
  );
}
