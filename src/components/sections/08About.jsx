import SectionShell from "../layout/SectionShell";
import { THEME } from "../../theme";

const rows = [
  {
    no: "01",
    label: "Data Story",
    content: "A literary-spatial exploration of survival, hardship, and inequality in London through Orwell’s lens.",
  },
  {
    no: "02",
    label: "Background",
    content: "This project takes Down and Out in Paris and London as its narrative anchor and extends it into a contemporary spatial reading of the city.",
  },
  {
    no: "03",
    label: "Purpose",
    content: "To examine how the cost of everyday survival reveals the shifting geography of inequality in London, then and now.",
  },
  {
    no: "04",
    label: "Dataset",
    content: [
      "Text source — Down and Out in Paris and London",
      "Historical layer — Booth Poverty Map",
      "Present-day layer — London borough cost indicators",
      "Supporting data — income, rent, house price, deprivation",
    ],
  },
  {
    no: "05",
    label: "Methodology",
    content: [
      "Narrative interpretation",
      "Spatial mapping",
      "Comparative visualisation",
      "Editorial storytelling",
    ],
  },
  {
    no: "06",
    label: "Design Thinking & Direction",
    content: [
      "Magazine-inspired layout system",
      "Quiet editorial palette",
      "Typography-led hierarchy",
      "Then / Now visual contrast",
    ],
  },
  {
    no: "07",
    label: "Team Member",
    content: ["Yifei", "Santi", "Puk"],
  },
  {
    no: "08",
    label: "Note",
    content: "This page is currently a structural draft for organising sources, methods, and project contributions before the final submission version.",
  },
];

export default function AboutSection({ activeId }) {
  return (
    <SectionShell
      id="footer-about"
      title=""
      intro=""
      isActive={activeId === "footer-about"}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1320px",
          margin: "0 auto",
          borderTop: `1px solid ${THEME.colors.line}`,
          borderBottom: `1px solid ${THEME.colors.line}`,
          background: THEME.colors.bg,
        }}
      >
        {/* top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 280px 1fr",
            borderBottom: `1px solid ${THEME.colors.line}`,
            minHeight: "76px",
          }}
        >
          <div
            style={{
              padding: "22px 20px",
              borderRight: `1px solid ${THEME.colors.line}`,
              fontFamily: THEME.fonts.sans,
              fontSize: "0.9rem",
              color: THEME.colors.muted,
            }}
          >
            Left Nav.
          </div>

          <div
            style={{
              padding: "22px 28px",
              borderRight: `1px solid ${THEME.colors.line}`,
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
              lineHeight: 1,
              color: THEME.colors.ink,
            }}
          >
            About,
          </div>

          <div
            style={{
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              fontFamily: THEME.fonts.sans,
              fontSize: "0.9rem",
              color: THEME.colors.muted,
            }}
          >
            Project structure / sources / methods / contributors
          </div>
        </div>

        {/* content rows */}
        {rows.map((row) => (
          <div
            key={row.no}
            style={{
              display: "grid",
              gridTemplateColumns: "160px 280px 1fr",
              borderBottom: `1px solid ${THEME.colors.line}`,
              minHeight: "86px",
            }}
          >
            <div
              style={{
                padding: "22px 20px",
                borderRight: `1px solid ${THEME.colors.line}`,
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                fontFamily: THEME.fonts.sans,
                color: THEME.colors.muted,
              }}
            >
              <span
                style={{
                  minWidth: "28px",
                  fontSize: "0.88rem",
                  letterSpacing: "0.04em",
                }}
              >
                {row.no}
              </span>

              <span
                style={{
                  display: "inline-block",
                  width: "42px",
                  borderBottom: `1px solid ${THEME.colors.line}`,
                  marginTop: "0.72rem",
                  opacity: 0.75,
                }}
              />
            </div>

            <div
              style={{
                padding: "22px 28px",
                borderRight: `1px solid ${THEME.colors.line}`,
                fontFamily: THEME.fonts.serif,
                fontSize: "1.08rem",
                lineHeight: 1.45,
                color: THEME.colors.ink,
              }}
            >
              {row.label}
            </div>

            <div
              style={{
                padding: "20px 28px",
                fontFamily: THEME.fonts.serif,
                fontSize: "1rem",
                lineHeight: 1.7,
                color: THEME.colors.muted,
              }}
            >
              {Array.isArray(row.content) ? (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.1rem",
                  }}
                >
                  {row.content.map((item) => (
                    <li key={item} style={{ marginBottom: "0.2rem" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0 }}>{row.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}