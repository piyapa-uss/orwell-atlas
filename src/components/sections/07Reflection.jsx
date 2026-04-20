import SectionShell from "../layout/SectionShell";
import { THEME } from "../../theme";

export default function ReflectionSection({ activeId }) {
  return (
    <SectionShell
      id="reflection"
      title="Reflection"
      intro=""
      isActive={activeId === "reflection"}
    >
      <div
        style={{
          minHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "4rem 0 3rem",
        }}
      >
        {/* small kicker */}
        <div
          style={{
            fontFamily: THEME.fonts.sans,
            fontSize: "0.82rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(23,23,23,0.52)",
            marginBottom: "2.25rem",
          }}
        >
          Reflection
        </div>

        {/* lead lines */}
        <div
          style={{
            width: "min(760px, 78vw)",
            marginBottom: "3.4rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(1.45rem, 2.2vw, 2.15rem)",
              lineHeight: 1.45,
              color: THEME.colors.ink,
            }}
          >
            Survival in London is not abstract—it is lived, daily, and deeply
            personal.
          </p>

          <p
            style={{
              margin: "1.6rem 0 0",
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(1.05rem, 1.45vw, 1.28rem)",
              lineHeight: 1.8,
              color: "rgba(23,23,23,0.72)",
            }}
          >
            London remains an atlas of survival. In the spaces between Orwell’s
            lines, what the city often conceals continues to surface. What
            endures is not only the city itself, but the truth within his
            narrative—still resonant, still contemporary.
          </p>
        </div>

        {/* quote block */}
        <div
          style={{
            width: "min(980px, 88vw)",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-block",
              maxWidth: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "-0.08em",
                top: "-0.12em",
                fontFamily: THEME.fonts.serif,
                fontSize: "clamp(4rem, 8vw, 7rem)",
                lineHeight: 1,
                color: "rgba(23,23,23,0.18)",
                pointerEvents: "none",
              }}
            >
              “
            </div>

            <blockquote
              style={{
                margin: 0,
                padding: "0 1.6rem",
                fontFamily: THEME.fonts.serif,
                fontStyle: "italic",
                fontSize: "clamp(1.4rem, 2.8vw, 2.6rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
                color: THEME.colors.ink,
              }}
            >
              It is a feeling of relief,
              <br />
              almost of pleasure, at knowing
              <br />
              yourself at last genuinely down and out.
            </blockquote>

            <div
              style={{
                position: "absolute",
                right: "-0.03em",
                bottom: "-0.18em",
                fontFamily: THEME.fonts.serif,
                fontSize: "clamp(4rem, 8vw, 7rem)",
                lineHeight: 1,
                color: "rgba(23,23,23,0.18)",
                pointerEvents: "none",
              }}
            >
              ”
            </div>
          </div>

          <div
            style={{
              marginTop: "1.8rem",
              fontFamily: THEME.fonts.serif,
              fontSize: "0.9rem",
              opacity: 0.7,
              lineHeight: 1.5,
              color: "rgba(23,23,23,0.7)",
            }}
          >
            — George Orwell, <em>Down and Out in Paris and London — </em>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}