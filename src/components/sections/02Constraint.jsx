import BreadButter from "../../data/images/breadbutter.jpg";
import Beggar from "../../data/images/beggar.jpg";
import RoughSleeping from "../../data/images/rough_sleeping.jpg";
import Coffin from "../../data/images/Fourpence_coffin.jpg";
import Hangover from "../../data/images/hangover.jpg";
import SectionShell from "../layout/SectionShell";

export default function ConstraintSection({ activeId }) {
  return (
    <SectionShell
      id="life-under-constraint"
      title="Life Under Constraint"
      intro = '"England is a very good country when you are not poor" - Down and out in Paris and London'
      isActive={activeId === "life-under-constraint"}
    >
      {/* CONTENT START */}

      {/* Block 1 — The Economic Crisis */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", margin: "2rem 0" }}>
        <div style={{ flex: 1 }}>
          <p>
            In the early 1930s, London was immersed in a severe economic crisis known as the <strong>Great Slump</strong>, triggered by the <strong>Great Depression</strong> following the <strong>Wall Street Crash of 1929</strong>. One of the most visible consequences was <strong>rampant unemployment</strong>. Factory closures, wage cuts, and mass layoffs deeply affected the city, and the situation was made worse by a steady influx of migrants arriving from across the British Isles, all drawn to the capital in search of work that, for most, simply did not exist.
          </p>
          <p style={{ marginBottom: "2rem" }}>
            At the same time, <strong>state assistance</strong>, also known as "<i>the dole</i>", <strong>was very limited and offered only minimal relief</strong>. Benefits werefrequently reduced, and subject to humiliating bureaucratic scrutiny, posing great challenge for many families. As a result, hunger, malnutrition, and disease became increasingly common through London's streets. <strong>Long queues for food, labour exchanges, and lodging houses</strong> became the defining image of the city's poorest districts.
          </p>
        </div>
        <img
          src={Beggar}
          alt="A woman assists a disabled war veteran begging on Curzon Street. Monck, Margaret."
          style={{
            width: "280px",
            maxWidth: "100%",
            objectFit: "cover",
            flexShrink: 0,
            borderRadius: "15px",
          }}
        />
      </div>

      {/* Block 2 — Tea and Two Slices */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", marginTop: "1.5rem" }}>
        <img
          src={BreadButter}
          alt="Blackfriars free breakfast, c. 1933, Daily Herald © Science Museum Group collection."
          style={{
            width: "320px",
            maxWidth: "100%",
            flexShrink: 0,
            objectFit: "cover",
            borderRadius: "15px",

          }}
        />
        <div style={{ flex: 1 }}>
          <h3>Tea and Two Slices</h3>
          <p>
            Bread with butter and tea with milk were pillars of the British diet. For many, they were a light breakfast or an afternoon ritual. But in early 1930s, this modest combination became the only meal that thousands of Londoners could reliably afford once a day. And even then, butter and milk were luxuries beyond reach. Most of them contained margarine and dust tea. On luckier days, a bun, a pint of cocoa, or a bowl of skilly (a thin gruel of hot water and oatmeal served in lodging houses and spikes) x|might be all that stood between a person and an empty stomach.
          </p>
          <p style={{ marginBottom: "2rem" }}>
            <i>"Knots of men stood at all the corners, slightly underfed, but kept going by the tea-and-two-slices which the Londoner swallows every two hours"</i>. - Down and Out in Paris and London.
          </p>
        </div>
      </div>

      {/* Block 3 — The Spikes */}
      <h3>The Spikes</h3>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <p>
            Each night, the most disadvantaged residents of the city crowded into the <i>spikes</i>. They were <strong>casual wards and common lodging houses</strong> that offered the bare minimum of shelter. <strong>Conditions inside were deliberately austere and often degrading</strong>, designed to be uncomfortable enough to discourage people from staying any longer than absolutely necessary. The buildings resembled prisons: poorly heated, foul-smelling, and overcrowded, with inadequate beds, scarce low-quality food, and staff who routinely treated the poor with scorn and hostility.
          </p>
          <p>
            Not all spikes were the same, however. They varied widely in quality, management, and character. Some were privately run, others publicly administered; Some admited families, other just one gender: Some were more tolerable than others. 
          </p>
        </div>
        <img
          src={Coffin}
          alt="The Salvation Army Coffins. Retrieved from Terry MacEwen."
          style={{
            width: "240px",
            maxWidth: "100%",
            flexShrink: 0,
            objectFit: "cover",
            borderRadius: "15px",
          }}
        />
      </div>

      <p>
        At the top of “luxury” were the <strong>Rowton Houses and Bruce Houses</strong>, the most decent option available to those with a shilling to spare. For that price, a man could secure his own cubicle and access to a decent bathroom. They were “splendid buildings”, but their strict internal discipline was well-known. 
      </p>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <img
          src={Hangover}
          alt="The Twopenny Hangover."
          style={{
            width: "240px",
            maxWidth: "100%",
            flexShrink: 0,
            objectFit: "cover",
            borderRadius: "15px",
          }}
        />
        <div style={{ flex: 1 }}>
          <p>
            A step below were the <strong>Salvation Army hostels</strong>. Most were reasonably clean and offered basic shower facilities at minimal cost. Accommodation varied: some provided private cubicles, while others packed up to forty men into a single shared room.
          </p>
          <p>
            Further down the scale came the ordinary common <strong>lodging houses</strong>. They were stuffy, noisy, and dirty. However, their laissez-faire atmosphere and vivid social gatherings transformed them into places where people could forget the hardships of the day. To sleep in those places was nearly impossible: Beds, usually up  to fifty or sixty together in the same room, were really small and uncomfortable, and sheet were dirty and never enough. 
          </p>
          <p>
            For fourpence a night, a man could rent <strong>a coffin</strong>, a literal wooden box, just large enough to lie in, with a tarpaulin for a covering. They were cold, infested with bugs and offered nothing beyond the roof overhead. 
          </p>
        </div>
      </div>

      {/* Block 9 — The Lens */}
      <div>
          <h3>The Lens</h3>
          <p>
            <i>"I had been in London innumerable times, and yet till that day I had never noticed one of the worst things about London—the fact that it costs money even to sit down. In Paris, if you had no money and could not find a public bench, you would sit on the pavement. Heaven knows what sitting on the pavement would lead to in London—prison, probably".</i> - Down and Out in Paris and London.
          </p>
          <p>
            Far from the imperial and majestic vision of London, Orwell portrayed the city as a suffocating place for those at the bottom. The East End, Southbank, and Lambeth, not so far away from The City and Westminster, the center of the power of the British empire, the biggest empire of the world at that time, were neighbourhoods in which survival was a daily negotiation.
          </p>
          <p>
           Nearly a century later, Orwell's London remains surprisingly intact. The shelters, the labour, the hunger may have chaged, but dymanics, practices and institutions of the past still survive and shape the lives of the poor.
          </p>
      </div>
      <div style={{ display: "flex", alignItems: "center"}}>
        <div style={{ flex: 1 }}>
          <p>
            For example, many of the laws and administrative practices designed to control and discourage vagrancy in the 1930s remained in force, with few changes, well into the modern era. The most prominent of these is <a href="https://www.legislation.gov.uk/ukpga/Geo4/5/83">the Vagrancy Act 1824</a>. This 200 year old law, which criminalized homelessness and begging by making sleeping outdoors a punishable offense and allowing police to arrest people without visible means of support, remained enforceable into the present in spite of several amendments. 
          </p>
          <p>
            Far from reducing poverty, these laws deepened it, systematically dehumanising the lives of those they claimed to regulate. They are, ultimately, the reason Orwell's lens remains indispensable — not merely as literature, but as a tool for understanding how inequality persists, shifts, and reproduces itself in one of the world's wealthiest cities in this age of rapid economical and social change due to the impact of the fouth industrial revoulition and IA and the rise of the new far-right.
          </p>
        </div>
        <img
          src={RoughSleeping}
          alt="Rough sleeping in London. Retrieved from Inside Housing."
          style={{
            width: "320px",
            maxWidth: "100%",
            objectFit: "cover",
            flexShrink: 0,
            borderRadius: "15px",
          }}
        />
      </div>

      {/* CONTENT END */}
    </SectionShell>
  );
}