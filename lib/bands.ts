import { BandProfile } from "@/lib/types";

export const bandCatalog: BandProfile[] = [
  {
    group: "Metallica",
    confidence: 94,
    alternatives: ["Megadeth", "Iron Maiden", "AC/DC"],
    image: "metallica",
    accent: "#ff4e4e",
    description:
      "Thrash metal titans with sharp angular branding, arena-sized riffs, and one of the most recognizable marks in heavy music.",
    topSongs: [
      "Enter Sandman",
      "Nothing Else Matters",
      "Master of Puppets",
      "One",
      "Fade To Black"
    ]
  },
  {
    group: "Nirvana",
    confidence: 91,
    alternatives: ["Pearl Jam", "Soundgarden", "Foo Fighters"],
    image: "nirvana",
    accent: "#f7df4d",
    description:
      "A raw grunge icon whose simple, memorable visual language turned underground noise into global culture.",
    topSongs: [
      "Smells Like Teen Spirit",
      "Come As You Are",
      "Lithium",
      "Heart-Shaped Box",
      "In Bloom"
    ]
  },
  {
    group: "Daft Punk",
    confidence: 89,
    alternatives: ["Justice", "The Chemical Brothers", "Kraftwerk"],
    image: "daftpunk",
    accent: "#7df9ff",
    description:
      "French electronic futurists known for chrome helmets, robotic silhouettes, and precision-built dance music.",
    topSongs: [
      "Get Lucky",
      "One More Time",
      "Harder, Better, Faster, Stronger",
      "Instant Crush",
      "Around the World"
    ]
  },
  {
    group: "Queen",
    confidence: 87,
    alternatives: ["The Beatles", "Led Zeppelin", "Pink Floyd"],
    image: "queen",
    accent: "#b9ff5f",
    description:
      "A theatrical rock institution with royal iconography, soaring harmonies, and a catalog built for stadiums.",
    topSongs: [
      "Bohemian Rhapsody",
      "Don't Stop Me Now",
      "Another One Bites the Dust",
      "We Will Rock You",
      "Somebody To Love"
    ]
  },
  {
    group: "Radiohead",
    confidence: 86,
    alternatives: ["Muse", "Coldplay", "The Smile"],
    image: "radiohead",
    accent: "#a78bfa",
    description:
      "Art-rock shapeshifters with anxious symbols, experimental production, and songs that keep mutating with time.",
    topSongs: ["Creep", "Karma Police", "No Surprises", "Paranoid Android", "Fake Plastic Trees"]
  },
  {
    group: "AC/DC",
    confidence: 84,
    alternatives: ["Guns N' Roses", "KISS", "Motley Crue"],
    image: "acdc",
    accent: "#ffb020",
    description:
      "Hard rock minimalists with a lightning-bolt identity, lean riffs, and instantly legible stage energy.",
    topSongs: [
      "Back In Black",
      "Highway to Hell",
      "Thunderstruck",
      "You Shook Me All Night Long",
      "T.N.T."
    ]
  }
];
