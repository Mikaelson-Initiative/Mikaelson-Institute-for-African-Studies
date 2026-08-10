/**
 * Pre-colonial civilizations plotted on the homepage globe (Technical Brief
 * Sec. 2). Coordinates are approximate representative points (a capital or
 * core region), not survey-precise — sufficient for a stylized globe, not a
 * historical atlas. One-line descriptions are drafted for this feature and
 * should be reviewed against the Institute's actual History & Decolonization
 * copy before this ships past the test route.
 */
export type GlobeMarker = {
  slug: string;
  name: string;
  region: "West Africa" | "East Africa" | "Central Africa" | "Southern Africa";
  lat: number;
  lon: number;
  description: string;
};

export const globeMarkers: GlobeMarker[] = [
  // West Africa
  {
    slug: "mali-empire",
    name: "Mali Empire",
    region: "West Africa",
    lat: 14,
    lon: -4,
    description: "A 13th–16th century West African empire renowned for its trade in gold and salt.",
  },
  {
    slug: "ghana-empire",
    name: "Ghana Empire (Wagadu)",
    region: "West Africa",
    lat: 15.7,
    lon: -8.0,
    description: "The earliest of the great West African trading empires, centered at Koumbi Saleh.",
  },
  {
    slug: "songhai",
    name: "Songhai",
    region: "West Africa",
    lat: 16.3,
    lon: 0,
    description: "Centered on Gao, the largest empire in West African history at its height.",
  },
  {
    slug: "oyo",
    name: "Oyo",
    region: "West Africa",
    lat: 8.5,
    lon: 4.0,
    description: "A Yoruba empire whose influence shaped the political history of the region.",
  },
  {
    slug: "benin",
    name: "Benin",
    region: "West Africa",
    lat: 6.34,
    lon: 5.62,
    description: "The Edo kingdom renowned for its bronze and brass court art.",
  },
  {
    slug: "kanem-bornu",
    name: "Kanem-Bornu",
    region: "West Africa",
    lat: 13,
    lon: 14.5,
    description: "A powerful state centered on the Lake Chad basin for nearly a millennium.",
  },
  {
    slug: "nok",
    name: "Nok",
    region: "West Africa",
    lat: 9.5,
    lon: 8.0,
    description: "An early Iron Age culture known for its distinctive terracotta sculpture.",
  },
  // East Africa
  {
    slug: "aksum",
    name: "Aksum",
    region: "East Africa",
    lat: 14.12,
    lon: 38.72,
    description: "A major trading power linking Africa, Arabia, and the Mediterranean.",
  },
  {
    slug: "kush-meroe",
    name: "Kush / Meroë",
    region: "East Africa",
    lat: 16.94,
    lon: 33.75,
    description: "A Nile Valley civilization and rival to ancient Egypt for centuries.",
  },
  {
    slug: "kilwa",
    name: "Kilwa",
    region: "East Africa",
    lat: -8.98,
    lon: 39.51,
    description: "A Swahili Coast city-state at the center of Indian Ocean trade.",
  },
  // Central Africa
  {
    slug: "kongo",
    name: "Kongo Kingdom",
    region: "Central Africa",
    lat: -6.27,
    lon: 14.25,
    description: "A centralized kingdom whose diplomacy with Europe shaped early contact history.",
  },
  {
    slug: "luba",
    name: "Luba",
    region: "Central Africa",
    lat: -8.0,
    lon: 25.0,
    description: "A Central African kingdom whose model of sacred kingship spread widely.",
  },
  {
    slug: "lunda",
    name: "Lunda",
    region: "Central Africa",
    lat: -9.0,
    lon: 22.0,
    description: "An empire built on a political system that incorporated many neighboring peoples.",
  },
  // Southern Africa
  {
    slug: "great-zimbabwe",
    name: "Great Zimbabwe",
    region: "Southern Africa",
    lat: -20.27,
    lon: 30.93,
    description: "A stone-built capital and the heart of a major southern African trading state.",
  },
  {
    slug: "mapungubwe",
    name: "Mapungubwe",
    region: "Southern Africa",
    lat: -22.19,
    lon: 29.19,
    description: "Southern Africa's first known class-based society, built on gold and ivory trade.",
  },
];
