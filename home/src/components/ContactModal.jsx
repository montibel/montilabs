import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#c8ff3e";

// Replace with your Formspree form ID — https://formspree.io
const FORMSPREE_ID = "xvzndpna";

const COPY = {
  es: {
    title: "Hablemos",
    subtitle: "Cuéntame sobre tu proyecto.",
    name: "Nombre",
    email: "Correo electrónico",
    service: "Servicio",
    services: ["Video / Motion", "Interfaces UI/UX", "Videotutoriales", "E-learning", "Otro"],
    message: "Mensaje",
    messagePlaceholder: "¿En qué puedo ayudarte?",
    send: "Enviar mensaje",
    sending: "Enviando…",
    successTitle: "¡Mensaje enviado!",
    successBody: "Te responderé lo antes posible.",
    errorBody: "Algo salió mal. Intenta de nuevo o escríbeme a montilabss@gmail.com",
    close: "Cerrar",
    back: "Enviar otro",
    required: "Campo requerido",
    invalidEmail: "Email no válido",
  },
  en: {
    title: "Let's talk",
    subtitle: "Tell me about your project.",
    name: "Name",
    email: "Email address",
    service: "Service",
    services: ["Video / Motion", "UI/UX Interfaces", "Video Tutorials", "E-learning", "Other"],
    message: "Message",
    messagePlaceholder: "How can I help you?",
    send: "Send message",
    sending: "Sending…",
    successTitle: "Message sent!",
    successBody: "I'll get back to you as soon as possible.",
    errorBody: "Something went wrong. Try again or email montilabss@gmail.com",
    close: "Close",
    back: "Send another",
    required: "Required field",
    invalidEmail: "Invalid email",
  },
};

const inputStyle = (focused, error) => ({
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${error ? "#ff6b6b" : focused ? ACCENT : "rgba(255,255,255,0.1)"}`,
  borderRadius: 10,
  padding: "12px 16px",
  color: "#f0f0f0",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.2s",
  cursor: "none",
});

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,240,240,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "#ff6b6b" }}>{error}</span>}
    </div>
  );
}

export default function ContactModal({ lang, open, onClose, setHovering }) {
  const t = COPY[lang] || COPY.es;
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setForm({ name: "", email: "", service: "", message: "" });
    setErrors({});
    setStatus("idle");
    setTimeout(() => firstInputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t.required;
    if (!form.email.trim()) e.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.invalidEmail;
    if (!form.message.trim()) e.message = t.required;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          service: form.service || "—",
          message: form.message,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const hover = (v) => () => setHovering(v);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "40px 40px 36px",
              width: "100%",
              maxWidth: 480,
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label={t.close}
              onMouseEnter={hover(true)}
              onMouseLeave={hover(false)}
              style={{
                position: "absolute", top: 20, right: 20,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(240,240,240,0.4)", cursor: "none", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
            >
              ✕
            </button>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "24px 0" }}
                >
                  <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{t.successTitle}</h2>
                  <p style={{ fontSize: 15, color: "rgba(240,240,240,0.5)", marginBottom: 32 }}>{t.successBody}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    onMouseEnter={hover(true)}
                    onMouseLeave={hover(false)}
                    style={{
                      padding: "12px 24px", borderRadius: 99,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "transparent", color: "rgba(240,240,240,0.5)",
                      fontSize: 13, cursor: "none", fontFamily: "inherit",
                    }}
                  >
                    {t.back}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  noValidate
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div style={{ marginBottom: 4 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{t.title}</h2>
                    <p style={{ fontSize: 14, color: "rgba(240,240,240,0.4)" }}>{t.subtitle}</p>
                  </div>

                  <Field label={t.name} error={errors.name}>
                    <input
                      ref={firstInputRef}
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused("")}
                      onMouseEnter={hover(true)}
                      onMouseLeave={hover(false)}
                      style={inputStyle(focused === "name", errors.name)}
                      autoComplete="name"
                    />
                  </Field>

                  <Field label={t.email} error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      onMouseEnter={hover(true)}
                      onMouseLeave={hover(false)}
                      style={inputStyle(focused === "email", errors.email)}
                      autoComplete="email"
                    />
                  </Field>

                  <Field label={t.service}>
                    <select
                      value={form.service}
                      onChange={set("service")}
                      onFocus={() => setFocused("service")}
                      onBlur={() => setFocused("")}
                      onMouseEnter={hover(true)}
                      onMouseLeave={hover(false)}
                      style={{ ...inputStyle(focused === "service", false), appearance: "none" }}
                    >
                      <option value="" style={{ background: "#141414" }}>—</option>
                      {t.services.map((s) => (
                        <option key={s} value={s} style={{ background: "#141414" }}>{s}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label={t.message} error={errors.message}>
                    <textarea
                      value={form.message}
                      onChange={set("message")}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused("")}
                      onMouseEnter={hover(true)}
                      onMouseLeave={hover(false)}
                      placeholder={t.messagePlaceholder}
                      rows={4}
                      style={{
                        ...inputStyle(focused === "message", errors.message),
                        resize: "vertical",
                        minHeight: 100,
                        placeholderColor: "rgba(240,240,240,0.2)",
                      }}
                    />
                  </Field>

                  {status === "error" && (
                    <p style={{ fontSize: 13, color: "#ff6b6b", margin: "-4px 0" }}>{t.errorBody}</p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    onMouseEnter={hover(true)}
                    onMouseLeave={hover(false)}
                    style={{
                      marginTop: 4,
                      padding: "14px 28px",
                      borderRadius: 99,
                      border: `1px solid ${ACCENT}`,
                      background: status === "sending" ? "transparent" : ACCENT + "14",
                      color: ACCENT,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: status === "sending" ? "not-allowed" : "none",
                      fontFamily: "inherit",
                      opacity: status === "sending" ? 0.6 : 1,
                      transition: "opacity 0.2s, background 0.2s",
                    }}
                    whileHover={status !== "sending" ? { background: ACCENT + "22", scale: 1.02 } : {}}
                    whileTap={status !== "sending" ? { scale: 0.98 } : {}}
                  >
                    {status === "sending" ? t.sending : t.send}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
