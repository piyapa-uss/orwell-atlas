import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { THEME } from "../../theme";

export default function HeroSection() {
  const [showOpen, setShowOpen] = useState(false);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const t = setTimeout(() => setShowOpen(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="top"
      style={{
        minHeight: "100vh",
        position: "relative",
        background: THEME.colors.bg,
        overflow: "hidden",
      }}
    >
      {/* TITLE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "absolute",
          left: "45%",
          top: "25%",
          transform: "translateX(-10%)",
          zIndex: 5,
          width: "min(900px, 70vw)",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            margin: "-1rem 0 0 0",
            fontFamily: THEME.fonts.serif,
            fontSize: "clamp(3rem, 4.4vw, 4.7rem)",
            lineHeight: 1,
            fontWeight: 500,
            letterSpacing: "-0.045em",
            color: THEME.colors.ink,
            whiteSpace: "normal",
            maxWidth: "900px",
          }}
        >
          London: An Atlas of Survival
        </h1>
      </motion.div>

      {/* COVER IMAGE STACK */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "49%",
          transform: "translate(-50%, -50%)",
          width: "min(1380px, 96vw)",
          zIndex: 2,
        }}
      >
        <motion.img
          src={`${base}assets/cover_close_ex.png`}
          alt=""
          style={{
            position: "absolute",
            width: "100%",
            top: 0,
            left: 0,
            display: "block",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: showOpen ? 0 : 1 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />

        <motion.img
          src={`${base}assets/cover_open_ex.png`}
          alt=""
          style={{
            width: "100%",
            display: "block",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showOpen ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </div>

      {/* TAGLINE HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showOpen ? 1 : 0, y: showOpen ? 0 : 16 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        style={{
          position: "absolute",
          left: "40%",
          top: "41%",
          transform: "translate(-50%, -50%)",
          width: "min(520px, 38vw)",
          textAlign: "center",
          zIndex: 6,
          pointerEvents: "none",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: THEME.fonts.serif,
            fontSize: "clamp(1.25rem, 1.55vw, 1.65rem)",
            lineHeight: 1.2,
            fontWeight: 700,
            letterSpacing: "0.01em",
            color: THEME.colors.muted,
          }}
        >
          The cost of survival in the city
        </h2>
      </motion.div>

      {/* TAGLINE BODY */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showOpen ? 1 : 0, y: showOpen ? 0 : 16 }}
        transition={{ delay: 0.55, duration: 0.8 }}
        style={{
          position: "absolute",
          left: "45%",
          top: "47%",
          transform: "translate(-50%, -50%)",
          width: "min(560px, 40vw)",
          textAlign: "left",
          zIndex: 6,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: THEME.fonts.serif,
            fontSize: "clamp(1.05rem, 1.2vw, 1.25rem)",
            lineHeight: 1.55,
            letterSpacing: "0.01em",
            color: THEME.colors.muted,
          }}
        >
          Through the lens of Orwell, let's explore <br />
          how the cost of everyday survival has <br />
          evolved, revealing the shifting geography <br />
          of inequality across London.
        </p>
      </motion.div>

      {/* Scroll Cue */}
      <a
        href="#why-orwell"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "90px",
          transform: "translateX(-50%)",
          zIndex: 10,
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            position: "relative",
            opacity: 0.75,
            animation: "floatDown 1.8s ease-in-out infinite",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "14px",
              height: "14px",
              borderRight: `2px solid ${THEME.colors.muted}`,
              borderBottom: `2px solid ${THEME.colors.muted}`,
              transform: "translate(-50%, -60%) rotate(45deg)",
            }}
          />
        </div>
      </a>

      <style>
        {`
          @keyframes floatDown {
            0%, 100% { transform: translateY(0); opacity: 0.55; }
            50% { transform: translateY(8px); opacity: 1; }
          }

          @media (max-width: 900px) {
            h1 {
              white-space: normal !important;
            }
          }
        `}
      </style>
    </section>
  );
}