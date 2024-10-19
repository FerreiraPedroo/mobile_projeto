import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import { useEffect, useRef, useState } from "react";

interface GPSPosition {
  latitude: number;
  longitude: number;
}

interface Route {
  id: number;
  name: string;
  photo: string;
  boardingPoints: {
    id: number;
    name: string;
  }[];
  landingPoints: {
    id: number;
    name: string;
  }[];
  passagers: {
    id: number;
    name: string;
  }[];
}

const MyMap: React.FC<any> = ({ routeInfo }: any) => {
  const [GPSPosition, setGPSPosition] = useState<GPSPosition | null>(null);

  const mapRef = useRef<HTMLElement>();
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [mapMarks, setMapMarks] = useState<string[]>([]);
  const [userDriverMark, setDriverMark] = useState<string>();

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

  // CRIA O MAPA
  useEffect(() => {
    async function createMap() {
      if (!mapRef.current || !GPSPosition || map) return;
      const newMap = await GoogleMap.create({
        id: "driver-map",
        element: mapRef.current,
        apiKey: "AIzaSyA63Z8Kvc8xUGTLgl_mWcRQWTEfJZoUQXE",
        config: {
          zoom: 16,
          zoomControl: false,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: "none",
          disableDoubleClickZoom: true,
          center: {
            lat: GPSPosition.latitude,
            lng: GPSPosition.longitude,
          },
          styles: [
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }], // Oculta marcadores de POIs (pontos de interesse)
            },
            {
              featureType: "transit",
              stylers: [{ visibility: "off" }], // Oculta estações de transporte público
            },
          ],
        },
      });

      const driveMark = await newMap.addMarker({
        coordinate: {
          lat: GPSPosition.latitude,
          lng: GPSPosition.longitude,
        },
        iconSize: new google.maps.Size(16, 16), // Tamanho total do ícone
        iconOrigin: new google.maps.Point(0, 0), // Ponto de origem da imagem
        iconAnchor: new google.maps.Point(8, 16), // Define a âncora na base do ícone
      });

      setMap(newMap);
      setDriverMark(driveMark);
    }

    createMap();
  }, [GPSPosition]);

  // ATUALIZAR POSIÇÃO DO MOTORISTA
  async function moveMap() {
    if (map) {
      const move = await map.setCamera({
        coordinate: {
          lat: GPSPosition!.latitude,
          lng: GPSPosition!.longitude,
        },
        animate: true,
      });
    }
  }

  // ATUALIZAR A POSIÇÃO 
  function getCurrentPosition() {}

  // ADICIONAR MARCADORES
  async function addMark(mark: any) {
    if (map) {
      if (mapMarks.length) {
        await map.removeMarkers(mapMarks);
      }
      const newMarks = await map.addMarkers(mark);
      // console.log({ routeInfo, mapMarks, newMarks });
      setMapMarks([...newMarks]);
    }
  }
  useEffect(() => {
    if (map) {
      const boardingMarkers = routeInfo.boardingPoints.map((landing: any) => {
        return {
          coordinate: {
            lat: parseFloat(landing.map.split("#")[0]),
            lng: parseFloat(landing.map.split("#")[1]),
          },
          iconUrl: landing.photo ?? "https://img.icons8.com/stickers/50/map-pin.png",
          iconSize: new google.maps.Size(32, 32), // Tamanho total do ícone
          iconOrigin: new google.maps.Point(0, 0), // Ponto de origem da imagem
          iconAnchor: new google.maps.Point(16, 32), // Define a âncora na base do ícone
        };
      });
      const landingMarkers = routeInfo.landingPoints.map((landing: any) => {
        return {
          coordinate: {
            lat: parseFloat(landing.map.split("#")[0]),
            lng: parseFloat(landing.map.split("#")[1]),
          },
          iconUrl: landing.photo ?? "https://img.icons8.com/stickers/50/map-pin.png",
          iconSize: new google.maps.Size(32, 32), // Tamanho total do ícone
          iconOrigin: new google.maps.Point(0, 0), // Ponto de origem da imagem
          iconAnchor: new google.maps.Point(16, 32), // Define a âncora na base do ícone
        };
      });
      addMark([...boardingMarkers, ...landingMarkers]);
    }
  }, [map, routeInfo]);

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
    </div>
  );
};

export { MyMap };
