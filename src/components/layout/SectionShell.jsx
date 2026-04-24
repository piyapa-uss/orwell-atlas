import { THEME } from "../../theme";

export default function SectionShell({ id, title, intro, children, isActive }) {
  return (
    <section
      id={id}
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "96px 24px",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        borderTop: `1px solid ${THEME.colors.line}`,
        scrollMarginTop: "80px",
        opacity: isActive ? 1 : 0.55,
        transition: "opacity 0.45s ease",
      }}
    >
      <div 
        style={{ 
          maxWidth: "980px",
          marginLeft: "120px",
        }}
      >
        {title && (
          <h2
            style={{
              margin: "0 0 20px 0",
              color: THEME.colors.ink,
              fontFamily: THEME.fonts.serif,
              fontSize: "clamp(2.0rem, 3.5vw, 3.0rem)",
              lineHeight: 1.02,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
        )}

        {intro && (
          <p
            style={{
              margin: "0 0 28px 0",
              color: THEME.colors.muted,
              fontFamily: THEME.fonts.serif,
              fontSize: "1.15rem",
              lineHeight: 1.65,
              
            }}
          >
            {intro}
          </p>
        )}

        <div>{children}</div>
      </div>
    </section>
  );
}