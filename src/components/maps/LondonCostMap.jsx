import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const PALETTE = [
  "#f5f0e6",
  "#ddd6ca",
  "#beb6a8",
  "#8e877c",
  "#5f5b55",
  "#1a1a1a",
];

const LAYER_CONFIG = {
  affordability: {
    label: "Affordability",
    property: "affordability",
    description:
      "Monthly rent as a share of monthly income by borough. Higher values indicate a heavier everyday cost burden.",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
  },
  income_monthly: {
    label: "Income",
    property: "income_monthly",
    description:
      "Median monthly income by borough. Higher values indicate greater earning capacity.",
    format: (v) => `£${Number(v).toLocaleString()}`,
  },
  rent_monthly: {
    label: "Rent",
    property: "rent_monthly",
    description:
      "Median monthly rent by borough. Higher values indicate greater housing cost pressure.",
    format: (v) => `£${Number(v).toLocaleString()}`,
  },
  house_price: {
    label: "House Price",
    property: "house_price",
    description:
      "Average house price by borough. Higher values indicate stronger barriers to home ownership.",
    format: (v) => `£${Number(v).toLocaleString()}`,
  },
  income_deprivation: {
    label: "Income Deprivation",
    property: "income_deprivation",
    description:
      "Share of residents experiencing income deprivation by borough. Higher values indicate deeper structural hardship.",
    format: (v) => `${(Number(v) * 100).toFixed(1)}%`,
  },
};

function getSortedValues(features, property) {
  return features
    .map((f) => Number(f.properties[property]))
    .filter((v) => !Number.isNaN(v))
    .sort((a, b) => a - b);
}

function getQuantileBreaks(values, steps = 6) {
  if (!values.length) return [];
  const breaks = [];

  for (let i = 0; i < steps; i += 1) {
    const index = Math.round((i / (steps - 1)) * (values.length - 1));
    breaks.push(values[index]);
  }

  return breaks;
}

function getStepExpression(property, breaks) {
  if (!breaks.length) return PALETTE[0];

  return [
    "step",
    ["to-number", ["get", property]],
    PALETTE[0],
    breaks[1], PALETTE[1],
    breaks[2], PALETTE[2],
    breaks[3], PALETTE[3],
    breaks[4], PALETTE[4],
    breaks[5], PALETTE[5],
  ];
}

