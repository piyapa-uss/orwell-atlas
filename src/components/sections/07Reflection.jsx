import SectionShell from "../layout/SectionShell";

export default function ReflectionSection({ activeId }) {
  return (
    <SectionShell
      id="reflection"
      title="Reflection"
      intro="This section reflects on the persistence of inequality and what it means to represent poverty through data and narrative."
      isActive={activeId === "reflection"}
    >
      {/* CONTENT START */}

      <p>Insert insights, conclusions, message.</p>

      {/* CONTENT END */}
    </SectionShell>
  );
}