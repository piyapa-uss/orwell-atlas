import { useEffect, useState } from "react";
import PageShell from "./components/layout/PageShell";
import TopNav from "./components/layout/TopNav";
import LeftRailNav from "./components/layout/LeftRailNav";
import SectionShell from "./components/layout/SectionShell";
import HeroSection from "./components/sections/00Hero";
import WhySection from "./components/sections/01Why";
import ConstraintSection from "./components/sections/02Constraint";
import CostSection from "./components/sections/03Cost";
import MapSection from "./components/sections/04Map";
import CompareSection from "./components/sections/05Compare";
import NumbersSection from "./components/sections/06Numbers";
import ReflectionSection from "./components/sections/07Reflection";
import AboutSection from "./components/sections/08About"; 

export default function App() {
  const [activeId, setActiveId] = useState("why-orwell");

  useEffect(() => {
    const sectionIds = [
      "why-orwell",
      "life-under-constraint",
      "mapping-inequality",
      "cost-of-survival",
      "survival-by-numbers",
      "then-now",
      "reflection",
      "footer-about",
    ];

    const handleScroll = () => {
      let current = sectionIds[0];

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          current = id;
        }
      });

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PageShell>
      <div id="top" />
      <TopNav />
      <LeftRailNav />

      <HeroSection />
      <WhySection activeId={activeId} />
      <ConstraintSection activeId={activeId} />
      <MapSection activeId={activeId} />
      <CostSection activeId={activeId} />
      <NumbersSection activeId={activeId} />
      <CompareSection activeId={activeId} />
      <ReflectionSection activeId={activeId} />
      <AboutSection activeId={activeId} />
      
    </PageShell>
  );
}