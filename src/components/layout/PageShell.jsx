import { THEME } from "../../theme";

export default function PageShell({ children }) {
  return (
    <div
      style={{
        background: THEME.colors.bg,
        color: THEME.colors.ink,
        minHeight: "100vh",
        fontFamily: THEME.fonts.sans,
      }}
    >
      {children}
    </div>
  );
}