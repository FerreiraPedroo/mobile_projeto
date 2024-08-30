import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";

import { GoogleMap } from "@capacitor/google-maps";

import "./route.css";

const apiKey = "YOUR_API_KEY_HERE";
const dateActual = new Date();

interface Route {
  id: number;
  name: string;
  photo: string;
  boarding_point_amount: number;
  passager_amount: number;
}

const RouteList: React.FC = () => {
  const [routeList, setRouteList] = useState<Route[]>([
    {
      id: 0,
      name: "Natação",
      photo: "default.png",
      boarding_point_amount: 3,
      passager_amount: 6,
    },
    {
      id: 2,
      name: "Escolar Manhã",
      photo: "default.png",
      boarding_point_amount: 3,
      passager_amount: 6,
    },
    {
      id: 3,
      name: "Escolar a Tarde",
      photo: "default.png",
      boarding_point_amount: 3,
      passager_amount: 6,
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
                <IonCard key={key} onClick={() => null} button={true}>
                  <IonCardHeader>
                    <img className="route-photo" src={route.photo}></img>
                    <IonCardTitle>{route.name}</IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent>
                    <div className="route-point">
                      <div>pontos de parada: {route.boarding_point_amount}</div>
                      <div>passageiros: {route.passager_amount}</div>
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

export { RouteList };
