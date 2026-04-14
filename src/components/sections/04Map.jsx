import SectionShell from "../layout/SectionShell";
import * as React from "react";
import { Map, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { placesData } from "../../data/orwell_places";

export default function MapSection({ activeId }) {

  // 🎯 状态
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [hasPlayed, setHasPlayed] = React.useState(false);

  const mapRef = React.useRef(null);

  // 👉 GeoJSON
  const geojsonData = {
    type: "FeatureCollection",
    features: placesData.map((p, index) => ({
      type: "Feature",
      properties: {
        id: index,
        place: p.place,
        day: p.day,
        type: p.type,
        context: p.context,
      },
      geometry: {
        type: "Point",
        coordinates: [p.lon, p.lat],
      },
    })),
  };

  // 🧠 必须先排序（修复关键 bug）
  const sortedFeatures = [...geojsonData.features].sort(
    (a, b) => a.properties.day - b.properties.day
  );

  const firstFeature = sortedFeatures[0];
  const firstCoord = firstFeature.geometry.coordinates;

  const currentFeature = sortedFeatures[step];

  // 🎯 进入 section 自动播放（只一次）
  React.useEffect(() => {
    if (activeId === "mapping-inequality" && !hasPlayed) {
      setPlaying(true);
      setHasPlayed(true);
    }
  }, [activeId, hasPlayed]);

  // 🎬 初始定位（只执行一次）
  React.useEffect(() => {
    if (!mapRef.current || !firstCoord) return;

    mapRef.current.flyTo({
      center: firstCoord,
      zoom: 12,
      duration: 2000,
    });
  }, []);

  // 🎬 播放逻辑（逐点出现）
  React.useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < sortedFeatures.length - 1) {
          return prev + 1;
        } else {
          setPlaying(false);
          return prev;
        }
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [playing]);

  // 🔁 Replay
  const handleReplay = () => {
    setStep(0);
    setPlaying(true);
  };

  // 🧭 跟随 camera
  React.useEffect(() => {
    if (!mapRef.current || !currentFeature) return;

    mapRef.current.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 12,
      duration: 1000,
    });
  }, [step]);

  // 🟡 点（逐步出现）
  const visiblePoints = {
    type: "FeatureCollection",
    features: sortedFeatures.slice(0, step + 1),
  };

  // 🔵 线（逐步增长）
  const lineData = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: sortedFeatures
        .slice(0, step + 1)
        .map((f) => f.geometry.coordinates),
    },
  };

  // 🎨 点样式（当前点高亮）
  const pointLayer = {
    id: "points",
    type: "circle",
    paint: {
      "circle-radius": [
        "case",
        ["==", ["get", "id"], currentFeature?.properties.id],
        10,
        6,
      ],
      "circle-color": "#9b4442",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  };

  // 🎬 虚线路径
  const lineLayer = {
    id: "line",
    type: "line",
    paint: {
      "line-color": "#9b4442",
      "line-width": 3,
      "line-dasharray": [1, 1],
    },
  };

  // Label
  const labelLayer = {
    id: "labels",
    type: "symbol",
    layout: {
      "text-field": ["get", "place"], // ⭐ 关键：取 place 字段
      "text-font": ["Open Sans Regular"],
      "text-size": 12,
      "text-offset": [0, 1.2], // 往上移一点
      "text-anchor": "top",
      "text-allow-overlap": false,
    },
    paint: {
      "text-color": "#111",
      "text-halo-color": "#fff",
      "text-halo-width": 2,
    },
  };

  return (
    <SectionShell
      id="mapping-inequality"
      title="Orwell's Footsteps"
      intro="Orwell's tramp journey unfolds step by step across London."
      isActive={activeId === "mapping-inequality"}
    >

      {/* 🎮 控制 */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            padding: "6px 12px",
            background: "#9b4442",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          onClick={handleReplay}
          style={{
            padding: "6px 12px",
            background: "#333",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Replay
        </button>
      </div>

      {/* 🗺️ 地图 */}
      <div style={{ height: "700px", width: "1000px" }}>
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: firstCoord[0],
            latitude: firstCoord[1],
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://api.maptiler.com/maps/019d88b3-dd9c-72dd-ba40-1d66bb3af942/style.json?key=MBBehWfjjQaTQhTfmEeq"
        >

          {/* 🔵 线 */}
          <Source id="line" type="geojson" data={lineData} lineMetrics={true}>
            <Layer {...lineLayer} />
          </Source>

          {/* 🟡 点 */}
          <Source id="points" type="geojson" data={visiblePoints}>
            <Layer {...pointLayer} />
            <Layer {...labelLayer} />
          </Source>

        </Map>
      </div>

    </SectionShell>
  );
}