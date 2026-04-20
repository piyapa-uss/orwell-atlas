import { useRef, useState } from "react";
import { THEME } from "../../theme";
import IncomeMap from "../maps/IncomeMap";

export default function CompareSection() {
  const [position, setPosition] = useState(50);
  const sectionRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const next = (x / rect.width) * 100;

    setPosition(Math.max(0, Math.min(100, next)));
  };

  return (
    <section
      id="then-now"
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        cursor: "ew-resize",
      }}
    >
      {/* NOW background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: THEME.colors.now,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "56px",
            right: "56px",
            color: "white",
            textAlign: "right",
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.serif,
              fontSize: "0.95rem",
              opacity: 0.8,
              marginBottom: "8px",
            }}
          >
            Present London
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              lineHeight: 1,
            }}
          >
            Now
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "56px",
            top: "170px",
            width: "min(38vw, 560px)",
            height: "min(60vh, 620px)",
            borderRadius: "20px",
            overflow: "hidden",
            border: `1px solid rgba(246, 243, 238, 0.22)`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            background: THEME.colors.surface2,
            zIndex: 10,
          }}
        >
          <IncomeMap />
        </div>

        <div
          style={{
            position: "absolute",
            right: "56px",
            bottom: "40px",
            width: "min(38vw, 560px)",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.5,
            zIndex: 11,
          }}
        >
          Median income by borough (2022–23). Darker areas indicate higher
          income.
        </div>
      </div>

      {/* THEN overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${position}%`,
          overflow: "hidden",
          background: THEME.colors.then,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 12px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "56px",
            left: "56px",
            color: THEME.colors.ink,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.serif,
              fontSize: "0.95rem",
              opacity: 0.8,
              marginBottom: "8px",
            }}
          >
            Orwell-era London
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              lineHeight: 1,
            }}
          >
            Then
          </div>
        </div>
      </div>

      {/* center caption */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "72%",
          transform: "translate(-50%, -50%)",
          width: "min(620px, 68vw)",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <p
          style={{
            fontFamily: THEME.fonts.serif,
            fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
            lineHeight: 1.6,
            color: "white",
            mixBlendMode: "difference",
            margin: 0,
          }}
        >
          Compare the geography of everyday survival across two Londons: one
          shaped by Orwell’s era, the other by the city today.
        </p>
      </div>

      {/* divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          width: "2px",
          background: THEME.colors.ink,
          transform: "translateX(-1px)",
          zIndex: 20,
        }}
      />

      {/* handle */}
      <div
        style={{
          position: "absolute",
          left: `${position}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "44px",
          height: "44px",
          borderRadius: "999px",
          background: THEME.colors.surface,
          border: `1px solid ${THEME.colors.ink}`,
          display: "grid",
          placeItems: "center",
          fontFamily: THEME.fonts.sans,
          fontSize: "0.8rem",
          cursor: "ew-resize",
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
          zIndex: 21,
        }}
      >
        ↔
      </div>
    </section>
  );
}