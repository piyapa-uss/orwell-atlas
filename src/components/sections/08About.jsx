import SectionShell from "../layout/SectionShell";

export default function AboutSection({ activeId }) {
  return (
    <SectionShell
      id="footer-about"
      title="About"
      intro="This project combines literary analysis, spatial data, and visual storytelling to explore inequality in London."
      isActive={activeId === "footer-about"}
    >
      {/* CONTENT START */}

      <p>Insert team info, data sources, methods.</p>

      {/* CONTENT END */}
    </SectionShell>
  );
}