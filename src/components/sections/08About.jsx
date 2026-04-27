import { useState } from "react";
import SectionShell from "../layout/SectionShell";
import { THEME } from "../../theme";

const rows = [
  {
    label: "Concept",
    content:
      "This project is designed as an editorial data story that explores poverty in London through the lens of George Orwell. Rather than presenting data as a static dashboard, the website frames inequality as a lived experience, connecting historical narratives with present-day urban conditions. The aim is to make poverty, shelter, mobility, and affordability readable through place-based visual storytelling.",
  },
  {
    label: "Narrative Approach",
    content:
      "Inspired by Down and Out in Paris and London, the project uses literature as a narrative entry point to understand structural inequality. Orwell’s writing gives the website a human and spatial lens: streets, lodging houses, workhouses, meals, and everyday costs become evidence of survival. The design bridges past and present by inviting users to reflect on what has changed, what persists, and how poverty continues to be shaped by urban systems.",
  },
  {
    label: "User Perspective",
    content:
      "The website is designed for a broad audience, including readers interested in literature, history, urban inequality, and cultural heritage. It avoids overly technical explanation and instead uses clear visual hierarchy, short interpretive text, and intuitive interaction. The goal is to help users understand complex social and spatial patterns without requiring prior knowledge of GIS, historical mapping, or economic indicators.",
  },
  {
    label: "Visualisation Design",
    content: [
      "Choropleth mapping is used to reveal present-day spatial inequality across London boroughs.",
      "Historical layers, including Booth’s poverty map and workhouse locations, anchor the narrative in real places.",
      "The Then / Now comparison is designed to highlight both continuity and change in the geography of survival.",
      "The visual style uses muted tones, archival textures, and editorial typography to create a reflective reading experience.",
    ],
  },
  {
    label: "Interaction Design",
    content: [
      "The swipe interaction allows users to compare historical and contemporary London within the same spatial frame.",
      "Hover and click interactions reveal additional details only when needed, reducing visual clutter.",
      "Popup cards connect historical sites with images and sources, turning abstract map points into recognisable places.",
      "The interaction is intentionally simple so that users can focus on interpretation rather than navigation.",
    ],
  },
  {
    label: "Data and Methods",
    content: [
      "Primary text source: Down and Out in Paris and London (1933).",
      "Text mining with spaCy was used to support the extraction of locations and monetary references.",
      "Historical mapping combines Booth’s Poverty Map with compiled workhouse point data.",
      "Contemporary datasets include income, rent, housing prices, and deprivation indicators.",
      "An affordability indicator was created by comparing rent with monthly income to show economic pressure.",
    ],
  },
  {
    label: "Design Principles",
    content: [
      "Editorial storytelling is prioritised over dashboard-style presentation.",
      "The design uses contrast between historical and present-day layers to support temporal comparison.",
      "Muted colour, serif typography, and generous spacing create a cultural heritage tone.",
      "The interface is designed to guide reading flow while still allowing exploration.",
    ],
  },
  {
    label: "Limitations",
    content:
      "The comparison between past and present is interpretative rather than directly equivalent. Historical data is incomplete, uneven, and often approximate, while contemporary data is aggregated at borough level and may hide local variation. The project does not claim a direct causal relationship between past and present conditions; instead, it uses visual comparison to reveal patterns, tensions, and continuities in London’s geography of survival.",
  },
  {
    label: "Team Member",
    type: "team",
    content: [
      {
        name: "Yifei Sun",
        image: "assets/team/yifei.jpeg",
        linkedin: "https://www.linkedin.com/in/yifei-sun-b8895a404",
        github: "https://github.com/Yan02y",
        email: "yan2220608529@outlook.com",
      },
      {
        name: "Santiago Soubie",
        image: "assets/team/santiago.jpeg",
        linkedin: "https://www.linkedin.com/in/ssoubiee",
        github: "https://github.com/SSoubie",
        email: "santiago.soubie.25@ucl.ac.uk",
      },
      {
        name: "Piyapa Sotthiwat",
        image: "assets/team/piyapa.jpeg",
        linkedin: "https://www.linkedin.com/in/piyapas",
        github: "https://github.com/piyapa-uss",
        email: "p.sotthiwat@gmail.com",
      },
    ],
  },
];

