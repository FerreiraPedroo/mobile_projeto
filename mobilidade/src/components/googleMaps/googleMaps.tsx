import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import { useEffect, useRef, useState } from "react";
import { options } from "ionicons/icons";

interface GPSPosition {
  latitude: number;
  longitude: number;
}

interface MapMarks {
  id: number;
  name: string;
  img: string | null;
  lat: number;
  lng: number;
}

const MyMap: React.FC = () => {
  const [GPSPosition, setGPSPosition] = useState<GPSPosition | null>(null);

  const mapRef = useRef<HTMLElement>();
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [mapMarks, setMapMarks] = useState<MapMarks[] | []>([]);

  // ATUALIZAR A POSIÇÃO
  function getCurrentPosition() {}

  // ADICIONAR MARCADOR
  async function addMark() {
    if (map) {
      const markerId = await map.addMarker({
        coordinate: {
          lat: GPSPosition!.latitude - 0.0000001,
          lng: GPSPosition!.longitude - 0.000002,
        },
        title: "Pedro",
      });

      console.log({ markerId });
    }
  }

  // CRIA O MAPA
  // useEffect(() => {
  //   async function createMap() {
  //     if (!mapRef.current || !GPSPosition) return;

  //     if (!map) {
  //       console.log({
  //         lat: GPSPosition!.latitude,
  //         lng: GPSPosition!.longitude,
  //       });

  //       setMap(
  //         await GoogleMap.create({
  //           id: "my-cool-map",
  //           element: mapRef.current,
  //           apiKey: "AIzaSyA63Z8Kvc8xUGTLgl_mWcRQWTEfJZoUQXE",
  //           config: {
  //             disableDefaultUI: true,
  //             center: {
  //               lat: GPSPosition!.latitude,
  //               lng: GPSPosition!.longitude,
  //             },
  //             zoom: 15,
  //           },
  //         })
  //       );
  //     }
  //   }

  //   createMap();
  // }, [GPSPosition]);

  // CRIA O GPS
  useEffect(() => {
    async function createGPS() {
      const coordinates = await Geolocation.getCurrentPosition();
      setGPSPosition({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      });
      console.log("Current position:", coordinates);
    }
    createGPS();
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
