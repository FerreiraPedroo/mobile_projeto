import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import { useEffect, useRef, useState } from "react";
import { options } from "ionicons/icons";

interface GPSPosition {
  latitude: number;
  longitude: number;
}

const MapAddPoint: React.FC<any> = (props: any) => {
  const [GPSPosition, setGPSPosition] = useState<GPSPosition | null>(null);

  const mapRef = useRef<HTMLElement>();
  const [map, setMap] = useState<GoogleMap | null>(null);

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
          center: {
            lat: GPSPosition!.latitude,
            lng: GPSPosition!.longitude,
          },
          // gestureHandling: "none",
          // zoomControl: false,
          zoom: 16,
          // disableDefaultUI: true,
          mapTypeControl: false, // desativa o tipo de mapa
          streetViewControl: false, // desativa a visualização do street
          fullscreenControl: false, // desativa o modo tela cheia
          clickableIcons: false,
          // disableDoubleClickZoom: true,
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
      setMap(newMap);
    }

    createMap();
  }, [GPSPosition]);

  // // ADICIONAR MARCADOR
  const addMark = async (event: any) => {
    if (map) {
      const newMark = await map.addMarker({
        coordinate: {
          lat: event.latitude,
          lng: event.longitude,
        },
        iconSize: new google.maps.Size(32, 32), // Tamanho total do ícone
        iconOrigin: new google.maps.Point(0, 0), // Ponto de origem da imagem
        iconAnchor: new google.maps.Point(16, 32), // Define a âncora na base do ícone
      });

      map.removeMarker(String(Number(newMark) - 1));

      props.setPointCoordinate(`${event.latitude}#${event.longitude}`);
    }
  };

  // ADICIONA OS MARCADORES
  useEffect(() => {
    if (map) {
      map.setOnMapClickListener((event) => {
        addMark(event);
      });
    }
  }, [map]);

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

export { MapAddPoint };
