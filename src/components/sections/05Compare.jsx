import { useEffect, useRef, useState } from "react";
import { THEME } from "../../theme";
import CompareMap from "../maps/CompareMap";

export default function CompareSection() {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sectionRef = useRef(null);

  const updatePosition = (clientX) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const next = (x / rect.width) * 100;

    setPosition(Math.max(14, Math.min(86, next)));
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  return (
    <section
      id="then-now"
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        cursor: isDragging ? "ew-resize" : "default",
        background: THEME.colors.bg,
      }}
    >
      <CompareMap swipePosition={position} />

      {/* THEN label */}
      <div
        style={{
          position: "absolute",
          top: "74px",
          left: "72px",
          color: THEME.colors.ink,
          zIndex: 42,
          pointerEvents: "none",
          textShadow: "0 1px 10px rgba(246,243,238,0.55)",
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.serif,
            fontSize: "clamp(3.2rem, 6vw, 6rem)",
            lineHeight: 0.88,
            fontWeight: 500,
          }}
        >
          Then
        </div>

        <div
          style={{
            fontFamily: THEME.fonts.serif,
            fontSize: "1.05rem",
            opacity: 0.78,
            marginTop: "10px",
            letterSpacing: "0.02em",
          }}
        >
          Historical London · c. 1900
        </div>
      </div>

      {/* NOW label */}
      <div
        style={{
          position: "absolute",
          top: "74px",
          right: "72px",
          textAlign: "right",
          zIndex: 42,
          pointerEvents: "none",
          textShadow: "0 1px 10px rgba(246,243,238,0.55)",
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.serif,
            fontSize: "clamp(3.2rem, 6vw, 6rem)",
            lineHeight: 0.88,
            fontWeight: 500,
            color: "rgba(23,23,23,0.72)",
          }}
        >
          Now
        </div>

        <div
          style={{
            fontFamily: THEME.fonts.serif,
            fontSize: "1.05rem",
            opacity: 0.76,
            marginTop: "10px",
            color: "rgba(23,23,23,0.72)",
            letterSpacing: "0.02em",
          }}
        >
          Present London · 2019–2026
        </div>
      </div>

      {/* Story / instruction card */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "38px",
          transform: "translateX(-50%)",
          width: "min(620px, 56vw)",
          zIndex: 44,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(246,243,238,0.82)",
            border: "1px solid rgba(23,23,23,0.10)",
            borderLeft: "8px solid rgba(23,23,23,0.13)",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
            backdropFilter: "blur(7px)",
            padding: "18px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(1.1rem, 1.45vw, 1.34rem)",
              lineHeight: 1.15,
              color: "rgba(23,23,23,0.82)",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            London across time
          </div>

          <p
            style={{
              fontFamily: THEME.fonts.sans,
              fontSize: "0.78rem",
              lineHeight: 1.55,
              color: "rgba(23,23,23,0.58)",
              margin: 0,
            }}
          >
            Compare historical sites of hardship with present-day borough-level affordability pressure. Drag the divider, switch layers, and hover the map to trace how survival constraints shift across London.
          </p>
        </div>
      </div>

      {/* divider line - limited to map frame, not top nav */}
      <div
        style={{
          position: "absolute",
          top: "64px",
          bottom: "98px",
          left: `${position}%`,
          width: "2px",
          background: "rgba(23,23,23,0.82)",
          transform: "translateX(-1px)",
          zIndex: 50,
          pointerEvents: "none",
          boxShadow: "0 0 0 1px rgba(246,243,238,0.28)",
        }}
      />

      {/* handle */}
      <button
        type="button"
        onPointerDown={handleDragStart}
        aria-label="Drag comparison slider"
        style={{
          position: "absolute",
          left: `${position}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "46px",
          height: "46px",
          borderRadius: "999px",
          background: "rgba(245,240,219,0.96)",
          border: `1px solid ${THEME.colors.ink}`,
          display: "grid",
          placeItems: "center",
          fontFamily: THEME.fonts.sans,
          fontSize: "0.86rem",
          color: THEME.colors.ink,
          cursor: "ew-resize",
          boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
          zIndex: 51,
          touchAction: "none",
        }}
      >
        ↔
      </button>
    </section>
  );
}