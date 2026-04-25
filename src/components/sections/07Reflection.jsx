import { useEffect, useRef } from "react";
import StrikeGoogle from "../../data/images/google_strike.jpg";
import RoughSleeping from "../../data/images/rough_sleeping.jpg";
import SectionShell from "../layout/SectionShell";
import { THEME } from "../../theme";

/**
 * Custom Hook: useRevealOnScroll
 * 
 * Animates elements with .reveal class on scroll using IntersectionObserver.
 * Animation: subtle fade-in + 14px translateY upward
 * 
 * Features:
 * - Respects prefers-reduced-motion for accessibility
 * - Efficient: uses IntersectionObserver and cleans up on unmount
 * - Threshold: 12%, with -40px bottom margin for early trigger
 */
function useRevealOnScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const els = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}

/**
 * ReflectionSection Component
 * 
 * The Reflection section explores how Orwell's London parallels modern-day
 * challenges in the city, including homelessness, labor, and survival.
 * 
 * Features:
 * - Scroll-triggered reveal animations
 * - Responsive typography with fluid scaling (clamp)
 * - Figure/figcaption styling
 * - Mobile-first responsive design
 */
export default function ReflectionSection({ activeId }) {
  const contentRef = useRevealOnScroll();
  const c = THEME.colors;
  const f = THEME.fonts;

  return (
    <SectionShell
      id="reflection"
      title="Reflection"
      intro=""
      isActive={activeId === "reflection"}
    >
      {/* Scoped styles for this section only */}
      <style>{`
        /* === Base container and typography === */
        .reflection-section {
          max-width: 760px;
          margin: 0 auto;
          font-family: ${f.serif};
          font-size: 1.2rem;
          line-height: 1.65;
          color: ${c.ink};
        }

        .reflection-section p {
          margin: 0 0 1.5rem;
          font-weight: 400;
        }

        .reflection-section p strong {
          font-weight: 600;
          color: ${c.ink};
        }

        .reflection-section h3 {
          font-family: ${f.serif};
          font-weight: 500;
          font-size: clamp(1.75rem, 3vw, 2.35rem);
          line-height: 1.15;
          letter-spacing: -0.005em;
          margin: 4rem 0 1.5rem;
          color: ${c.ink};
        }

        /* === Links with subtle underline === */
        .reflection-section a {
          color: ${c.accent};
          text-decoration: none;
          border-bottom: 1px solid rgba(156,68,66,.35);
          transition: border-color .2s;
        }

        .reflection-section a:hover {
          border-bottom-color: ${c.accent};
        }

        /* === Drop cap styling for first letter === */
        .reflection-section .lede::first-letter {
          font-family: ${f.serif};
          font-weight: 500;
          float: left;
          font-size: 5.2rem;
          line-height: .85;
          padding: .4rem .6rem 0 0;
          color: ${c.accent};
        }

        /* === Figure and image styling === */
        .reflection-section figure {
          margin: 3rem 0;
          padding: 0;
        }

        .reflection-section figure img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 2px;
        }

        .reflection-section figcaption {
          font-family: ${f.sans};
          font-size: .8rem;
          line-height: 1.5;
          color: ${c.muted};
          margin-top: .75rem;
          padding-left: .75rem;
          border-left: 1px solid ${c.line};
          letter-spacing: .01em;
        }

        /* === Split layout: text + image side by side === */
        .reflection-section .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
          margin: 3rem 0;
        }

        .reflection-section .split figure {
          margin: 0;
        }

        .reflection-section .split p {
          font-size: 1.1rem;
        }

        /* Portrait aspect ratio maintains visual rhythm */
        .reflection-section .split figure img {
          aspect-ratio: 4 / 5;
          object-fit: cover;
          object-position: center;
        }

        /* === Breakout figure extends beyond text column === */
        .reflection-section .breakout-figure {
          margin: 3.5rem -6rem 3rem;
        }

        @media (max-width: 1000px) {
          .reflection-section .breakout-figure {
            margin-left: 0;
            margin-right: 0;
          }
        }

        /* === Pull quotes with decorative lines === */
        .reflection-section .pullquote {
          margin: 3.5rem -2rem;
          padding: 1rem 0;
          text-align: center;
          position: relative;
        }

        .reflection-section .pullquote::before,
        .reflection-section .pullquote::after {
          content: "";
          display: block;
          width: 60px;
          height: 1px;
          background: ${c.accent};
          margin: 0 auto;
          opacity: .5;
        }

        .reflection-section .pullquote::before {
          margin-bottom: 1.75rem;
        }

        .reflection-section .pullquote::after {
          margin-top: 1.75rem;
        }

        .reflection-section .pullquote blockquote {
          margin: 0 auto;
          padding: 0;
          font-family: ${f.serif};
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.8rem, 4.2vw, 3.1rem);
          line-height: 1.18;
          letter-spacing: -0.005em;
          color: ${c.ink};
          max-width: 22ch;
        }

        .reflection-section .pullquote .mark {
          font-family: ${f.serif};
          font-style: normal;
          color: ${c.accent};
          font-size: 1.15em;
          line-height: 0;
          vertical-align: -0.15em;
          margin: 0 .05em;
          opacity: .8;
        }

        .reflection-section .pullquote cite {
          display: block;
          margin-top: 2rem;
          font-family: ${f.sans};
          font-style: normal;
          font-size: .75rem;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: ${c.muted};
          font-weight: 500;
        }

        /* === Inline quote with left accent bar === */
        .reflection-section .inline-quote {
          margin: 2.5rem 0;
          padding: 1.25rem 0 1.25rem 1.75rem;
          border-left: 3px solid ${c.accent};
          font-family: ${f.serif};
          font-style: italic;
          font-size: 1.4rem;
          line-height: 1.45;
          color: ${c.ink};
        }

        .reflection-section .inline-quote cite {
          display: block;
          margin-top: .75rem;
          font-family: ${f.sans};
          font-style: normal;
          font-size: .7rem;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: ${c.muted};
          font-weight: 500;
        }

        /* === Scroll reveal animation === */
        .reflection-section .reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 1.1s ease-out, transform 1.1s ease-out;
          will-change: opacity, transform;
        }

        .reflection-section .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* === Accessibility: Respect user motion preferences === */
        @media (prefers-reduced-motion: reduce) {
          .reflection-section .reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }

        /* === Mobile responsive adjustments === */
        @media (max-width: 720px) {
          .reflection-section .split {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .reflection-section .pullquote {
            margin: 2.5rem 0;
          }

          .reflection-section .pullquote blockquote {
            max-width: 18ch;
          }

          .reflection-section p {
            font-size: 1.1rem;
          }

          .reflection-section .lede::first-letter {
            font-size: 4rem;
          }
        }
      `}</style>

      <br />

      <div ref={contentRef} className="reflection-section">
        {/* Opening section - context about Orwell's London */}
        <div className="reveal">
          <p>
            Far from the imperial and majestic vision of London, Orwell portrayed the city as a suffocating place for those at the bottom. The East End, Southbank, and Lambeth — not so far away from The City and Westminster, the center of the power of the British Empire — were neighbourhoods in which survival was a daily negotiation.
          </p>
          <p>
            Nearly a century later, we can still see vestiges of Orwell's London still in the present. Like in the past, the east and the south of the city continue to be the areas where the working class is relegated. Perhaps it is no longer Poplar or Bow the neighbourhoods that have the worst conditions in the city, but even further. The extensive gentrification that has taken place has expulsed those with fewer resources even further away from the city center, far from opportunities and services, where transport is more more expensive and dense, and where the social fabric is more fragile.
          </p>
        </div>

        {/* Split layout: Vagrancy Act + Google strike image */}
        <div className="split">
          <div className="reveal">
            <p>
              Also, the shelters, the labour, and the hunger may have changed, but dynamics, practices and institutions of the past still survive and shape the current lives of the poor. One example are the many laws and administrative practices designed to control and discourage vagrancy in the 1930s which remained in force, with few changes, well into the modern era. The most prominent is <a href="https://www.legislation.gov.uk/ukpga/Geo4/5/83">the Vagrancy Act 1824</a> — a 200-year-old law that criminalized homelessness and begging, making sleeping outdoors a punishable offense and allowing police to arrest people without visible means of support. Far from reducing poverty, these laws deepened it, systematically dehumanising even more the lives of those who strive to survive.
            </p>
          </div>
          <figure className="reveal">
            <img
              src={StrikeGoogle}
              alt="A Google worker holds a sign at a demonstration against alleged union busting and layoffs risk outside the Kings Cross headquarters in London, Britain, April 4, 2023. REUTERS/Henry Nicholls"
            />
            <figcaption>
              A Google worker holds a sign at a demonstration against alleged union busting and layoffs risk, 2023. REUTERS/Henry Nicholls
            </figcaption>
          </figure>
        </div>

        <div className="reveal">


          <p>
            In spite of the difficulties, London is still the promised land for those who arrive in the city seeking a better future like it was in the '30s. However, as Orwell showed in Down and Out in Paris and London, London is not an easy journey. This is particularly important in the wake of the fourth industrial revolution and the rapid transformation of the job market brought by automation, AI, and the gig economy, and the increasingly unaffordable cost of living. A period of crisis that, much like the Great Slump, is likely to hit the most vulnerable the hardest. Between 2010 and 2024, <a href="https://homelessoflondon.mylondon.news/">Homeless households living in temporary accommodation in Greater London grew from 39,030 to 65,280</a>. This is, ultimately, the reason Orwell's lens remains indispensable. It allows us to see the city through the eyes of those who struggle the most to survive in it, and to understand how the past continues to shape the present.
          </p>
        </div>

        <figure className="reveal">
          <img
            src={RoughSleeping}
            alt="Rough sleeping in London. Retrieved from Inside Housing."
          />
          <figcaption>
            Rough sleeping in London. — Inside Housing
          </figcaption>
        </figure>
      </div>
    </SectionShell>
  );
}