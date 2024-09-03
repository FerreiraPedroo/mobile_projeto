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

import { GoogleMap } from "@capacitor/google-maps";

import "./home.css";
import { useStorage } from "../../hooks/useStorage";

const apiKey = "YOUR_API_KEY_HERE";
const dateActual = new Date();

interface Passager {
  id: number;
  name: string;
  photo: string;
  boarding_point: string;
  landing_point: string;
}

const Home: React.FC = () => {
  const { loginToken } = useStorage();
  const [passagerList, setPassagerList] = useState<Passager[]>([
    {
      id: 0,
      name: "Pedro Henrique de Assis Ferreira NAscimento",
      photo: "default.png",
      boarding_point: "AKI",
      landing_point: "ALI",
    },
    {
      id: 1,
      name: "Pedro Henrique de Assis Ferreira NAscimento",
      photo: "default.png",
      boarding_point: "AKI",
      landing_point: "ALI",
    },
    {
      id: 2,
      name: "Pedro Henrique de Assis Ferreira NAscimento",
      photo: "default.png",
      boarding_point: "AKI",
      landing_point: "ALI",
    },
    {
      id: 3,
      name: "Pedro Henrique de Assis Ferreira NAscimento",
      photo: "default.png",
      boarding_point: "AKI",
      landing_point: "ALI",
    },
  ]);

  const openPassager = (id: number) => {
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

        <div id="passager-container">
          {passagerList.map((passager, key) => {
            return (
              <IonCard key={key} onClick={() => openPassager(passager.id)}>
                <IonCardHeader>
                  <img className="passager-photo" src={passager.photo}></img>
                  <IonCardTitle>{passager.name}</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <div className="passager-point">
                    <div>embarque: {passager.boarding_point}</div>
                    <div>desembarque: {passager.landing_point}</div>
                  </div>
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
