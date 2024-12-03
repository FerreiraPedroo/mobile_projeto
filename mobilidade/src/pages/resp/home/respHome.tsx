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
  starthour: string;
}

import { ContextAppInfo } from "../../../services/context/context";

import loading from "../../../assets/img/loading.gif";
import routeImg from "../../../assets/img/route-map.png";
import "./respHome.css";
import { UserConfig } from "../../../components/userConfig/userConfig";


const dateActual = new Date();

const RespHome: React.FC = () => {
  const router = useIonRouter();
  const { userInfo, changeUserInfo } = useContext(ContextAppInfo);

  const [routeList, setRouteList] = useState<Route[] | null>(null);

  useEffect(() => {

    async function getDayRouteList(userId: number) {
      try {
        const day = dateActual.toISOString().split("T")[0];

        const response = await fetch(`http://127.0.0.1:3000/resp-day-route-list/${userId}/${day}`, {
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
  }, [userInfo]);

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

      <IonContent fullscreen>
        <div id="day-container">
          <IonTitle id="resp-day-router-title">
            ROTAS DO DIA
            <br />
            {dateActual.toISOString().split("T")[0].split("-").reverse().join("/")}
          </IonTitle>
          <hr />
        </div>

        {routeList ?
          <>
            <div id="home-container">
              {routeList.map((route, key) => {
                return (
                  <IonCard key={key} routerLink={`/route/${route.id}`}>
                    <IonCardHeader class="home-card-header">
                      <img className="home-photo" src={routeImg}></img>
                      <IonCardTitle class="home-card-title">{route.name}</IonCardTitle>
                      <div className="home-card-start">
                        INICIO<br />{route.starthour}
                      </div>
                    </IonCardHeader>

                    <IonCardContent className="home-card-point">
                      <div>
                        Pontos de Embarque: {route.boarding_point_amount}
                      </div>
                      <div>
                        Pontos de Desembarque: {route.landing_point_amount}
                      </div>
                      <div>Passageiros: {route.passager_amount}</div>
                    </IonCardContent>
                  </IonCard>
                );
              })
              }
            </div>
          </>
          : <div id="home-loading">
            <img src={loading}></img>
          </div>
        }
      </IonContent>
    </IonPage>
  );
};

export { RespHome };
