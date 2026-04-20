import orwellImg from "../../data/images/orwell.jpg";
import SectionShell from "../layout/SectionShell";
import { THEME } from "../../theme";


export default function WhySection({ activeId }) {
  return (
    <SectionShell
      id="why-orwell"
      title="Who was George Orwell?"
      intro='"What I have most wanted to do… is to make political writing into an art." - Orwell'
      isActive={activeId === "why-orwell"}
    >

      {/* Block 1 — Who was George Orwell? */}
      <div style={{
        display: "flex",
        gap: "2.5rem",
        alignItems: "flex-start",
        marginTop: "2rem"
      }}>

        {/* Image */}
        <img
          src={orwellImg}
          alt="George Orwell"
          style={{
            width: "260px",
            flexShrink: 0,
            objectFit: "cover",
            borderRadius: "15px",
          }}
        />

        {/* Text */}
        <div>
          <p>
            Born as <strong>Eric Arthur Blair (1903–1950)</strong>, George Orwell was one of the most important British writers in history. During his lifetime, his work was deeply committed to exposing social injustice, poverty and the rise of authoritarianism in the first half of the XIX century.
          </p>
          <p>
            Unlike many intellectuals of his time, Orwell wrote about his own experiences, working as journalist for the BBC, but also as a dishwasher in Paris and sleeping in lodging houses in London, to show how deprivation is from the inside. Those experiences later forge his unique writing and deep reflection on hardships, inequality and power.
          </p>
          <p>
            Orwell wrote many well-knownclassics such as <i>Animal Farm</i> and <i>Nineteen Eighty-four</i>, two of the most influential books in history. However, he is also the author of non-fiction classics, such as <i>Down and Out in Paris in London</i>, <i>The Road to Wigan Pier</i> and <i>Homage to Catalonia</i> where he described the hard life of the voiceless and oppressed. His work continues to inspire and resonate with readers around the world, making him a timeless figure in literature and social commentary.
          </p>
  
      <div style={{ display: "flex", justifyContent: "flex-end" }}>

      <button
              onClick={() => window.open("https://www.orwellfoundation.com/the-orwell-foundation/orwell/biography/", "_blank")}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: THEME.colors.accent,
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                fontFamily: THEME.fonts.sans,
                cursor: "pointer",
                transition: "opacity 0.3s ease",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => e.target.style.opacity = "0.85"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
              Learn more
            </button>

            </div>

        </div>

      </div>

    </SectionShell>
  );
}