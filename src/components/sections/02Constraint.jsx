import { useEffect, useRef } from "react";
import BreadButter from "../../data/images/breadbutter.jpg";
import Beggar from "../../data/images/beggar.jpg";
import Strike from "../../data/images/strikes.jpg";
import StrikeGoogle from "../../data/images/google_strike.jpg";
import RoughSleeping from "../../data/images/rough_sleeping.jpg";
import Coffin from "../../data/images/Fourpence_coffin.jpg";
import Hangover from "../../data/images/hangover.jpg";
import SectionShell from "../layout/SectionShell";
import { THEME } from "../../theme";


/**
 * Hook: fades elements in on scroll. Very subtle: opacity + 14px translateY.
 * Respects prefers-reduced-motion automatically via CSS.
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


export default function ConstraintSection({ activeId }) {
  const contentRef = useRevealOnScroll();
  const c = THEME.colors;
  const f = THEME.fonts;

  return (
    <SectionShell
      id="life-under-constraint"
      title="Life Under Constraint"
      intro={'"England is a very good country when you are not poor" - Down and out in Paris and London'}
      isActive={activeId === "life-under-constraint"}
    >
      {/* Scoped styles for this section only */}
      <style>{`
        .constraint-section {
          max-width: 760px;
          margin: 0 auto;
          font-family: ${f.serif};
          font-size: 1.32rem;
          line-height: 1.7;
          color: ${c.ink};
        }
        .constraint-section p {
          font-family: ${f.serif};
          font-size: 1.32rem;
          line-height: 1.7;
          color: ${c.ink};
          margin: 0 0 1.5rem;
        }
        .constraint-section p strong { font-weight: 600; color: ${c.ink}; }
        .constraint-section h3 {
          font-family: ${f.serif};
          font-weight: 500;
          font-size: clamp(1.75rem, 3vw, 2.35rem);
          line-height: 1.15;
          letter-spacing: -0.005em;
          margin: 4rem 0 1.5rem;
          color: ${c.ink};
        }
        .constraint-section a {
          color: ${c.accent};
          text-decoration: none;
          border-bottom: 1px solid rgba(156,68,66,.35);
          transition: border-color .2s;
        }
        .constraint-section a:hover { border-bottom-color: ${c.accent}; }
 
        /* Drop cap on the first paragraph */
        .constraint-section .lede::first-letter {
          font-family: ${f.serif};
          font-weight: 500;
          float: left;
          font-size: 5.2rem;
          line-height: .85;
          padding: .4rem .6rem 0 0;
          color: ${c.accent};
        }
 
        /* Figures */
        .constraint-section figure { margin: 3rem 0; padding: 0; }
        .constraint-section figure img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 2px;
        }
        .constraint-section figcaption {
          font-family: ${f.sans};
          font-size: .8rem;
          line-height: 1.5;
          color: ${c.muted};
          margin-top: .75rem;
          padding-left: .75rem;
          border-left: 1px solid ${c.line};
          letter-spacing: .01em;
        }
 
        /* Split layouts (text + image side by side) */
        .constraint-section .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
          margin: 3rem 0;
        }
        .constraint-section .split figure { margin: 0; }
        .constraint-section .split p { font-size: 1.22rem; }
 
        /* Force all split images to a unified portrait ratio —
           keeps the visual rhythm consistent across the section.
           Use object-position per image to control which part stays visible. */
        .constraint-section .split figure img {
          aspect-ratio: 4 / 5;
          object-fit: cover;
          object-position: center;
        }
 
        /* Breakout figure — wider than text column on large screens */
        .constraint-section .breakout-figure {
          margin: 3.5rem -6rem 3rem;
        }
        @media (max-width: 1000px) {
          .constraint-section .breakout-figure { margin-left: 0; margin-right: 0; }
        }
 
        /* PULL QUOTES — the protagonists */
        .constraint-section .pullquote {
          margin: 3.5rem -2rem;
          padding: 1rem 0;
          text-align: center;
          position: relative;
        }
        .constraint-section .pullquote::before,
        .constraint-section .pullquote::after {
          content: "";
          display: block;
          width: 60px;
          height: 1px;
          background: ${c.accent};
          margin: 0 auto;
          opacity: .5;
        }
        .constraint-section .pullquote::before { margin-bottom: 1.75rem; }
        .constraint-section .pullquote::after { margin-top: 1.75rem; }
        .constraint-section .pullquote blockquote {
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
        .constraint-section .pullquote .mark {
          font-family: ${f.serif};
          font-style: normal;
          color: ${c.accent};
          font-size: 1.15em;
          line-height: 0;
          vertical-align: -0.15em;
          margin: 0 .05em;
          opacity: .8;
        }
        .constraint-section .pullquote cite {
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
 
        /* INLINE QUOTE — smaller, with left accent bar */
        .constraint-section .inline-quote {
          margin: 2.5rem 0;
          padding: 1.25rem 0 1.25rem 1.75rem;
          border-left: 3px solid ${c.accent};
          font-family: ${f.serif};
          font-style: italic;
          font-size: 1.4rem;
          line-height: 1.45;
          color: ${c.ink};
        }
        .constraint-section .inline-quote cite {
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
 
        /* SCROLL REVEAL — very subtle */
        .constraint-section .reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 1.1s ease-out, transform 1.1s ease-out;
          will-change: opacity, transform;
        }
        .constraint-section .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .constraint-section .reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
 
        /* Mobile */
        @media (max-width: 720px) {
          .constraint-section .split { grid-template-columns: 1fr; gap: 1.5rem; }
          .constraint-section .pullquote { margin: 2.5rem 0; }
          .constraint-section .pullquote blockquote { max-width: 18ch; }
          .constraint-section p { font-size: 1.1rem; }
          .constraint-section .lede::first-letter { font-size: 4rem; }
        }
      `}</style>

      <div ref={contentRef} className="constraint-section">

        {/* Block 1 — The Economic Crisis */}
        <div className="reveal">
          <p className="lede">
            In the early 1930s, London was immersed in a severe economic crisis known as the <strong>Great Slump</strong>, triggered by the <strong>Great Depression</strong> and the <strong>Wall Street Crash of 1929</strong>. One of the most visible consequences was <strong>rampant unemployment</strong>. Factory closures, wage cuts, and mass layoffs deeply affected the city, its citizens and the loads of migrants who arrived from all parts of Great Britain, drawn to the capital in search of work that, for most, simply did not exist.
          </p>
        </div>

        <div className="split">
          <figure className="reveal">
            <img
              src={Beggar}
              alt="A woman assists a disabled war veteran begging on Curzon Street. — Margaret Monck"
            />
            <figcaption>
              A woman assists a disabled war veteran begging on Curzon Street. — Monck, Margaret
            </figcaption>
          </figure>
          <div className="reveal">
            <p>
              It was a hard time and <strong>state assistance</strong>, famously known as "<em>the dole</em>", <strong>was very limited and offered only minimal relief</strong>. <a href="https://schoolhistory.co.uk/modern/dole-and-the-means-test/">The usual rate for the dole was 15 shillings per week for a man and wife (nearly £40 at today's exchange rate) and about 5s (25p) for each child</a>. Howeever, benefits were frequently reduced, and subject to humiliating bureaucratic scrutiny, posing great challenge for many families.
            </p>
            <p>
              As a result, hunger, malnutrition, and disease became increasingly common through London's streets. <strong>Long queues for food, labour exchanges, and lodging houses</strong> became the defining image of the city's poorest districts.
            </p>
          </div>
        </div>

        {/* SECOND IMAGE — breakout figure. Replace src with your new image import. */}
        <figure className="reveal breakout-figure">
          <img
            src={Strike}
            alt="Hunger marchers rest on their journey from Tyneside to London. Spender, Humphrey. © London Museum."
          />
          <figcaption>
            Hunger marchers rest on their journey from Tyneside to London -  Spender, Humphrey. © London Museum.
          </figcaption>
        </figure>

        {/* Block 2 — Tea and Two Slices */}
        <h3 className="reveal">Tea and Two Slices</h3>

        <div className="reveal">
          <p>
            <strong>Bread with butter and tea with milk were pillars of the British diet</strong>. For many, they were a light breakfast or an afternoon ritual. But in early 1930s, this modest combination became the only meal that thousands of Londoners could reliably afford once a day. And even then, butter and milk were luxuries beyond reach. <strong>Most of them contained margarine and dust tea</strong>.
          </p>
          <p>
            On luckier days, a bun, a pint of cocoa, or a bowl of <em>skilly</em> — a thin gruel of hot water and oatmeal served in lodging houses and spikes — might be all that stood between a person and an empty stomach.
          </p>
        </div>

        <figure className="reveal">
          <img
            src={BreadButter}
            alt="Blackfriars free breakfast, c. 1933, Daily Herald © Science Museum Group collection."
          />
          <figcaption>
            Blackfriars free breakfast, c. 1933. — Daily Herald © Science Museum Group collection
          </figcaption>
        </figure>

        {/* Pull quote 1 */}
        <aside className="pullquote reveal">
          <blockquote>
            <span className="mark">“</span>Knots of men stood at all the corners, slightly underfed, but kept going by the tea-and-two-slices which the Londoner swallows every two hours<span className="mark">”</span>
          </blockquote>
          <cite>Down and Out in Paris and London</cite>
        </aside>

        {/* Block 3 — The Spikes */}
        <h3 className="reveal">The Spikes</h3>

        <div className="split">
          <div className="reveal">
            <p>
              Each night, the most disadvantaged residents of the city crowded into the <em>spikes</em>. They were <strong>casual wards and common lodging houses</strong> that offered the bare minimum of shelter. <strong>Conditions inside were deliberately austere and often degrading</strong>, designed to be uncomfortable enough to discourage people from staying any longer than absolutely necessary.
            </p>
            <p>
              The buildings resembled prisons. They were poorly heated, foul-smelling, infested with bugs and diseases and overcrowded, with inadequate or no beds, scarce low-quality food, and staff who routinely treated the poor with scorn and hostility.
            </p>
          </div>
          <figure className="reveal">
            <img
              src={Coffin}
              alt="The Salvation Army Coffins. Retrieved from Terry MacEwen."
              style={{ objectPosition: "right" }}
            />
            <figcaption>
              The Salvation Army Coffins. — MacEwen, Terry.
            </figcaption>
          </figure>
        </div>

        <aside className="inline-quote reveal">
          It is a curious but well-known fact that bugs are much commoner in south than north London. For some reason they have not yet crossed the river in any great numbers.
          <cite>Down and Out in Paris and London</cite>
        </aside>

        <div className="reveal">
          <p>
            Not all spikes were the same, however. They varied widely in quality, management, and character. Some were privately run, others publicly administered; some admitted families, others just one gender; some were more tolerable than others. At the top of "luxury" were the <strong>Rowton Houses and Bruce Houses</strong>, and, a step below, the <strong>Salvation Army hostels</strong>. However, those not "lucky" enough usually ended up in ordinary <strong>common lodging houses</strong>, or even worse, in <strong>The Coffin</strong> — a literal wooden box, just large enough to lie in, with a tarpaulin for a covering -, or the infamous <strong>Twopenny Hangover</strong> - a rope stretched in front of person, which he/she would lean upon to sleep, suspended above the floor.
          </p>
        </div>

        <figure className="reveal">
          <img
            src={Hangover}
            alt="The Twopenny Hangover."
          />
          <figcaption>The Twopenny Hangover.</figcaption>
        </figure>
        <br />

        {/* Pull quote 2 */}
        <aside className="pullquote reveal">
          <blockquote>
            <span className="mark">“</span>I had never noticed one of the worst things about London — the fact that it costs money even to sit down<span className="mark">”</span>
          </blockquote>
          <cite>Down and Out in Paris and London</cite>
        </aside>

      </div>

    </SectionShell>
  );
}
