import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  MAP_SETTINGS,
  NOW_LAYER_CONFIG,
  THEN_LAYER_CONFIG,
  getPaletteColor,
  getQuantileBreaks,
  getRankBarColors,
  getSortedValues,
  getStepExpression,
} from "./compareConfig";

function setupInteractions(map) {
  map.touchZoomRotate.disableRotation();
}

function createBaseStyle() {
  return {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© CARTO © OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "osm-base",
        type: "raster",
        source: "osm",
        paint: {
          "raster-opacity": 0.92,
        },
      },
    ],
  };
}

function createOverlayStyle() {
  return {
    version: 8,
    sources: {},
    layers: [
      {
        id: "overlay-bg",
        type: "background",
        paint: {
          "background-color": "rgba(0,0,0,0)",
          "background-opacity": 0,
        },
      },
    ],
  };
}

function shortenBorough(name) {
  const shortMap = {
    "Kensington and Chelsea": "Kensington & Chelsea",
    "Barking and Dagenham": "Barking & Dagenham",
    "Hammersmith and Fulham": "Hammersmith & Fulham",
    "Richmond upon Thames": "Richmond",
    "Richmond-upon-Thames": "Richmond",
    "Kingston upon Thames": "Kingston",
    "City of London": "City",
  };

  return shortMap[name] || name;
}

function getPressureValue(config, value) {
  if (config.pressureMode === "low") return -value;
  return value;
}

function getRankedBoroughs(features, config, breaks, palette, mode) {
  const rows = features
    .map((feature) => {
      const value = Number(feature.properties[config.property]);
      if (Number.isNaN(value)) return null;

      return {
        borough: feature.properties.borough,
        value,
        pressureValue: getPressureValue(config, value),
        mapColor: getPaletteColor(value, breaks, palette),
      };
    })
    .filter(Boolean);

  const sorted =
    mode === "most"
      ? rows.sort((a, b) => b.pressureValue - a.pressureValue)
      : rows.sort((a, b) => a.pressureValue - b.pressureValue);

  return sorted.slice(0, 5).sort((a, b) => a.value - b.value);
}

function buildWorkhousePopup(props, lngLat) {
  const name = props.name || "Workhouse";
  const type = props.type || "Workhouse";
  const certainty = props.certainty || "unknown";
  const note =
    props.note ||
    "A historical workhouse location associated with Poor Law welfare and urban hardship.";
  const source = props.source || props.link || props.url || "";

  const lon = Number(lngLat.lng).toFixed(5);
  const lat = Number(lngLat.lat).toFixed(5);

  const sourceHtml = source
    ? `<a href="${source}" target="_blank" rel="noreferrer" style="color:#171717;text-decoration:underline;">Source / more info</a>`
    : `<span style="color:rgba(23,23,23,0.52);">Source link unavailable</span>`;

  return `
    <div style="font-family: Cormorant Garamond, Georgia, serif; width: 240px; color: #171717;">
      <div style="font-size: 17px; font-weight: 500; line-height: 1.1; margin-bottom: 6px;">
        ${name}
      </div>
      <div style="font-family: Inter, sans-serif; font-size: 10.5px; color: rgba(23,23,23,0.58); margin-bottom: 8px; letter-spacing:0.04em; text-transform:uppercase;">
        ${type} · certainty: ${certainty}
      </div>
      <div style="font-size: 14px; line-height: 1.35; margin-bottom: 8px; color:rgba(23,23,23,0.76);">
        ${note}
      </div>
      <div style="font-family: Inter, sans-serif; font-size: 10.5px; line-height: 1.45; color: rgba(23,23,23,0.58); margin-bottom: 8px;">
        Coordinates: ${lat}, ${lon}
      </div>
      <div style="font-family: Inter, sans-serif; font-size: 10.5px;">
        ${sourceHtml}
      </div>
    </div>
  `;
}

