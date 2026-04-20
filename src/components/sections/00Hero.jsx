import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THEME } from "../../theme";

export default function HeroSection() {
  const [showIntro, setShowIntro] = useState(false);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: THEME.colors.bg,
        padding: "92px 36px 40px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(1520px, 100%)",
          minHeight: "calc(100vh - 132px)",
          margin: "0 auto",
        }}
      >
        {/* TITLE - fixed, does not move */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "1%",
            transform: "translate(-50%, -50%)",
            zIndex: 8,
            width: "min(980px, 78vw)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: THEME.colors.ink,
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(2.6rem, 4.8vw, 4.8rem)",
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
            }}
          >
            London: An Atlas of Survival
          </h1>
        </div>

        {/* LEFT QUOTE - default */}
        <motion.img
          src={`${base}assets/quote_left.png`}
          alt=""
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: 1,
            x: showIntro ? -130 : 0,
          }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: "28%",
            top: "10%",
            transform: "translate(-50%, -50%)",
            width: "clamp(150px, 14vw, 240px)",
            zIndex: 2,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* ORWELL BLOCK - follows left with quote_left */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: 1,
            y: 0,
            x: showIntro ? -115 : 0,
          }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: "46%",
            top: "35%",
            transform: "translate(-50%, -50%)",
            width: "clamp(100px, 8vw, 140px)",
            height: "clamp(130px, 11vw, 190px)",
            background: "#171717",
            zIndex: 4,
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <img
            src={`${base}assets/orwell.png`}
            alt="George Orwell"
            style={{
              width: "108%",
              height: "100%",
              objectFit: "contain",
              transform: "translateY(22px)",
              pointerEvents: "none",
              userSelect: "none",
              filter: "grayscale(100%)",
            }}
          />
        </motion.div>

        {/* RIGHT QUOTE - moves right */}
        <motion.img
          src={`${base}assets/quote_right.png`}
          alt=""
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: 1,
            x: showIntro ? 170 : 0,
          }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: "58%",
            top: "35%",
            transform: "translate(-50%, -50%)",
            width: "clamp(150px, 14vw, 240px)",
            zIndex: 3,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* REVEAL TEXT */}
        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "35%",
                transform: "translateY(-50%)",
                width: "min(420px, 30vw)",
                textAlign: "left",
                zIndex: 9,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: THEME.colors.muted,
                  fontFamily: THEME.fonts.serif,
                  fontSize: "clamp(1rem, 1.15vw, 1.2rem)",
                  lineHeight: 1.45,
                }}
              >
                The Cost of Survival in the City
              </p>

              <div
                style={{
                  width: "52px",
                  height: "1px",
                  background: THEME.colors.line,
                  margin: "16px 0 16px 0",
                }}
              />

              <p
                style={{
                  margin: 0,
                  color: THEME.colors.muted,
                  fontFamily: THEME.fonts.serif,
                  fontSize: "clamp(0.95rem, 0.98vw, 1.08rem)",
                  lineHeight: 1.7,
                  maxWidth: "420px",
                }}
              >
                Through the lens of George Orwell, this project examines
                how the cost of everyday survival reveals
                the shifting geography of inequality in London.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Cue */}
      <a
        href="#why-orwell"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "30px",
          transform: "translateX(-50%)",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          textDecoration: "none",
          zIndex: 10,
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
            0%, 100% {
              transform: translateY(0);
              opacity: 0.55;
            }
            50% {
              transform: translateY(8px);
              opacity: 1;
            }
          }
        `}
      </style>
    </section>
  );
}