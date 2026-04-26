import SectionShell from "../layout/SectionShell";
import * as React from "react";
import { Map, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { placesData } from "../../data/orwell_places";
import { Popup } from "react-map-gl/maplibre";
import { THEME } from "../../theme";

export default function MapSection({ activeId }) {

  // State
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [hasPlayed, setHasPlayed] = React.useState(false);
  const [selectedPlace, setSelectedPlace] = React.useState(null);

  const mapRef = React.useRef(null);

  // transfer to GeoJSON
  const geojsonData = {
    type: "FeatureCollection",
    features: placesData.map((p, index) => ({
      type: "Feature",
      properties: {
        id: index,
        place: p.place,
        day: p.day,
        lat: p.lat,
        lon: p.lon,
        type: p.type,
        context: p.context,
        spend: p.spend,
        image: p.image,
      },
      geometry: {
        type: "Point",
        coordinates: [p.lon, p.lat],
      },
    })),
  };

  // sort
  const sortedFeatures = [...geojsonData.features].sort(
    (a, b) => a.properties.day - b.properties.day
  );

  const firstFeature = sortedFeatures[0];
  const firstCoord = firstFeature.geometry.coordinates;

  const currentFeature = sortedFeatures[step];

  // animation
  React.useEffect(() => {
    if (activeId === "mapping-footstep" && !hasPlayed) {
      setPlaying(true);
      setHasPlayed(true);
    }
  }, [activeId, hasPlayed]);

  // first position
  React.useEffect(() => {
    if (!mapRef.current || !firstCoord) return;

    mapRef.current.flyTo({
      center: firstCoord,
      zoom: 12,
      duration: 2000,
    });
  }, []);

  // playing logic
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
    }, 2000);

    return () => clearInterval(interval);
  }, [playing]);

  // Replay
  const handleReplay = () => {
    setStep(0);
    setPlaying(true);
  };

  // camera following
  React.useEffect(() => {
    if (!mapRef.current || !currentFeature) return;

    mapRef.current.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 12,
      duration: 1000,
    });
  }, [step]);

  // point appear
  const visiblePoints = {
    type: "FeatureCollection",
    features: sortedFeatures.slice(0, step + 1),
  };

  // line appear
  const lineData = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: sortedFeatures
        .slice(0, step + 1)
        .map((f) => f.geometry.coordinates),
    },
  };

  // Point Style
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
      "circle-color": "#4a6a7f",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  };

  // Path way
  const lineLayer = {
    id: "line",
    type: "line",
    paint: {
      "line-color": "#9c4442",
      "line-width": 3,
      "line-dasharray": [1, 1],
    },
  };

  // Label
  const labelLayer = {
    id: "labels",
    type: "symbol",
    layout: {
      "text-field": ["get", "place"], 
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": 16,
      "text-offset": [0, 1.2], 
      "text-anchor": "top",
      "text-allow-overlap": false,
    },
    paint: {
      "text-color": "#4a6a7f",
      "text-halo-color": "#fff",
      "text-halo-width": 2,
    },
  };

  return (
    <SectionShell
      id="mapping-footstep"
      title="Orwell's Footsteps Map"
      intro=" 👣 Orwell's tramp journey unfolds step by step across London."
      isActive={activeId === "mapping-footstep"}
    >

      {/* Control button */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            padding: "6px 12px",
            background: "#4a6a7f",
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
            background: "#9c4442",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Replay
        </button>
      </div>

      {/* map */}
      <div style={{ height: "600px", width: "1000px" }}>
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: firstCoord[0],
              latitude: firstCoord[1],
              zoom: 12,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://api.maptiler.com/maps/019d8d6b-c650-77ba-be12-72f95e0969a1/style.json?key=MBBehWfjjQaTQhTfmEeq"

            onClick={(e) => {
              const map = mapRef.current.getMap();

              const features = map.queryRenderedFeatures(e.point, {
                layers: ["points"], 
              });

              if (features.length > 0) {
                setSelectedPlace(features[0]);
              } else {
                setSelectedPlace(null);
              }
            }}
          >

            {selectedPlace && (
              <Popup
                longitude={selectedPlace.geometry.coordinates[0]}
                latitude={selectedPlace.geometry.coordinates[1]}
                onClose={() => setSelectedPlace(null)}
                closeOnClick={false}
                className="!p-0"
              >
                <article className="border-2 border-black bg-white shadow-[4px_4px_0_0,8px_8px_0_0] w-[220px]">

                  {/* Header */}
                  <div style={{ 
                          borderBottom: "2px solid #4a6a7f", 
                          paddingBottom: "4px", 
                          marginBottom: "6px" 
                        }}>
                    <strong style={{ 
                              fontSize: "10px", 
                              fontWeight: "600", 
                              color: "#4a6a7f" 
                            }}>
                      Orwell Footstep
                    </strong>
                  </div>

                      <div className="flex gap-1">
                        <div className="w-3 h-3 border-2 border-black bg-white"></div>
                        <div className="w-3 h-3 border-2 border-black bg-white"></div>
                      </div>

                  {selectedPlace?.properties?.image && (
                    <img
                      src={`${import.meta.env.BASE_URL}${selectedPlace.properties.image}`}
                      alt={selectedPlace.properties.place}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                      }}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        marginBottom: "8px",
                        borderRadius: "4px",
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="border-t-2 border-black p-3">
                   
                   {selectedPlace.properties.context && (
                      <p
                        style={{ 
                          marginTop: "6px", 
                          fontSize: "12px", 
                          fontFamily: THEME.fonts.serif,
                          fontStyle: "italic",
                          color: THEME.colors.muted,
                          lineHeight: 1.5,
                        }}
                      >
                        "{selectedPlace.properties.context}"
                      </p>
                    )}

                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "#4a6a7f" }}
                    >
                      {selectedPlace.properties.place}
                    </h3>

                    <p className="mt-1 text-xs text-gray-700">
                      Latitude: {selectedPlace.properties.lat} · Longitude: {selectedPlace.properties.lon}
                    </p>

                    <p className="mt-1 text-xs text-gray-700">
                      Day {selectedPlace.properties.day} · {selectedPlace.properties.type}
                    </p>

                    {selectedPlace.properties.spend && (
                      <p className="mt-1 text-xs text-gray-700">
                        Spend: {selectedPlace.properties.spend}
                      </p>
                    )}

                  </div>

                </article>
              </Popup>
            )}
          
            {/* line */}
            <Source id="line" type="geojson" data={lineData} lineMetrics={true}>
              <Layer {...lineLayer} />
            </Source>

            {/* point */}
            <Source id="points" type="geojson" data={visiblePoints}>
              <Layer {...pointLayer} />
              <Layer {...labelLayer} />
            </Source>

          </Map>
      </div>
      
      <p
        style={{
          margin: "10px 0 0 0",
          color: THEME.colors.muted,
          fontFamily: THEME.fonts.serif,
          fontSize: "1rem",
          lineHeight: 1.6,
          textAlign: "center",
          fontStyle: "normal",
        }}
      >
        Click on each place to explore more details about Orwell's journey.
      </p>

    </SectionShell>
  );
}