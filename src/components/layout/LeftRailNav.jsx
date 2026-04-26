import { useEffect, useState } from "react";
import { THEME } from "../../theme";

const items = [
  { no: "01", label: "The Author", id: "why-orwell" },
  { no: "02", label: "Constraint", id: "life-under-constraint" },
  { no: "03", label: "Footsteps", id: "mapping-footstep" },
  { no: "04", label: "Cost", id: "cost-of-survival" },
  { no: "05", label: "Survival", id: "survival-compare" },
  { no: "06", label: "Then / Now", id: "then-now" },
  { no: "07", label: "Reflection", id: "reflection" },
  { no: "08", label: "About", id: "footer-about" },
];

export default function LeftRailNav() {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeId, setActiveId] = useState("why-orwell");
  const [showRail, setShowRail] = useState(false);

  // show rail after scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowRail(window.scrollY > window.innerHeight * 0.75);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // detect active section
  useEffect(() => {
    const sectionIds = [
      "why-orwell",
      "life-under-constraint",
      "mapping-footstep",
      "cost-of-survival",
      "survival-compare",
      "then-now",
      "reflection",
      "footer-about",
    ];

    const handleScroll = () => {
      let current = sectionIds[0];

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.35) {
          current = id;
        }
      });

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ hide rail on Then/Now section
  const shouldShowRail = showRail && activeId !== "then-now";

  return (
    <aside
      style={{
        position: "fixed",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        padding: "12px 8px",
        opacity: shouldShowRail ? 1 : 0,
        pointerEvents: shouldShowRail ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            {/* number */}
            <a
              href={`#${item.id}`}
              style={{
                textDecoration: "none",
                color: THEME.colors.muted,
                fontFamily: THEME.fonts.sans,
                fontSize: "0.88rem",
                fontWeight: 600,
                width: "28px",
                textAlign: "right",
              }}
            >
              {item.no}
            </a>

            {/* line */}
            <div
              style={{
                width: "1px",
                height: "20px",
                background: THEME.colors.line,
                position: "relative",
              }}
            >
              {(hoveredId === item.id || activeId === item.id) && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-1px",
                    width: "3px",
                    height: "20px",
                    background: THEME.colors.ink,
                  }}
                />
              )}
            </div>

            {/* label */}
            <a
              href={`#${item.id}`}
              style={{
                textDecoration: "none",
                color: THEME.colors.muted,
                fontFamily: THEME.fonts.sans,
                fontSize: "0.88rem",
                opacity:
                  hoveredId === item.id || activeId === item.id ? 1 : 0,
                transform:
                  hoveredId === item.id || activeId === item.id
                    ? "translateX(0)"
                    : "translateX(-6px)",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </a>
          </div>
        ))}
      </div>
    </aside>
  );
}