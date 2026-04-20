import { useEffect, useRef, useState } from "react";
import { THEME } from "../../theme";
import LondonCostMap from "../maps/LondonCostMap";

export default function CompareSection() {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sectionRef = useRef(null);

  const updatePosition = (clientX) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const next = (x / rect.width) * 100;

    setPosition(Math.max(0, Math.min(100, next)));
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
        <LondonCostMap />

        <div
          style={{
            position: "absolute",
            top: "56px",
            right: "56px",
            textAlign: "right",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.serif,
              fontSize: "0.95rem",
              opacity: 0.78,
              marginBottom: "8px",
              color: "rgba(23,23,23,0.72)",
            }}
          >
            Present London
          </div>
          <div
            style={{
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              lineHeight: 1,
              color: "rgba(23,23,23,0.72)",
            }}
          >
            Now
          </div>
        </div>
      </div>

      {/* THEN overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${position}%`,
          overflow: "hidden",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <img
            src="/orwell-atlas/data/maps/booth_map.png"
            alt="Booth Poverty Map"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.8,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "56px",
              left: "56px",
              color: THEME.colors.ink,
              pointerEvents: "none",
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
              Historical London (c. 1900)
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
      </div>

      {/* caption */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "36px",
          transform: "translateX(-50%)",
          width: "min(760px, 72vw)",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 12,
        }}
      >
        <p
          style={{
            fontFamily: THEME.fonts.serif,
            fontSize: "clamp(1rem, 1.55vw, 1.28rem)",
            lineHeight: 1.55,
            color: "#171717",
            margin: 0,
            background: "rgba(246,243,238,0.74)",
            padding: "10px 16px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          Read London across two moments in time: a historical geography of
          hardship on the left, and the uneven costs of urban survival on the
          right.
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
          pointerEvents: "none",
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
          touchAction: "none",
        }}
      >
        ↔
      </button>
    </section>
  );
}