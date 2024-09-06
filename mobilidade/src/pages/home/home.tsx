import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";

import { useStorage } from "../../hooks/useStorage";
import { GoogleMap } from "@capacitor/google-maps";

import "./home.css";

const apiKey = "YOUR_API_KEY_HERE";
const dateActual = new Date();

interface Route {
  id: number;
  name: string;
  photo: string;
  boarding_point: number;
  landing_point: number;
  passagers: number;
  starthour: string;
}

import routeImg from "../../assets/img/route-map.png";

const Home: React.FC = () => {
  const { loginToken } = useStorage();
  const [routeList, setRouteList] = useState<Route[]>([
    {
      id: 0,
      name: "Pedro Henrique de Assis",
      photo: "./src/assets/img/ default.png",
      boarding_point: 0,
      landing_point: 0,
      passagers: 0,
      starthour: "07:00",
    },
    {
      id: 1,
      name: "Pedro Henrique de Assis Ferreira NAscimento",
      photo: "default.png",
      boarding_point: 0,
      landing_point: 0,
      passagers: 0,
      starthour: "07:00",
    },
    {
      id: 2,
      name: "Pedro Henrique de Assis Ferreira NAscimento",
      photo: "default.png",
      boarding_point: 0,
      landing_point: 0,
      passagers: 0,
      starthour: "07:00",
    },
    {
      id: 3,
      name: "Pedro Henrique de Assis Ferreira NAscimento",
      photo: "default.png",
      boarding_point: 0,
      landing_point: 0,
      passagers: 0,
      starthour: "07:00",
    },
  ]);

  const openRoute = (id: number) => {
    console.log(id);
  };

  // const mapRef = useRef();
  // async function loadMap(mapRef: HTMLElement) {
  //   const newMap = await GoogleMap.create({
  //     id: "my-map", // Unique identifier for this map instance
  //     element: mapRef, // reference to the capacitor-google-map element
  //     apiKey: apiKey, // Your Google Maps API Key
  //     config: {
  //       center: {
  //         // The initial position to be rendered by the map
  //         lat: 33.6,
  //         lng: -117.9,
  //       },
  //       zoom: 8, // The initial zoom level to be rendered by the map
  //     },
  //   });
  // }
  // useEffect(() => {
  //   loadMap(mapRef.current!);
  // }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{"Mobil"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div id="day-container">
          {dateActual.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" - "} {dateActual.toLocaleTimeString()}
        </div>
        {/* <capacitor-google-map
          ref={mapRef}
          style={{
            display: "inline-block",
            width: 275,
            height: 400,
          }}
        ></capacitor-google-map> */}
        <IonTitle id="day-router-title">Rotas de hoje</IonTitle>

        <div id="home-container">
          {routeList.map((route, key) => {
            return (
              <IonCard key={key} routerLink={`/route/${route.id}`}>
                <IonCardHeader class="home-card-header">
                  <img className="home-photo" src={routeImg}></img>
                  <IonCardTitle>{route.name}</IonCardTitle>
                  <div className="home-card-start">
                    INICIO <br /> {route.starthour}
                  </div>
                </IonCardHeader>

                <IonCardContent className="home-card-point">
                  <div>
                    Pontos de Embarque: {route.boarding_point}
                  </div>
                  <div>
                    Pontos de Desembarque: {route.landing_point}
                  </div>
                  <div>Passageiros: {route.passagers}</div>
                </IonCardContent>
              </IonCard>
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export { Home };
