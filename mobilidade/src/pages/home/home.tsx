import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";

interface Route {
  id: number;
  name: string;
  photo: string;
  boarding_point_amount: number;
  landing_point_amount: number;
  passager_amount: number;
  start_time: string;
}

import { ContextAppInfo } from "../../services/context/context";

import loading from "../../assets/img/loading.gif";
import routeImg from "../../assets/img/route-map.png";
import "./home.css";

const dateActual = new Date();

const Home: React.FC = () => {
  const router = useIonRouter();
  const { userInfo, updatePage, changeUserInfo } = useContext(ContextAppInfo);

  const [routeList, setRouteList] = useState<Route[] | null>(null);

  useEffect(() => {
    async function getDayRouteList(userId: number) {
      try {
        const response = await fetch(`http://localhost:3000/day-route-list/${userId}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Autorization: userInfo.token ?? "",
          },
        });

        const routeDataReturn = await response.json();

        if (routeDataReturn.codStatus == 200) {
          setRouteList(routeDataReturn.data);
        } else {
          await changeUserInfo({ userId: null, userName: null, token: null });
          router.push("/login");
        }
      } catch (error) {
        setRouteList([]);
      }
    }
    if (userInfo.userId) {
      getDayRouteList(userInfo.userId!);
    }
  }, [userInfo, updatePage]);

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

      <IonItem>
        <p>Rotas de hoje</p>
        <div id="day-container">
          {dateActual.toISOString().split("T")[0].split("-").reverse().join("/")}
        </div>
      </IonItem>

      <IonContent>
        {routeList ? (
          <div id="home-container">
            {routeList.map((route, key) => {
              return (
                <IonCard key={key} routerLink={`/route/${route.id}`}>
                  <IonCardHeader class="home-card-header">
                    <img className="home-photo" src={routeImg}></img>
                    <IonCardTitle class="home-card-title">{route.name}</IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent className="home-card-point">
                    <div>Horário de inicio: {route.start_time ?? "—"}</div>
                    <div>Passageiros: {route.passager_amount}</div>
                  </IonCardContent>
                </IonCard>
              );
            })}
          </div>
        ) : (
          <div id="home-loading">
            <img src={loading}></img>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export { Home };
