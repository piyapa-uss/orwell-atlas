import SectionShell from "../layout/SectionShell";

export default function ConstraintSection({ activeId }) {
  return (
    <SectionShell
      id="life-under-constraint"
      title="Life Under Constraint"
      intro="This section frames poverty as a condition of constrained choice — where decisions about food, shelter, and movement are shaped by limited resources."
      isActive={activeId === "life-under-constraint"}
    >
      {/* CONTENT START */}

      {/* Example placeholder */}
      <p>Insert narrative, quotes, or diagrams here.</p>

      {/* CONTENT END */}
    </SectionShell>
  );
}