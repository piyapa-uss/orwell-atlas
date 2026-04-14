import { THEME } from "../../theme";

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: THEME.colors.bg,
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
        }}
      >
        {/* Title */}
        <h1
          style={{
            margin: "0 0 20px 0",
            color: THEME.colors.ink,
            fontFamily: THEME.fonts.serif,
            fontSize: "clamp(3.2rem, 6vw, 5.6rem)",
            lineHeight: 1.02,
            fontWeight: 500,
            letterSpacing: "-0.015em",
          }}
        >
          London: An Atlas
          <br />
          of Survival
        </h1>

        {/* Tagline */}
        <p
          style={{
            margin: "0 0 28px 0",
            color: THEME.colors.muted,
            fontFamily: THEME.fonts.serif,
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          The Cost of Survival in the City — Then and Now
        </p>

        {/* Divider */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: THEME.colors.line,
            margin: "20px auto 28px auto",
          }}
        />

        {/* Concept */}
        <p
          style={{
            margin: "0",
            color: THEME.colors.muted,
            fontFamily: THEME.fonts.serif,
            fontSize: "1.05rem",
            lineHeight: 1.7,
            maxWidth: "680px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Through the lens of George Orwell, this project examines how the cost
          of everyday survival reveals the shifting geography of inequality in
          London.
        </p>

        {/* Scroll Cue */}
        <a
          href="#why-orwell"
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "56px",
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
      </div>

      {/* animation */}
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