export default function LondonCostMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const hoveredIdRef = useRef(null);
  const popupRef = useRef(null);
  const quantilesRef = useRef({});
  const activeLayerRef = useRef("affordability");

  const [activeLayer, setActiveLayer] = useState("affordability");
  const [legendBreaks, setLegendBreaks] = useState([]);

  useEffect(() => {
    activeLayerRef.current = activeLayer;
    setLegendBreaks(quantilesRef.current[activeLayer] || []);
  }, [activeLayer]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "bg",
            type: "background",
            paint: {
              "background-color": "#f6f3ee",
            },
          },
        ],
      },
      center: [-0.12, 51.505],
      zoom: 9.2,
      minZoom: 8.7,
      maxZoom: 12,
      attributionControl: false,
      interactive: true,
    });

    map.dragPan.disable();
    map.scrollZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.touchZoomRotate.disable();

    mapRef.current = map;

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: "cost-popup",
    });

    map.on("load", async () => {
      const response = await fetch("/orwell-atlas/data/maps/london_cost_map.geojson");
      const data = await response.json();

      Object.keys(LAYER_CONFIG).forEach((key) => {
        const property = LAYER_CONFIG[key].property;
        const values = getSortedValues(data.features, property);
        quantilesRef.current[key] = getQuantileBreaks(values, 6);
      });

      setLegendBreaks(quantilesRef.current.affordability || []);

      map.addSource("london-cost", {
        type: "geojson",
        data,
        promoteId: "borough",
      });

      map.addLayer({
        id: "cost-fill",
        type: "fill",
        source: "london-cost",
        paint: {
          "fill-color": getStepExpression(
            LAYER_CONFIG.affordability.property,
            quantilesRef.current.affordability
          ),
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.96,
            0.84,
          ],
        },
      });

      map.addLayer({
        id: "cost-outline",
        type: "line",
        source: "london-cost",
        paint: {
          "line-color": "#171717",
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1.4,
            0.7,
          ],
          "line-opacity": 0.36,
        },
      });

      map.on("mousemove", "cost-fill", (e) => {
        if (!e.features || !e.features.length) return;

        const feature = e.features[0];
        const featureId = feature.id;

        if (hoveredIdRef.current !== null && hoveredIdRef.current !== featureId) {
          map.setFeatureState(
            { source: "london-cost", id: hoveredIdRef.current },
            { hover: false }
          );
        }

        hoveredIdRef.current = featureId;

        map.setFeatureState(
          { source: "london-cost", id: featureId },
          { hover: true }
        );

        const config = LAYER_CONFIG[activeLayerRef.current];
        const rawValue = feature.properties[config.property];
        const formattedValue =
          rawValue !== null && rawValue !== undefined
            ? config.format(rawValue)
            : "No data";

        popupRef.current
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: Inter, sans-serif; font-size: 12px; color: #171717;">
              <strong>${feature.properties.borough}</strong><br/>
              ${config.label}: ${formattedValue}
            </div>
          `)
          .addTo(map);
      });

      map.on("mouseleave", "cost-fill", () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState(
            { source: "london-cost", id: hoveredIdRef.current },
            { hover: false }
          );
        }
        hoveredIdRef.current = null;
        popupRef.current?.remove();
      });
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer("cost-fill")) return;

    const config = LAYER_CONFIG[activeLayer];
    const breaks = quantilesRef.current[activeLayer];

    if (!breaks) return;

    map.setPaintProperty(
      "cost-fill",
      "fill-color",
      getStepExpression(config.property, breaks)
    );

    setLegendBreaks(breaks);

    if (popupRef.current) {
      popupRef.current.remove();
    }
  }, [activeLayer]);

  const activeConfig = useMemo(() => LAYER_CONFIG[activeLayer], [activeLayer]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          inset: 0,
        }}
      />

      {/* Right Panel Tools */}
      <div
        style={{
          position: "absolute",
          bottom: "72px",
          right: "56px",
          zIndex: 30,
          width: "260px",
          boxSizing: "border-box",
          background: "rgba(246, 243, 238, 0.92)",
          border: "1px solid rgba(23,23,23,0.12)",
          borderRadius: "14px",
          padding: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.98rem",
            fontWeight: 700,
            marginBottom: "10px",
            color: "#171717",
            letterSpacing: "0em",
            lineHeight: 1.2,    
          }}
        >
          London Living Costs
        </div>
        
        {/* Block Toggle */}
        <div style={{ display: "grid", gap: "8px" }}>
            {Object.entries(LAYER_CONFIG).map(([key, config]) => {
                const isActive = activeLayer === key;

                return (
                <button
                    key={key}
                    type="button"
                    onClick={() => setActiveLayer(key)}
                    style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 54px",
                    alignItems: "center",
                    columnGap: "10px",
                    width: "100%",
                    minHeight: "34px",
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    }}
                >
                    <span
                    style={{
                        fontSize: "0.82rem",
                        lineHeight: 1.2,
                        color: "#171717",
                        fontWeight: 500,
                        textAlign: "left",
                    }}
                    >
                    {config.label}
                    </span>

                    <span
                    style={{
                        position: "relative",
                        width: "54px",
                        height: "30px",
                        borderRadius: "999px",
                        background: isActive ? "#171717" : "rgba(23,23,23,0.12)",
                        border: "1px solid rgba(23,23,23,0.10)",
                        transition: "background 0.2s ease",
                        justifySelf: "end",
                        boxSizing: "border-box",
                        flexShrink: 0,
                    }}
                    >
                    <span
                        style={{
                        position: "absolute",
                        top: "3px",
                        left: isActive ? "27px" : "3px",
                        width: "22px",
                        height: "22px",
                        borderRadius: "999px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.16)",
                        transition: "left 0.2s ease",
                        }}
                    />
                    </span>
                </button>
                );
            })}
            </div>

        <div
          style={{
            marginTop: "12px",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.74rem",
            lineHeight: 1.5,
            color: "rgba(23,23,23,0.72)",
          }}
        >
          {activeConfig.description}
        </div>

        {!!legendBreaks.length && (
          <div style={{ marginTop: "12px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: "4px",
                marginBottom: "6px",
              }}
            >
              {PALETTE.map((color) => (
                <div
                  key={color}
                  style={{
                    height: "10px",
                    background: color,
                    borderRadius: "3px",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.68rem",
                color: "rgba(23,23,23,0.60)",
              }}
            >
              <span>{activeConfig.format(legendBreaks[0])}</span>
              <span>{activeConfig.format(legendBreaks[5])}</span>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: "8px",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.72rem",
            lineHeight: 1.45,
            color: "rgba(23,23,23,0.58)",
          }}
        >
          Darker areas indicate higher values within the selected layer.
        </div>
      </div>
    </div>
  );
}