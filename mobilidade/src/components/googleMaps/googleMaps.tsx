import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import { useEffect, useRef, useState } from "react";
import { options } from "ionicons/icons";

const MyMap: React.FC = () => {
  const [GPSPosition, setGPSPosition] = useState({ latitude: 0, longitude: 0 });
  const [newMap, setNewMap] = useState<GoogleMap | null>(null);

  const [printCurrentPosition] = useState(() => { 
    return async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    setGPSPosition({
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
    });
    console.log("Current position:", coordinates);
  }});

  console.log({ printCurrentPosition, newMap });

  const mapRef = useRef<HTMLElement>();

  useEffect(() => {
    async function createMap() {
      if (!mapRef.current) return;
      if (!newMap) {
        setNewMap(
          await GoogleMap.create({
            id: "my-cool-map",
            element: mapRef.current,
            apiKey: "AIzaSyCb4soVwdesG4ZGzV5Oh57Ah7nSdyHaCCs",
            config: {
              center: {
                lat: GPSPosition.latitude,
                lng: GPSPosition.longitude,
              },
              zoom: 8,
            },
          })
        );
      }
    }

    createMap();
  }, [GPSPosition]);

  useEffect(() => {
    (async () => {
      await printCurrentPosition();

    })();
  }, []);

  return (
    <div className="component-wrapper">
      <capacitor-google-map
        ref={mapRef}
        style={{
          display: "flex",
          width: "100%",
          height: 400,
        }}
      ></capacitor-google-map>

      {/* <button onClick={createMap}>Create Map</button> */}
    </div>
  );
};

export { MyMap };
