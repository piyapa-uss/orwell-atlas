import { useEffect, useRef } from "react";
import orwellImg from "../../data/images/orwell.jpg";
import bookCover from "../../data/images/Down-and-Out-in-Paris-and-London.jpg";
import SectionShell from "../layout/SectionShell";
import { THEME } from "../../theme";

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
export default function WhySection({ activeId }) {

  const contentRef = useRevealOnScroll();
  const c = THEME.colors;
  const f = THEME.fonts;


  return (
    <SectionShell
      id="why-orwell"
      title="The Lens"
      intro={'"What I have most wanted to do… is to make political writing into an art." - Why I Write, George Orwell'}
      isActive={activeId === "why-orwell"}
    >
      {/* Scoped styles — same system as the Constraint section */}
      <style>{`
        .manbook-section {
          max-width: 760px;
          margin: 0 auto;
          font-family: ${f.serif};
          font-size: 1.2rem;
          line-height: 1.65;
          color: ${c.ink};
        }
        .manbook-section p {
          font-family: ${f.serif};
          font-size: 1.2rem;
          line-height: 1.65;
          color: ${c.ink};
          margin: 0 0 1.5rem;
        }
        .manbook-section p strong { font-weight: 600; color: ${c.ink}; }
        .manbook-section h3 {
          font-family: ${f.serif};
          font-weight: 500;
          font-size: clamp(1.75rem, 3vw, 2.35rem);
          line-height: 1.15;
          letter-spacing: -0.005em;
          margin: 4rem 0 1.5rem;
          color: ${c.ink};
        }
        .manbook-section a {
          color: ${c.accent};
          text-decoration: none;
          border-bottom: 1px solid rgba(156,68,66,.35);
          transition: border-color .2s;
        }
        .manbook-section a:hover { border-bottom-color: ${c.accent}; }
 
        /* Drop cap on the first paragraph */
        .manbook-section .lede::first-letter {
          font-family: ${f.serif};
          font-weight: 500;
          float: left;
          font-size: 5.2rem;
          line-height: .85;
          padding: .4rem .6rem 0 0;
          color: ${c.accent};
        }
 
        /* Figures */
        .manbook-section figure { margin: 3rem 0; padding: 0; }
        .manbook-section figure img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 2px;
        }
        .manbook-section figcaption {
          font-family: ${f.sans};
          font-size: .8rem;
          line-height: 1.5;
          color: ${c.muted};
          margin-top: .75rem;
          padding-left: .75rem;
          border-left: 1px solid ${c.line};
          letter-spacing: .01em;
        }
 
        /* Split layouts */
        .manbook-section .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
          margin: 3rem 0;
        }
        .manbook-section .split figure { margin: 0; }
        .manbook-section .split p { font-size: 1.1rem; }
        .manbook-section .split figure img {
          aspect-ratio: 4 / 5;
          object-fit: cover;
          object-position: center;
        }
        .manbook-section .split figure.full-image img {
        aspect-ratio: 2 / 3;
        object-fit: contain;
        background: transparent;
        }

        /* PULL QUOTE */
        .manbook-section .pullquote {
          margin: 3.5rem -2rem;
          padding: 1rem 0;
          text-align: center;
          position: relative;
        }
        .manbook-section .pullquote::before,
        .manbook-section .pullquote::after {
          content: "";
          display: block;
          width: 60px;
          height: 1px;
          background: ${c.accent};
          margin: 0 auto;
          opacity: .5;
        }
        .manbook-section .pullquote::before { margin-bottom: 1.75rem; }
        .manbook-section .pullquote::after { margin-top: 1.75rem; }
        .manbook-section .pullquote blockquote {
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
        .manbook-section .pullquote .mark {
          font-family: ${f.serif};
          font-style: normal;
          color: ${c.accent};
          font-size: 1.15em;
          line-height: 0;
          vertical-align: -0.15em;
          margin: 0 .05em;
          opacity: .8;
        }
        .manbook-section .pullquote cite {
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
 
        /* INLINE QUOTE */
        .manbook-section .inline-quote {
          margin: 2.5rem 0;
          padding: 1.25rem 0 1.25rem 1.75rem;
          border-left: 3px solid ${c.accent};
          font-family: ${f.serif};
          font-style: italic;
          font-size: 1.4rem;
          line-height: 1.45;
          color: ${c.ink};
        }
        .manbook-section .inline-quote cite {
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
 
        /* BUTTONS — minor editorial style */
        .manbook-section .cta-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
        .manbook-section .cta {
          padding: 0.75rem 1.5rem;
          background-color: ${c.accent};
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-family: ${f.sans};
          cursor: pointer;
          transition: opacity 0.3s ease;
          font-weight: 500;
        }
        .manbook-section .cta:hover { opacity: 0.85; }
 
        /* SCROLL REVEAL */
        .manbook-section .reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 1.1s ease-out, transform 1.1s ease-out;
          will-change: opacity, transform;
        }
        .manbook-section .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .manbook-section .reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
 
        /* Mobile */
        @media (max-width: 720px) {
          .manbook-section .split { grid-template-columns: 1fr; gap: 1.5rem; }
          .manbook-section .pullquote { margin: 2.5rem 0; }
          .manbook-section .pullquote blockquote { max-width: 18ch; }
          .manbook-section p { font-size: 1.1rem; }
          .manbook-section .lede::first-letter { font-size: 4rem; }
          .manbook-section .cta-row { justify-content: flex-start; }
        }
      `}</style>

      <div ref={contentRef} className="manbook-section">

        {/* ========== SUBSECTION 1: THE MAN ========== */}
        <h3 className="reveal">The Man</h3>

        <div className="split">
          <figure className="reveal">
            <img
              src={orwellImg}
              alt="George Orwell"
              style={{ objectPosition: "center" }}
            />
            <figcaption>George Orwell.</figcaption>
          </figure>
          <div className="reveal">
            <p className="lede">
              Born as Eric Arthur Blair <strong>(1903–1950), George Orwell</strong> was one of the most important British writers in history. During his lifetime, his work was deeply committed to exposing social injustice, poverty and the rise of authoritarianism in the first half of the 20th century.
            </p>
            <p>
              Unlike many intellectuals of his time, Orwell wrote about his own experiences — working as a journalist for the BBC, but also as a dishwasher in Paris or sleeping in lodging houses in London — to show what deprivation felt like from the inside. Those experiences forged his unique writing and deep reflection on <strong>hardship, inequality and power</strong>.
            </p>
          </div>
        </div>

        <div className="reveal">
          <p>
            Orwell is author of many well-known classics such as <em>Animal Farm</em> and <em>Nineteen Eighty-Four</em>, two of the most influential books in history. However, he also wrote many non-fiction classics, such as <em>Down and Out in Paris and London</em>, <em>The Road to Wigan Pier</em> and <em>Homage to Catalonia</em>, where he described the life of those voiceless and oppressed. His stories were so sensitive and powerful that his work continues to inspire and resonate with readers around the world, making him a timeless figure in literature and the social question.
          </p>

          <div className="cta-row">
            <button
              className="cta"
              onClick={() => window.open("https://www.orwellfoundation.com/the-orwell-foundation/orwell/biography/", "_blank")}
            >
              Learn more about Orwell
            </button>
          </div>
        </div>

        {/* ========== PULL QUOTE — bridge between subsections ========== */}
        <aside className="pullquote reveal">
          <blockquote>
            <span className="mark">“</span>When I sit down to write a book, I do not say to myself, ‘I am going to produce a work of art’. I write it because there is some lie that I want to expose, some fact to which I want to draw attention, and my initial concern is to get a hearing.<span className="mark">”</span>
          </blockquote>
          <cite>Why I Write - George Orwell</cite>
        </aside>

        {/* ========== SUBSECTION 2: THE BOOK ========== */}
        <h3 className="reveal">The Book</h3>

        <div className="split">
          <div className="reveal">
            <p>
              <strong><em>Down and Out in Paris and London</em></strong>, published in <strong>1933</strong>, is the first full-length work by Orwell. It is part memoir, part social document. It traces the author's experience of survival across the two most opulent European cities at the time in a period of rapid changes in the world. Particularly important, it is one of the first literary works to give a detailed human account of <strong>what it meant to be poor in a major European city in the wake of the Great Depression and the unstable interwar period</strong>.
            </p>
            <p>
              In his book, Orwell described the daily <strong>life of the tramps and exposed the hardships they suffered</strong>. He tried to demystify the <strong>ill-monster prejudice</strong> that societies built around beggars, and to denounce the cruel and perverse system that locked them into eternal vagrancy.

            </p>
          </div>
          <figure className="reveal full-image">
            <img
              src={bookCover}
              alt="Down and Out in Paris and London — book cover"
              style={{ objectPosition: "center" }}
            />
            <figcaption><em>Down and Out in Paris and London</em>, 1933.</figcaption>
          </figure>
        </div>

        <div className="reveal">
         
          <p>
            Almost one hundred years later, the Down and Out in Paris and London remains more relevant than ever given the current <strong>similarities between the past and the present</strong>. It is not only a unique account of poverty, inequality and survival in the city, but also a <strong>timeless reflection on the social question and the human condition in a period of deep economic changes, social instability and political turmoil</strong>.
          </p>
        </div>

        {/* INLINE QUOTE — book excerpt */}
        <aside className="inline-quote reveal">
          A destitute man, if he is not supported by the parish, can only get relief at the casual wards, and as each casual ward will only admit him for one night, he is automatically kept moving. He is a vagrant because, in the state of the law, it is that or starve.
          <cite>Down and Out in Paris and London</cite>
        </aside>

        <div className="reveal">
          <div className="cta-row">
            <button
              className="cta"
              onClick={() => window.open("https://gutenberg.net.au/ebooks01/0100171h.html", "_blank")}
            >
              Access the book
            </button>
          </div>
        </div>

      </div>
    </SectionShell>
  );
}