export default function AboutSection({ activeId }) {
  const [openIndex, setOpenIndex] = useState(0);
  const base = import.meta.env.BASE_URL;
  const current = rows[openIndex];

  const linkStyle = {
    color: THEME.colors.muted,
    fontFamily: THEME.fonts.sans,
    fontSize: "0.78rem",
    lineHeight: 1.45,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  };

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
          maxWidth: "none",
          margin: 0,
          background: THEME.colors.bg,
          minHeight: "86vh",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px minmax(0, 1fr)",
            minHeight: "86vh",
          }}
        >
          {/* LEFT SIDE */}
          <aside
            style={{
              borderRight: `1px solid ${THEME.colors.line}`,
            }}
          >
            <div
              style={{
                height: "150px",
                padding: "0 34px",
                display: "flex",
                alignItems: "center",
                fontFamily: THEME.fonts.serif,
                fontSize: "clamp(2rem, 3vw, 2.8rem)",
                lineHeight: 1,
                color: THEME.colors.ink,
                borderBottom: `1px solid ${THEME.colors.line}`,
              }}
            >
              About
            </div>

            <nav>
              {rows.map((row, index) => {
                const isOpen = openIndex === index;

                return (
                  <button
                    key={row.label}
                    type="button"
                    onMouseEnter={() => setOpenIndex(index)}
                    onFocus={() => setOpenIndex(index)}
                    onClick={() => setOpenIndex(index)}
                    style={{
                      width: "100%",
                      minHeight: "58px",
                      padding: "16px 34px",
                      border: "none",
                      borderBottom: `1px solid ${THEME.colors.line}`,
                      background: isOpen ? "#fffaf0" : "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: THEME.fonts.serif,
                      fontSize: isOpen ? "1.28rem" : "1.16rem",
                      color: THEME.colors.ink,
                      transition: "all 0.18s ease",
                    }}
                  >
                    {row.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT CONTENT */}
          <main
            style={{
              minHeight: "86vh",
              boxSizing: "border-box",
              padding: "0",
            }}
          >
            {/* Right grid line */}
            <div
              style={{
                height: "1px",
                background: THEME.colors.line,
                marginTop: "150px",   
                marginBottom: "40px",
              }}
            />

            {/* Right content inner */}
            <div
              style={{
                padding: "0 40px 64px 72px",
                maxWidth: "720px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 32px",
                  fontFamily: THEME.fonts.serif,
                  fontSize: "clamp(2rem, 3vw, 2.8rem)",
                  lineHeight: 1.05,
                  color: THEME.colors.ink,
                  fontWeight: 600,
                  maxWidth: "680px",
                }}
              >
                {current.label}
              </h2>

              {current.type === "team" ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "42px",
                    alignItems: "start",
                  }}
                >
                  {current.content.map((m) => (
                    <article key={m.name}>
                      <img
                        src={`${base}${m.image}`}
                        alt={m.name}
                        style={{
                          width: "156px",
                          height: "156px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginBottom: "22px",
                          border: `1px solid ${THEME.colors.line}`,
                        }}
                      />

                      <h3
                        style={{
                          margin: "0 0 16px",
                          fontFamily: THEME.fonts.serif,
                          fontSize: "1.55rem",
                          lineHeight: 1,
                          color: THEME.colors.ink,
                          fontWeight: 600,
                        }}
                      >
                        {m.name}
                      </h3>

                      <div
                        style={{
                          display: "grid",
                          gap: "7px",
                          fontFamily: THEME.fonts.sans,
                        }}
                      >
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          style={linkStyle}
                        >
                          LinkedIn
                        </a>
                        <a
                          href={m.github}
                          target="_blank"
                          rel="noreferrer"
                          style={linkStyle}
                        >
                          GitHub
                        </a>
                        <a href={`mailto:${m.email}`} style={linkStyle}>
                          Email
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : Array.isArray(current.content) ? (
                <div
                  style={{
                    display: "grid",
                    gap: "22px",
                    maxWidth: "820px",
                  }}
                >
                  {current.content.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "18px 1fr",
                        gap: "16px",
                        alignItems: "start",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: THEME.colors.ink,
                          marginTop: "12px",
                        }}
                      />
                      <p
                        style={{
                          margin: 0,
                          fontFamily: THEME.fonts.serif,
                          fontSize: "clamp(1.15rem, 1.55vw, 1.42rem)",
                          lineHeight: 1.55,
                          color: THEME.colors.muted,
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    margin: 0,
                    maxWidth: "680px",
                    fontFamily: THEME.fonts.serif,
                    fontSize: "clamp(1.25rem, 1.7vw, 1.55rem)",
                    lineHeight: 1.55,
                    color: THEME.colors.muted,
                  }}
                >
                  {current.content}
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    </SectionShell>
  );
}