export default function CompareMap({ swipePosition }) {
  const baseMapContainer = useRef(null);
  const thenMapContainer = useRef(null);
  const nowMapContainer = useRef(null);

  const baseMapRef = useRef(null);
  const thenMapRef = useRef(null);
  const nowMapRef = useRef(null);

  const popupRef = useRef(null);
  const workhousePopupRef = useRef(null);

  const hoveredIdRef = useRef(null);
  const hoveredWorkhouseIdRef = useRef(null);
  const selectedWorkhouseIdRef = useRef(null);
  const quantilesRef = useRef({});
  const activeNowLayerRef = useRef("affordability");
  const syncingRef = useRef(false);

  const [activeThenLayers, setActiveThenLayers] = useState({
    booth_poverty_map: true,
    workhouse_points: true,
  });

  const [boothOpacity, setBoothOpacity] = useState(
    THEN_LAYER_CONFIG.booth_poverty_map.defaultOpacity || 0.58
  );

  const [activeNowLayer, setActiveNowLayer] = useState("affordability");
  const [rankingMode, setRankingMode] = useState("most");
  const [legendBreaks, setLegendBreaks] = useState([]);
  const [nowFeatures, setNowFeatures] = useState([]);
  const [hoveredBorough, setHoveredBorough] = useState(null);

  useEffect(() => {
    activeNowLayerRef.current = activeNowLayer;
    setLegendBreaks(quantilesRef.current[activeNowLayer] || []);
  }, [activeNowLayer]);

  useEffect(() => {
    if (!baseMapContainer.current || baseMapRef.current) return;
    if (!thenMapContainer.current || thenMapRef.current) return;
    if (!nowMapContainer.current || nowMapRef.current) return;

    const baseMap = new maplibregl.Map({
      container: baseMapContainer.current,
      style: createBaseStyle(),
      center: MAP_SETTINGS.center,
      zoom: MAP_SETTINGS.zoom,
      minZoom: MAP_SETTINGS.minZoom,
      maxZoom: MAP_SETTINGS.maxZoom,
      attributionControl: false,
      interactive: true,
    });

    const thenMap = new maplibregl.Map({
      container: thenMapContainer.current,
      style: createOverlayStyle(),
      center: MAP_SETTINGS.center,
      zoom: MAP_SETTINGS.zoom,
      minZoom: MAP_SETTINGS.minZoom,
      maxZoom: MAP_SETTINGS.maxZoom,
      attributionControl: false,
      interactive: true,
    });

    const nowMap = new maplibregl.Map({
      container: nowMapContainer.current,
      style: createOverlayStyle(),
      center: MAP_SETTINGS.center,
      zoom: MAP_SETTINGS.zoom,
      minZoom: MAP_SETTINGS.minZoom,
      maxZoom: MAP_SETTINGS.maxZoom,
      attributionControl: false,
      interactive: true,
    });

    setupInteractions(baseMap);
    setupInteractions(thenMap);
    setupInteractions(nowMap);

    thenMap.getCanvas().style.background = "transparent";
    nowMap.getCanvas().style.background = "transparent";

    baseMapRef.current = baseMap;
    thenMapRef.current = thenMap;
    nowMapRef.current = nowMap;

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: "cost-popup",
      offset: 14,
    });

    workhousePopupRef.current = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: true,
      className: "cost-popup",
      offset: 16,
    });

    const maps = [baseMap, thenMap, nowMap];

    const syncAllMapsFrom = (sourceMap) => {
      sourceMap.on("move", () => {
        if (syncingRef.current) return;

        syncingRef.current = true;

        const camera = {
          center: sourceMap.getCenter(),
          zoom: sourceMap.getZoom(),
          bearing: sourceMap.getBearing(),
          pitch: sourceMap.getPitch(),
        };

        maps.forEach((map) => {
          if (map !== sourceMap) map.jumpTo(camera);
        });

        syncingRef.current = false;
      });
    };

    syncAllMapsFrom(baseMap);
    syncAllMapsFrom(thenMap);
    syncAllMapsFrom(nowMap);

    thenMap.on("load", () => {
      const booth = THEN_LAYER_CONFIG.booth_poverty_map;

      thenMap.addSource("booth-mosaic", {
        type: "raster",
        tiles: booth.tiles,
        tileSize: 256,
      });

      thenMap.addLayer({
        id: "booth-mosaic-layer",
        type: "raster",
        source: "booth-mosaic",
        paint: {
          "raster-opacity": boothOpacity,
          "raster-fade-duration": 0,
        },
      });

      thenMap.addSource("workhouses", {
        type: "geojson",
        data: "/orwell-atlas/data/maps/workhouses_london.geojson",
        promoteId: "id",
      });

      thenMap.addLayer({
        id: "workhouse-halo",
        type: "circle",
        source: "workhouses",
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            16,
            ["boolean", ["feature-state", "selected"], false],
            18,
            0,
          ],
          "circle-color": "#F4E7A1",
          "circle-opacity": [
            "case",
            [
              "any",
              ["boolean", ["feature-state", "hover"], false],
              ["boolean", ["feature-state", "selected"], false],
            ],
            0.36,
            0,
          ],
          "circle-blur": 0.85,
        },
      });

      thenMap.addLayer({
        id: "workhouse-points",
        type: "circle",
        source: "workhouses",
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            9.5,
            ["boolean", ["feature-state", "selected"], false],
            10.5,
            7,
          ],
          "circle-color": [
            "match",
            ["get", "certainty"],
            "exact",
            "#F4E7A1",
            "approximate",
            "#E6D27B",
            "interpretive",
            "#CBB89A",
            "#F4E7A1",
          ],
          "circle-opacity": [
            "match",
            ["get", "certainty"],
            "exact",
            0.98,
            "approximate",
            0.82,
            "interpretive",
            0.64,
            0.9,
          ],
          "circle-stroke-color": "#171717",
          "circle-stroke-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            2.3,
            ["boolean", ["feature-state", "selected"], false],
            2.6,
            1.7,
          ],
        },
      });

      thenMap.on("mouseenter", "workhouse-points", () => {
        thenMap.getCanvas().style.cursor = "pointer";
      });

      thenMap.on("mousemove", "workhouse-points", (e) => {
        if (!e.features || !e.features.length) return;

        const feature = e.features[0];
        const id = feature.id;

        if (
          hoveredWorkhouseIdRef.current !== null &&
          hoveredWorkhouseIdRef.current !== id
        ) {
          thenMap.setFeatureState(
            { source: "workhouses", id: hoveredWorkhouseIdRef.current },
            { hover: false }
          );
        }

        hoveredWorkhouseIdRef.current = id;

        if (id !== undefined && id !== null) {
          thenMap.setFeatureState({ source: "workhouses", id }, { hover: true });
        }
      });

      thenMap.on("mouseleave", "workhouse-points", () => {
        thenMap.getCanvas().style.cursor = "";

        if (hoveredWorkhouseIdRef.current !== null) {
          thenMap.setFeatureState(
            { source: "workhouses", id: hoveredWorkhouseIdRef.current },
            { hover: false }
          );
        }

        hoveredWorkhouseIdRef.current = null;
      });

      thenMap.on("click", "workhouse-points", (e) => {
        if (!e.features || !e.features.length) return;

        const feature = e.features[0];

        if (selectedWorkhouseIdRef.current !== null) {
          thenMap.setFeatureState(
            { source: "workhouses", id: selectedWorkhouseIdRef.current },
            { selected: false }
          );
        }

        if (feature.id !== undefined && feature.id !== null) {
          selectedWorkhouseIdRef.current = feature.id;
          thenMap.setFeatureState(
            { source: "workhouses", id: feature.id },
            { selected: true }
          );
        }

        workhousePopupRef.current
          .setLngLat(e.lngLat)
          .setHTML(buildWorkhousePopup(feature.properties, e.lngLat))
          .addTo(thenMap);
      });
    });

    nowMap.on("load", async () => {
      const response = await fetch("/orwell-atlas/data/maps/london_cost_map.geojson");
      const data = await response.json();

      setNowFeatures(data.features);

      Object.keys(NOW_LAYER_CONFIG).forEach((key) => {
        const property = NOW_LAYER_CONFIG[key].property;
        const values = getSortedValues(data.features, property);
        quantilesRef.current[key] = getQuantileBreaks(values, 6);
      });

      setLegendBreaks(quantilesRef.current.affordability || []);

      nowMap.addSource("london-cost", {
        type: "geojson",
        data,
        promoteId: "borough",
      });

      nowMap.addLayer({
        id: "cost-fill",
        type: "fill",
        source: "london-cost",
        paint: {
          "fill-color": getStepExpression(
            NOW_LAYER_CONFIG.affordability.property,
            quantilesRef.current.affordability,
            NOW_LAYER_CONFIG.affordability.palette
          ),
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.96,
            0.82,
          ],
        },
      });

      nowMap.addLayer({
        id: "cost-outline",
        type: "line",
        source: "london-cost",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#171717",
            "rgba(23,23,23,0.56)",
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            2.5,
            0.65,
          ],
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.95,
            0.32,
          ],
        },
      });

      nowMap.on("mousemove", "cost-fill", (e) => {
        if (!e.features || !e.features.length) return;

        const feature = e.features[0];
        const featureId = feature.id;
        setHoveredBorough(feature.properties.borough);

        if (hoveredIdRef.current !== null && hoveredIdRef.current !== featureId) {
          nowMap.setFeatureState(
            { source: "london-cost", id: hoveredIdRef.current },
            { hover: false }
          );
        }

        hoveredIdRef.current = featureId;

        nowMap.setFeatureState(
          { source: "london-cost", id: featureId },
          { hover: true }
        );

        const config = NOW_LAYER_CONFIG[activeNowLayerRef.current];
        const rawValue = feature.properties[config.property];
        const formattedValue =
          rawValue !== null && rawValue !== undefined
            ? config.format(rawValue)
            : "No data";

        popupRef.current
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: Cormorant Garamond, Georgia, serif; color: #171717; min-width: 170px;">
              <div style="font-size:17px;font-weight:500;margin-bottom:4px;line-height:1.05;">
                ${feature.properties.borough}
              </div>
              <div style="font-family:Inter, sans-serif;font-size:11px;line-height:1.45;color:rgba(23,23,23,0.62);">
                ${config.label}: <strong style="color:#171717;">${formattedValue}</strong>
              </div>
            </div>
          `)
          .addTo(nowMap);
      });

      nowMap.on("mouseleave", "cost-fill", () => {
        if (hoveredIdRef.current !== null) {
          nowMap.setFeatureState(
            { source: "london-cost", id: hoveredIdRef.current },
            { hover: false }
          );
        }

        hoveredIdRef.current = null;
        setHoveredBorough(null);
        popupRef.current?.remove();
      });
    });

    return () => {
      popupRef.current?.remove();
      workhousePopupRef.current?.remove();
      baseMap.remove();
      thenMap.remove();
      nowMap.remove();
      baseMapRef.current = null;
      thenMapRef.current = null;
      nowMapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const thenMap = thenMapRef.current;
    if (!thenMap) return;

    if (thenMap.getLayer("booth-mosaic-layer")) {
      thenMap.setLayoutProperty(
        "booth-mosaic-layer",
        "visibility",
        activeThenLayers.booth_poverty_map ? "visible" : "none"
      );

      thenMap.setPaintProperty(
        "booth-mosaic-layer",
        "raster-opacity",
        boothOpacity
      );
    }

    if (thenMap.getLayer("workhouse-halo")) {
      thenMap.setLayoutProperty(
        "workhouse-halo",
        "visibility",
        activeThenLayers.workhouse_points ? "visible" : "none"
      );
    }

    if (thenMap.getLayer("workhouse-points")) {
      thenMap.setLayoutProperty(
        "workhouse-points",
        "visibility",
        activeThenLayers.workhouse_points ? "visible" : "none"
      );
    }
  }, [activeThenLayers, boothOpacity]);

  useEffect(() => {
    const nowMap = nowMapRef.current;
    if (!nowMap || !nowMap.getLayer("cost-fill")) return;

    const config = NOW_LAYER_CONFIG[activeNowLayer];
    const breaks = quantilesRef.current[activeNowLayer];

    if (!breaks) return;

    nowMap.setPaintProperty(
      "cost-fill",
      "fill-color",
      getStepExpression(config.property, breaks, config.palette)
    );

    setLegendBreaks(breaks);
    popupRef.current?.remove();
  }, [activeNowLayer]);

  useEffect(() => {
    baseMapRef.current?.resize();
    thenMapRef.current?.resize();
    nowMapRef.current?.resize();
  }, [swipePosition]);

  const activeNowConfig = useMemo(
    () => NOW_LAYER_CONFIG[activeNowLayer],
    [activeNowLayer]
  );

  const activePalette = activeNowConfig.palette;
  const rankBarColors = getRankBarColors(activePalette);

  const rankedFive = useMemo(() => {
    if (!nowFeatures.length) return [];

    const breaks = quantilesRef.current[activeNowLayer] || [];
    return getRankedBoroughs(
      nowFeatures,
      activeNowConfig,
      breaks,
      activeNowConfig.palette,
      rankingMode
    );
  }, [nowFeatures, activeNowConfig, activeNowLayer, rankingMode]);

  const rankingMax = rankedFive.length
    ? Math.max(...rankedFive.map((d) => d.value))
    : 0;

  const rankingMin = rankedFive.length
    ? Math.min(...rankedFive.map((d) => d.value))
    : 0;

  const toggleThenLayer = (layerId) => {
    setActiveThenLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        ref={baseMapContainer}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "#f6f3ee",
        }}
      />

      {/* THEN */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "auto",
          clipPath: `inset(0 ${100 - swipePosition}% 0 0)`,
        }}
      >
        <div
          ref={thenMapContainer}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        />
      </div>

      {/* NOW */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "auto",
          clipPath: `inset(0 0 0 ${swipePosition}%)`,
        }}
      >
        <div
          ref={nowMapContainer}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        />
      </div>

      {/* Left panel */}
      <div
        style={{
          position: "absolute",
          top: "190px",
          bottom: "auto",
          left: "56px",
          zIndex: 34,
          width: "335px",
          maxHeight: "calc(100vh - 360px)",
          overflowY: "auto",
          boxSizing: "border-box",
          background: "rgba(246, 243, 238, 0.92)",
          border: "1px solid rgba(23,23,23,0.12)",
          borderRadius: "16px",
          padding: "17px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
          backdropFilter: "blur(7px)",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.66rem",
            fontWeight: 600,
            color: "rgba(23,23,23,0.48)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          Historical evidence
        </div>

        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "1.46rem",
            fontWeight: 400,
            color: "#171717",
            lineHeight: 1.05,
            marginBottom: "15px",
          }}
        >
          Poverty, welfare and control
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          {Object.values(THEN_LAYER_CONFIG).map((layer) => {
            const isActive = !!activeThenLayers[layer.id];

            return (
              <button
                key={layer.id}
                type="button"
                disabled={!layer.available}
                onClick={() => layer.available && toggleThenLayer(layer.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 48px",
                  alignItems: "center",
                  columnGap: "10px",
                  width: "100%",
                  minHeight: "31px",
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: layer.available ? "pointer" : "not-allowed",
                  opacity: layer.available ? 1 : 0.45,
                }}
              >
                <span
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "1.03rem",
                    lineHeight: 1.08,
                    color: "#171717",
                    fontWeight: 400,
                    textAlign: "left",
                  }}
                >
                  {layer.label}
                </span>

                <span
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    background: isActive ? "#171717" : "rgba(23,23,23,0.12)",
                    border: "1px solid rgba(23,23,23,0.10)",
                    justifySelf: "end",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: isActive ? "24px" : "3px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      background: isActive ? "#F4E7A1" : "#ffffff",
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
            marginTop: "10px",
            display: activeThenLayers.booth_poverty_map ? "block" : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.64rem",
              color: "rgba(23,23,23,0.48)",
              marginBottom: "5px",
            }}
          >
            <span>Booth map opacity</span>
            <span>{Math.round(boothOpacity * 100)}%</span>
          </div>

          <input
            type="range"
            min="0.2"
            max="0.85"
            step="0.05"
            value={boothOpacity}
            onChange={(e) => setBoothOpacity(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#171717",
              cursor: "pointer",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(23,23,23,0.12)",
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "1rem",
            lineHeight: 1.33,
            color: "rgba(23,23,23,0.74)",
            fontWeight: 400,
          }}
        >
          {THEN_LAYER_CONFIG.workhouse_points.description}
        </div>

        <div
          style={{
            marginTop: "10px",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.64rem",
            lineHeight: 1.42,
            color: "rgba(23,23,23,0.48)",
          }}
        >
          Click a yellow marker to inspect a workhouse location.
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          position: "absolute",
          top: "168px",
          bottom: "auto",
          right: "56px",
          zIndex: 34,
          width: "405px",
          maxHeight: "calc(100vh - 360px)",
          overflowY: "auto",
          boxSizing: "border-box",
          background: "rgba(246, 243, 238, 0.92)",
          border: "1px solid rgba(23,23,23,0.12)",
          borderRadius: "16px",
          padding: "17px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
          backdropFilter: "blur(7px)",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.66rem",
            fontWeight: 600,
            color: "rgba(23,23,23,0.48)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          Present-day pressure
        </div>

        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: "1.46rem",
            fontWeight: 400,
            color: "#171717",
            lineHeight: 1.05,
            marginBottom: "15px",
          }}
        >
          Borough-level cost of survival
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          {Object.entries(NOW_LAYER_CONFIG).map(([key, config]) => {
            const isActive = activeNowLayer === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveNowLayer(key)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 48px",
                  alignItems: "center",
                  columnGap: "10px",
                  width: "100%",
                  minHeight: "30px",
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "1.03rem",
                    lineHeight: 1.08,
                    color: "#171717",
                    fontWeight: 400,
                    textAlign: "left",
                  }}
                >
                  {config.label}
                </span>

                <span
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    background: isActive ? "#171717" : "rgba(23,23,23,0.12)",
                    border: "1px solid rgba(23,23,23,0.10)",
                    justifySelf: "end",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: isActive ? "24px" : "3px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      background: isActive ? activePalette[4] : "#ffffff",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.16)",
                      transition: "left 0.2s ease",
                    }}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {!!rankedFive.length && (
          <div style={{ marginTop: "14px" }}>
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "10px",
              }}
            >
              {[
                ["most", "Most pressured"],
                ["least", "Least pressured"],
              ].map(([mode, label]) => {
                const isActive = rankingMode === mode;

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setRankingMode(mode)}
                    style={{
                      flex: 1,
                      border: `1px solid ${
                        isActive ? "#171717" : "rgba(23,23,23,0.14)"
                      }`,
                      background: isActive
                        ? "rgba(23,23,23,0.90)"
                        : "rgba(255,255,255,0.32)",
                      color: isActive ? "#F5F0DB" : "#171717",
                      borderRadius: "999px",
                      padding: "7px 9px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.66rem",
                      fontWeight: 650,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: "1rem",
                fontWeight: 400,
                color: "#171717",
                marginBottom: "8px",
                lineHeight: 1.15,
              }}
            >
              {rankingMode === "most"
                ? activeNowConfig.rankingLabel
                : `Boroughs with the lowest ${activeNowConfig.label.toLowerCase()} values`}
            </div>

            <div
              style={{
                height: "156px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "9px",
                borderBottom: "1px solid rgba(23,23,23,0.14)",
                paddingBottom: "12px",
                marginBottom: "10px",
              }}
            >
              {rankedFive.map((item, index) => {
                const isHovered = hoveredBorough === item.borough;
                const range = rankingMax - rankingMin || 1;
                const heightPct = ((item.value - rankingMin) / range) * 78 + 18;

                return (
                  <div
                    key={item.borough}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.65rem",
                        color: "#171717",
                        textAlign: "center",
                        minHeight: "20px",
                        fontWeight: isHovered ? 760 : 550,
                      }}
                    >
                      {activeNowConfig.format(item.value)}
                    </div>

                    <div
                      style={{
                        height: "90px",
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "42px",
                          height: `${heightPct}%`,
                          background:
                            rankBarColors[index] ||
                            activePalette[activePalette.length - 1],
                          border: "1px solid rgba(23,23,23,0.30)",
                          borderRadius: "8px 8px 0 0",
                          outline: isHovered ? "2px solid #171717" : "none",
                          outlineOffset: "2px",
                          boxShadow: isHovered
                            ? "0 0 0 4px rgba(244,231,161,0.48)"
                            : "none",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontSize: "0.78rem",
                        color: "#171717",
                        lineHeight: 1,
                        textAlign: "center",
                        minHeight: "30px",
                        fontWeight: 400,
                      }}
                    >
                      {shortenBorough(item.borough)}
                    </div>
                  </div>
                );
              })}
            </div>

            {!!legendBreaks.length && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${activePalette.length}, 1fr)`,
                    gap: "0px",
                    marginBottom: "6px",
                    border: "1px solid rgba(23,23,23,0.08)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  {activePalette.map((color) => (
                    <div
                      key={color}
                      style={{
                        height: "10px",
                        background: color,
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.64rem",
                    color: "rgba(23,23,23,0.56)",
                    marginBottom: "9px",
                  }}
                >
                  <span>{activeNowConfig.format(legendBreaks[0])}</span>
                  <span>{activeNowConfig.format(legendBreaks[5])}</span>
                </div>
              </>
            )}

            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: "0.96rem",
                lineHeight: 1.32,
                color: "rgba(23,23,23,0.72)",
                marginBottom: "8px",
                fontWeight: 400,
              }}
            >
              {activeNowConfig.description}
            </div>

            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.64rem",
                lineHeight: 1.4,
                color: "rgba(23,23,23,0.48)",
              }}
            >
              Darker areas indicate higher values within the selected layer.
              Hover a borough to connect the map and ranking.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}