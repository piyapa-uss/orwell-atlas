import SectionShell from "../layout/SectionShell";

export default function WhySection({ activeId }) {
  return (
    <SectionShell
      id="why-orwell"
      title="Why Orwell?"
      intro="Why return to Orwell? Because his writing offers not only a literary account of poverty, but a way of seeing London as a city structured by hardship, mobility, and unequal access to survival."
      isActive={activeId === "why-orwell"}
    >
      {/* Suggested structure:
          1. Short framing text
          2. Orwell / book context
          3. Why this lens matters for London today
      */}

      <p>
        Add content here. This section should introduce George Orwell, the
        relevance of the book, and why his narrative provides a useful lens for
        understanding inequality in London.
      </p>
    </SectionShell>
  );
}