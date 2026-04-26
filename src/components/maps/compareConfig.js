export const MAP_SETTINGS = {
  center: [-0.12, 51.505],
  zoom: 9.2,
  minZoom: 8.7,
  maxZoom: 12,
};

export const THEN_LAYER_CONFIG = {
  booth_poverty_map: {
    id: "booth_poverty_map",
    label: "Booth Poverty Map",
    type: "raster",
    description:
      "Charles Booth's poverty map reveals the social geography of late nineteenth-century London, showing how hardship was unevenly distributed across streets and districts.",
    sourceNote:
      "Source: Charles Booth Online Archive / MapWarper rectified sheets.",
    defaultOpacity: 0.58,
    tiles: ["https://mapwarper.net/mosaics/tile/2483/{z}/{x}/{y}.png"],
    available: true,
  },

  workhouse_points: {
    id: "workhouse_points",
    label: "Workhouse Locations",
    type: "points",
    description:
      "Workhouses were part of the Poor Law welfare system, offering basic shelter and support while also enforcing strict conditions on people in poverty. In Orwell's London, they represent a visible geography of welfare, hardship, and social control.",
    sourceNote:
      "Source: compiled historical workhouse locations from public archive references.",
    available: true,
  },
};

export const NOW_LAYER_CONFIG = {
  affordability: {
    id: "affordability",
    label: "Affordability",
    property: "affordability",
    pressureMode: "high",
    description:
      "Monthly rent as a share of monthly income by borough. Higher values indicate a heavier everyday cost burden.",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
    rankingLabel: "Boroughs with the heaviest affordability pressure",
    palette: ["#F1E8D8", "#DCCFB9", "#BFAF95", "#9C8A6F", "#6F5F49", "#3F372C"],
  },

  income_monthly: {
    id: "income_monthly",
    label: "Income",
    property: "income_monthly",
    pressureMode: "low",
    description:
      "Median monthly income by borough. Lower values indicate weaker earning capacity and stronger survival pressure.",
    format: (v) => `£${Number(v).toLocaleString()}`,
    rankingLabel: "Boroughs with the weakest earning capacity",
    palette: ["#F1DFDD" , "#DDB7B2", "#C38C87", "#A76560", "#8A4745", "#5F3230"],
  },

  rent_monthly: {
    id: "rent_monthly",
    label: "Rent",
    property: "rent_monthly",
    pressureMode: "high",
    description:
      "Median monthly rent by borough. Higher values indicate greater housing cost pressure.",
    format: (v) => `£${Number(v).toLocaleString()}`,
    rankingLabel: "Boroughs with the highest rent pressure",
    palette: ["#EEF3F6", "#D6E0E7", "#AEBFCC", "#7F97A8", "#536F84", "#2F4A5E"],
  },

  house_price: {
    id: "house_price",
    label: "House Price",
    property: "house_price",
    pressureMode: "high",
    description:
      "Average house price by borough. Higher values indicate stronger barriers to home ownership.",
    format: (v) => `£${Number(v).toLocaleString()}`,
    rankingLabel: "Boroughs with the highest ownership barriers",
    palette: ["#F2F0F6", "#DDD9EA", "#BEB7D6", "#9A90BE", "#74699F", "#3F3A63"],
  },

  income_deprivation: {
    id: "income_deprivation",
    label: "Income Deprivation",
    property: "income_deprivation",
    pressureMode: "high",
    description:
      "Share of residents experiencing income deprivation by borough. Higher values indicate deeper structural hardship.",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
    rankingLabel: "Boroughs with the deepest income deprivation",
    palette: ["#EFE7E2", "#D6C6BD", "#B8A59A", "#978377", "#6F5E55", "#4A3E38"],
  },
};

export function getSortedValues(features, property) {
  return features
    .map((f) => Number(f.properties[property]))
    .filter((v) => !Number.isNaN(v))
    .sort((a, b) => a - b);
}

export function getQuantileBreaks(values, steps = 6) {
  if (!values.length) return [];
  const breaks = [];

  for (let i = 0; i < steps; i += 1) {
    const index = Math.round((i / (steps - 1)) * (values.length - 1));
    breaks.push(values[index]);
  }

  return breaks;
}

export function getStepExpression(property, breaks, palette) {
  if (!breaks?.length || !palette?.length) return "#cccccc";

  return [
    "step",
    ["to-number", ["get", property]],
    palette[0],
    breaks[1],
    palette[1],
    breaks[2],
    palette[2],
    breaks[3],
    palette[3],
    breaks[4],
    palette[4],
    breaks[5],
    palette[5],
  ];
}

export function getPaletteColor(value, breaks, palette) {
  if (!breaks?.length || !palette?.length) return "#cccccc";
  if (value <= breaks[1]) return palette[1];
  if (value <= breaks[2]) return palette[2];
  if (value <= breaks[3]) return palette[3];
  if (value <= breaks[4]) return palette[4];
  return palette[5];
}

export function getRankBarColors(palette) {
  if (!palette?.length) {
    return ["#171717", "#333333", "#555555", "#777777", "#999999"];
  }

  return [palette[1], palette[2], palette[3], palette[4], palette[5]];
}