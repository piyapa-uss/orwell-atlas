import { THEME } from "../../theme";

const navItems = [
  { id: "why-orwell", label: "The Author" },
  { id: "life-under-constraint", label: "Constraint" },
  { id: "mapping-inequality", label: "Map" },
  { id: "cost-of-survival", label: "Cost" },
  { id: "survival-by-numbers", label: "Numbers" },
  { id: "then-now", label: "Then / Now" },
  { id: "reflection", label: "Reflection" },
  { id: "footer-about", label: "About" },
];

export default function TopNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(246, 243, 238, 0.88)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${THEME.colors.line}`,
      }}
    >
      <nav
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <a
          href="#top"
          style={{
            textDecoration: "none",
            color: THEME.colors.ink,
            fontFamily: THEME.fonts.serif,
            fontSize: "1.1rem",
          }}
        >
          Orwell Project
        </a>

        <div
          style={{
            display: "flex",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                textDecoration: "none",
                color: THEME.colors.muted,
                fontFamily: THEME.fonts.sans,
                fontSize: "0.92rem",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}