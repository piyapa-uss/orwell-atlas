import bookCover from "../../data/images/Down-and-Out-in-Paris-and-London.jpg";
import SectionShell from "../layout/SectionShell";
import { THEME } from "../../theme";

export default function BookSection({ activeId }) {
  return (
    <SectionShell
      id="book-section"
      title="The Book"
      intro="'Down and Out in Paris and London', Orwell’s first major book, is a powerful description that exposes the hard realities of poverty in two of Europe's most iconic cities"
      isActive={activeId === "book-section"}
    >
      
      <div style={{
        display: "flex",
        gap: "2.5rem",
        alignItems: "center",
        marginTop: "2rem"
      }}>
        <div style={{ flex: 1 }}>
                    <p>
            <strong><i>Down and Out in Paris and London</i> (1933) </strong> is part a memoir, part a social document. It traces the author's experience of survival across London and Paris before earning his life as a journalist. It was one of the first literary works to give a detailed human account of <strong>what it meant to be poor in a major European city in the midst of the Great Depression and the unstable interwars period</strong>.
          </p>
          <p>
            During his stay in London, Orwell described the daily <strong>life of the tramps and exposed the hardships they suffered</strong>. He tried to demystify the <strong>ill-monster prejudice</strong> that societies built around beggars and to denounce the cruel and perverse system that locked poor people into eternal vagrancy. Almost one hundred years later, the book remains a powerful and relevant account of poverty, inequality and survival in the city.
          </p>
          <p>
            <i>"A destitute man, if he is not supported by the parish, can only get relief at the casual wards, and as each casual ward will only admit him for one night, he is automatically kept moving. He is a vagrant because, in the state of the law, it is that or starve."</i> - Down and Out in Paris and London.
          </p>
          <button
            onClick={() => window.open("https://gutenberg.net.au/ebooks01/0100171h.html", "_blank")}
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
            Access the book
          </button>
        </div>

        <img
          src={bookCover}
          alt="Down and Out in Paris and London - Book Cover"
          style={{
            width: "260px",
            flexShrink: 0,
            objectFit: "cover",
          }}
        />
      </div>

    </SectionShell>
  );
}
