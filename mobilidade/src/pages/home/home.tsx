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
import { useEffect, useState } from "react";

import { useStorage } from "../../hooks/useStorage";
import { GoogleMap } from "@capacitor/google-maps";
import loading from "../../assets/img/loading.gif";


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
  const [routeList, setRouteList] = useState<Route[] | null>(null);

  const openRoute = (id: number) => {
    console.log(id);
  };


  useEffect(() => {
    async function getDayRouteList(userId: number) {
      try {

        const response = await fetch(`http://localhost:3000/day-route-list/${userId}`, {
          method: "GET",
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const routeDataReturn = await response.json();
        if (routeDataReturn.codStatus == 200) {
          setRouteList(routeDataReturn.data)
          return;
        }

        throw "Erro";
      } catch (error) {
        setRouteList(null)
      }
    };

    getDayRouteList(0);
  }, [])

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
          <br /> {dateActual.toLocaleTimeString()}<hr />
        </div>

        {routeList ?
          <>
            <IonTitle id="day-router-title">Rotas de hoje</IonTitle>
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
                        Pontos de Embarque: {route.boarding_point}
                      </div>
                      <div>
                        Pontos de Desembarque: {route.landing_point}
                      </div>
                      <div>Passageiros: {route.passagers}</div>
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

export { Home };
