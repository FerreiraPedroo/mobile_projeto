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
import { useContext, useEffect, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
const apiKey = "YOUR_API_KEY_HERE";
const dateActual = new Date();

import { ContextAppInfo } from "../../../services/context/context";
import routeImg from "../../../assets/img/route-map.png";
import "./routeList.css";

interface Route {
  id: number;
  name: string;
  photo: string;
  boarding_point_amount: number;
  landing_point_amount: number;
  passager_amount: number;
}

const RouteList: React.FC = () => {
  const { userInfo } = useContext(ContextAppInfo);

  const [routesList, setRoutesList] = useState<Route[]>([]);

  useEffect(() => {
    if (userInfo.userId) {
      async function getRoutes(userId: number) {
        try {
          const response = await fetch(`http://localhost:3000/route-list/${userId}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const routeDataReturn = await response.json();
          if (routeDataReturn.codStatus == 200) {
            setRoutesList(routeDataReturn.data);
            return;
          }

          throw "Erro";
        } catch (error) {
          setRoutesList([]);
        }
      }

      getRoutes(userInfo.userId);
    }
  }, [userInfo]);

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
          {routesList.map((route, key) => {
            return (
              <IonCard key={key} routerLink={`/route-config/${route.id}`}>
                <IonCardHeader class="route-card-header">
                  <img className="route-photo" src={routeImg}></img>
                  <IonCardTitle>{route.name}</IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="route-card-point">
                  <div>Pontos de Embarque: {route.boarding_point_amount}</div>
                  <div>Pontos de Desembarque: {route.landing_point_amount}</div>
                  <div>Passageiros: {route.passager_amount}</div>
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
