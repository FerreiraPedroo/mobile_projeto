import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";

import "./routeList.css";

const apiKey = "YOUR_API_KEY_HERE";
const dateActual = new Date();

interface Route {
  id: number;
  name: string;
  photo: string;
  boarding_point: number;
  landing_point: number;
  passagers: number;
  // starthour: string;
}

import routeImg from "../../../assets/img/route-map.png";

const RouteList: React.FC = () => {
  const [routeList, setRouteList] = useState<Route[]>([
    {
      id: 0,
      name: "Natação",
      photo: "default.png",
      boarding_point: 3,
      landing_point: 2,
      passagers: 10
    },
    {
      id: 2,
      name: "Escolar Manhã",
      photo: "default.png",
      boarding_point: 8,
      landing_point: 1,
      passagers: 10
    },
    {
      id: 3,
      name: "Escolar a Tarde",
      photo: "default.png",
      boarding_point: 2,
      landing_point: 3,
      passagers: 6
    },
  ]);

  const openRoute = (id: number) => {
    console.log(id);
  };

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
        <IonItem>
          <p>Rotas</p>
        </IonItem>

        <div id="route-container">
          {routeList.map((route, key) => {
            return (
              <IonCard key={key} routerLink={`/route-config/${route.id}`}>
                <IonCardHeader class="route-card-header">
                  <img className="route-photo" src={routeImg}></img>
                  <IonCardTitle>{route.name}</IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="route-card-point">
                  <div>
                    Pontos de  Embarque: {route.boarding_point}
                  </div>
                  <div>
                    Pontos de  Desembarque: {route.landing_point}
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

export { RouteList };
