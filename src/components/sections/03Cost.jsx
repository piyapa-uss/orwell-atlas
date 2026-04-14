import SectionShell from "../layout/SectionShell";

export default function CostSection({ activeId }) {
  return (
    <SectionShell
      id="cost-of-survival"
      title="The Cost of Survival"
      intro="This section traces everyday expenses — food, lodging, transport — revealing how survival is structured through spending patterns."
      isActive={activeId === "cost-of-survival"}
    >
      {/* CONTENT START */}

      <p>Insert expenditure tracking / categories / charts.</p>

      {/* CONTENT END */}
    </SectionShell>
  );
}