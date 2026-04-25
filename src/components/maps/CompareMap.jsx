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
          "raster-opacity": 0.9,
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
          "background-opacity": 0,
          "background-color": "rgba(0,0,0,0)",
        },
      },
    ],
  };
}

function shortenBorough(name) {
  const shortMap = {
    "Kensington and Chelsea": "Kensington & Chelsea",
    "Richmond-upon-Thames": "Richmond-upon-Thames",
    "Barking and Dagenham": "Barking & Dagenham",
    "City of London": "City of London",
    "Tower Hamlets": "Tower Hamlets",
    Westminster: "Westminster",
    Islington: "Islington",
    Camden: "Camden",
    Hackney: "Hackney",
    Brent: "Brent",
    Newham: "Newham",
    Enfield: "Enfield",
    Haringey: "Haringey",
    Wandsworth: "Wandsworth",
  };

  return shortMap[name] || name;
}

export default function CompareMap({ swipePosition }) {
  const baseMapContainer = useRef(null);
  const thenMapContainer = useRef(null);
  const nowMapContainer = useRef(null);

  const baseMapRef = useRef(null);
  const thenMapRef = useRef(null);
  const nowMapRef = useRef(null);

  const popupRef = useRef(null);
  const hoveredIdRef = useRef(null);
  const quantilesRef = useRef({});
  const activeNowLayerRef = useRef("affordability");
  const syncingRef = useRef(false);

  const [activeThenLayer, setActiveThenLayer] = useState("booth_poverty_map");
  const [activeNowLayer, setActiveNowLayer] = useState("affordability");
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
          if (map !== sourceMap) {
            map.jumpTo(camera);
          }
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
          "raster-opacity": 0.6,
          "raster-fade-duration": 0,
        },
      });

      thenMap.addSource("workhouses", {
        type: "geojson",
        data: "/orwell-atlas/data/maps/workhouses_london.geojson",
      });

      thenMap.addLayer({
        id: "workhouse-points",
        type: "circle",
        source: "workhouses",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            9,
            4,
            14,
            8,
          ],
          "circle-color": "#171717",
          "circle-opacity": [
            "match",
            ["get", "certainty"],
            "exact",
            0.9,
            "approximate",
            0.6,
            "interpretive",
            0.35,
            0.7,
          ],
          "circle-stroke-width": 1.2,
          "circle-stroke-color": "#F4E7A1",
        },
      });

      thenMap.on("mouseenter", "workhouse-points", () => {
        thenMap.getCanvas().style.cursor = "pointer";
      });

      thenMap.on("mouseleave", "workhouse-points", () => {
        thenMap.getCanvas().style.cursor = "";
      });

      thenMap.on("click", "workhouse-points", (e) => {
        if (!e.features || !e.features.length) return;

        const props = e.features[0].properties;

        new maplibregl.Popup({
          closeButton: false,
          closeOnClick: true,
          className: "cost-popup",
        })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: Inter, sans-serif; font-size: 12px; color: #171717;">
              <strong>${props.name}</strong><br/>
              Type: ${props.type}<br/>
              Certainty: ${props.certainty}<br/>
              <em>${props.note}</em>
            </div>
          `)
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
            0.95,
            0.82,
          ],
        },
      });

      nowMap.addLayer({
        id: "cost-outline",
        type: "line",
        source: "london-cost",
        paint: {
          "line-color": "#171717",
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1.35,
            0.65,
          ],
          "line-opacity": 0.28,
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
            <div style="font-family: Inter, sans-serif; font-size: 12px; color: #171717;">
              <strong>${feature.properties.borough}</strong><br/>
              ${config.label}: ${formattedValue}
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
      baseMap.remove();
      thenMap.remove();
      nowMap.remove();
      baseMapRef.current = null;
      thenMapRef.current = null;
      nowMapRef.current = null;
    };
  }, []);

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
    const thenMap = thenMapRef.current;
    if (!thenMap) return;

    const visibility =
      activeThenLayer === "booth_poverty_map" ? "visible" : "none";

    if (thenMap.getLayer("booth-mosaic-layer")) {
      thenMap.setLayoutProperty("booth-mosaic-layer", "visibility", visibility);
    }

    if (thenMap.getLayer("workhouse-points")) {
      thenMap.setLayoutProperty("workhouse-points", "visibility", visibility);
    }
  }, [activeThenLayer]);

  useEffect(() => {
    baseMapRef.current?.resize();
    thenMapRef.current?.resize();
    nowMapRef.current?.resize();
  }, [swipePosition]);

  const activeThenConfig = THEN_LAYER_CONFIG[activeThenLayer];
  const activeNowConfig = useMemo(
    () => NOW_LAYER_CONFIG[activeNowLayer],
    [activeNowLayer]
  );

  const activePalette = activeNowConfig.palette;
  const rankBarColors = getRankBarColors(activePalette);

  const topFive = useMemo(() => {
    if (!nowFeatures.length) return [];

    const property = activeNowConfig.property;
    const breaks = quantilesRef.current[activeNowLayer] || [];
    const palette = activeNowConfig.palette;

    return [...nowFeatures]
      .map((feature) => {
        const value = Number(feature.properties[property]);
        return {
          borough: feature.properties.borough,
          value,
          mapColor: getPaletteColor(value, breaks, palette),
        };
      })
      .filter((d) => !Number.isNaN(d.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [nowFeatures, activeNowConfig, activeNowLayer]);

  const rankingMax = topFive.length ? topFive[0].value : 0;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        ref={baseMapContainer}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
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
          }}
        />

        {/* Fade left edge of Booth mosaic */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 5,
            background: `
              linear-gradient(
                90deg,
                rgba(246,243,238,0.95) 0%,
                rgba(246,243,238,0.7) 28%,
                rgba(246,243,238,0) 48%
              )
            `,
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
          }}
        />
      </div>

      {/* Left panel */}
      <div
        style={{
          position: "absolute",
          bottom: "72px",
          left: "56px",
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
            lineHeight: 1.2,
          }}
        >
          Historical Layers
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          {Object.values(THEN_LAYER_CONFIG).map((layer) => {
            const isActive = activeThenLayer === layer.id;

            return (
              <button
                key={layer.id}
                type="button"
                disabled={!layer.available}
                onClick={() => layer.available && setActiveThenLayer(layer.id)}
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
                  cursor: layer.available ? "pointer" : "not-allowed",
                  fontFamily: "Inter, sans-serif",
                  opacity: layer.available ? 1 : 0.45,
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
                  {layer.label}
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
          {activeThenConfig.description}
        </div>

        <div
          style={{
            marginTop: "8px",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.72rem",
            lineHeight: 1.45,
            color: "rgba(23,23,23,0.58)",
          }}
        >
          {activeThenConfig.sourceNote}
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          position: "absolute",
          bottom: "72px",
          right: "56px",
          zIndex: 30,
          width: "360px",
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
            lineHeight: 1.2,
          }}
        >
          London Living Costs
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

        {!!topFive.length && (
          <div style={{ marginTop: "14px" }}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#171717",
                marginBottom: "8px",
              }}
            >
              Top 5 Boroughs in London
            </div>

            <div
              style={{
                marginTop: "8px",
                marginBottom: "10px",
                borderBottom: "1px solid rgba(23,23,23,0.14)",
                paddingBottom: "10px",
              }}
            >
              <div
                style={{
                  height: "180px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                {topFive.map((item, index) => {
                  const isHovered = hoveredBorough === item.borough;
                  const heightPct = rankingMax
                    ? (item.value / rankingMax) * 100
                    : 0;

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
                          fontSize: "0.72rem",
                          color: "#171717",
                          lineHeight: 1.1,
                          textAlign: "center",
                          minHeight: "22px",
                          fontWeight: isHovered ? 700 : 500,
                        }}
                      >
                        {activeNowConfig.format(item.value)}
                      </div>

                      <div
                        style={{
                          height: "110px",
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
                            height: `${Math.max(heightPct, 12)}%`,
                            background: rankBarColors[index] || activePalette[5],
                            border: `1px solid ${item.mapColor}`,
                            borderRadius: "8px 8px 0 0",
                            outline: isHovered ? "2px solid #171717" : "none",
                            outlineOffset: "1px",
                            transition: "all 0.15s ease",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.62rem",
                          color: "#171717",
                          lineHeight: 1.1,
                          textAlign: "center",
                          minHeight: "34px",
                          fontWeight: isHovered ? 700 : 500,
                          wordBreak: "break-word",
                        }}
                      >
                        {shortenBorough(item.borough)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.68rem",
                color: "rgba(23,23,23,0.58)",
                marginBottom: "10px",
              }}
            >
              {activeNowConfig.rankingLabel}
            </div>

            {!!legendBreaks.length && (
              <>
                <div
                  style={{
                    marginTop: "4px",
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: "4px",
                    marginBottom: "6px",
                  }}
                >
                  {activePalette.map((color) => (
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
                    marginBottom: "8px",
                  }}
                >
                  <span>{activeNowConfig.format(legendBreaks[0])}</span>
                  <span>{activeNowConfig.format(legendBreaks[5])}</span>
                </div>
              </>
            )}

            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.74rem",
                lineHeight: 1.5,
                color: "rgba(23,23,23,0.72)",
                marginBottom: "8px",
              }}
            >
              {activeNowConfig.description}
            </div>

            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.72rem",
                lineHeight: 1.45,
                color: "rgba(23,23,23,0.58)",
              }}
            >
              Darker areas indicate higher values within the selected layer.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}