import { BandProfile } from "@/lib/types";

export const bandCatalog: BandProfile[] = [
  {
    group: "Metallica",
    confidence: 94,
    alternatives: ["Megadeth", "Iron Maiden", "AC/DC"],
    image: "metallica",
    accent: "#ff4e4e",
    description:
      "Титаны трэш-метала с острым угловатым стилем, стадионными риффами и одним из самых узнаваемых знаков в тяжёлой музыке.",
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
      "Икона гранжа, чей простой и запоминающийся визуальный язык превратил андеграундный шум в явление мировой культуры.",
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
      "Французские электронные футуристы, известные хромированными шлемами, роботизированными силуэтами и безупречно выстроенной танцевальной музыкой.",
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
      "Легенды театрального рока с королевской символикой, величественными гармониями и песнями, созданными для стадионов.",
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
      "Мастера арт-рока с тревожной символикой, экспериментальным звучанием и песнями, которые продолжают меняться со временем.",
    topSongs: ["Creep", "Karma Police", "No Surprises", "Paranoid Android", "Fake Plastic Trees"]
  },
  {
    group: "AC/DC",
    confidence: 84,
    alternatives: ["Guns N' Roses", "KISS", "Motley Crue"],
    image: "acdc",
    accent: "#ffb020",
    description:
      "Минималисты хард-рока с фирменной молнией, лаконичными риффами и мгновенно узнаваемой сценической энергией.",
    topSongs: [
      "Back In Black",
      "Highway to Hell",
      "Thunderstruck",
      "You Shook Me All Night Long",
      "T.N.T."
    ]
  }
];
