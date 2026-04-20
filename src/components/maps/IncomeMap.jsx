import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function IncomeMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

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
                "background-color": "#f6f3ee" // cream
            }
            }
        ]
        },
      center: [-0.1, 51.5],
      zoom: 8.8,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
        map.addSource("income", {
        type: "geojson",
        data: "/orwell-atlas/data/maps/income_borough_2022_23.geojson",
        promoteId: "borough", // ✅ แก้ตรงนี้
        });

    map.addLayer({
    id: "income-fill",
    type: "fill",
    source: "income",
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "income"],
        30000, "#f5f0e6",
        50000, "#d8d2c8",
        70000, "#a8a39a",
        90000, "#5f5b55",
        120000, "#1a1a1a"
      ],
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.75
        ],
    },
  });       

    map.addLayer({
        id: "income-outline",
        type: "line",
        source: "income",
        paint: {
        "line-color": "#171717",
        "line-width": 0.6,
        "line-opacity": 0.4,
        },
    });

    let hoveredId = null;

        map.on("mousemove", "income-fill", (e) => {
            if (e.features.length > 0) {
            if (hoveredId !== null) {
                map.setFeatureState(
                { source: "income", id: hoveredId },
                { hover: false }
                );
            }

            hoveredId = e.features[0].id;

            map.setFeatureState(
                { source: "income", id: hoveredId },
                { hover: true }
            );
            }
        });

        map.on("mouseleave", "income-fill", () => {
            if (hoveredId !== null) {
            map.setFeatureState(
                { source: "income", id: hoveredId },
                { hover: false }
            );
            }
            hoveredId = null;
        });

        const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: "income-popup",
            });

        map.on("mousemove", "income-fill", (e) => {
            const f = e.features[0];

            popup
                .setLngLat(e.lngLat)
                .setHTML(`
                <div style="
                    font-family: Inter, sans-serif;
                    font-size: 12px;
                    color: #171717;
                ">
                    <strong>${f.properties.borough}</strong><br/>
                    £${Number(f.properties.income).toLocaleString()}
                </div>
                `)
                .addTo(map);
            });

            map.on("mouseleave", "income-fill", () => {
            popup.remove();
            });

    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "620px",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    />
  );
}