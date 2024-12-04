import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
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
  passager_amount: number;
  status: {
    status: string;
    date: string;
    start_time: string;
    end_time: string;
  };
}

import { ContextAppInfo } from "../../services/context/context";

import loading from "../../assets/img/loading.gif";
import routeImg from "../../assets/img/route-map.png";
import { UserConfig } from "../../components/userConfig/userConfig";
import "./home.css";
import { mapOutline } from "ionicons/icons";

const dateActual = new Date();

const Home: React.FC = () => {
  const router = useIonRouter();
  const { userInfo, updatePage, changeUserInfo } = useContext(ContextAppInfo);

  const [routeList, setRouteList] = useState<Route[] | null>(null);

  useEffect(() => {
    async function getDayRouteList(userId: number) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/day-route-list/${userId}`, {
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
          <div slot="end">
            <UserConfig />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonItem>
        <p>Rotas de hoje</p>
        <div id="day-container">{dateActual.toLocaleString().split(",")[0]}</div>
      </IonItem>

      <IonContent>
        {routeList ? (
          <div id="home-container">
            {routeList.map((route, key) => {
              return (
                <IonCard
                  color="light"
                  key={key}
                  routerLink={`/route/${route.id}/date/${route.status.date.split("T")[0]}`}
                >
                  <IonCardHeader class="home-card-header">
                    <IonIcon className="home-photo" icon={mapOutline} color="dark" />
                    <IonCardTitle class="home-card-title">{route.name}</IonCardTitle>
                    <IonCardTitle
                      class={`home-card-status-`}
                    >
                      {route.status ? route.status.status ?? "—" : "—"}
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent className="home-card-point">
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
