import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { RouteComponentProps } from "react-router";
import { useCallback, useContext, useEffect, useState } from "react";

import "./routeHome.css";
import loading from "../../../assets/img/loading.gif";

interface Route {
  id: number;
  name: string;
  photo: string;
  passagers: {
    id: number;
    name: string;
  }[];
  status: {
    status: string;
    date: string;
    start_time: string;
    end_time: string;
  };
}
interface RouteHomeParams
  extends RouteComponentProps<{
    routeId: string;
  }> {}

import { ContextAppInfo } from "../../../services/context/context";

import "./routeHome.css";
import { MyMap } from "../../../components/googleMaps/googleMaps";
import { personCircleOutline } from "ionicons/icons";

const RouteHome: React.FC<RouteHomeParams> = ({ match }) => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);
  const [routeInfo, setRouteInfo] = useState<Route | null>(null);

  const startRoute = useCallback(() => {}, []);
  const finishRoute = useCallback(() => {}, []);

  useEffect(() => {
    async function getRoute(routeId: string) {
      try {
        const response = await fetch(`http://localhost:3000/route/${routeId}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const routeDataReturn = await response.json();

        if (routeDataReturn.codStatus == 200) {
          setRouteInfo(routeDataReturn.data);
          return;
        }

        throw "Erro";
      } catch (error) {
        setRouteInfo(null);
      }
    }
    getRoute(match.params.routeId);
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

      {routeInfo ? (
        <IonContent fullscreen>
          <IonItem>
            <p>{routeInfo.name}</p>
            <div id="route-home-status-button-container">
              {routeInfo.status.status == "NAO_INICIADO" && (
                <IonButton color="secondary" size="default" onClick={startRoute}>
                  INICIAR ROTA
                </IonButton>
              )}
              {routeInfo.status.status == "ANDAMENTO" && (
                <IonButton color="danger" onClick={finishRoute}>
                  FINALIZAR ROTA
                </IonButton>
              )}
            </div>
          </IonItem>

          <MyMap routeInfo={routeInfo}></MyMap>

          <div>
            <IonItem slot="header" color="light">
              <IonLabel>Passageiros</IonLabel>
            </IonItem>
            {routeInfo.passagers.map((point) => (
              <IonCard key={point.name} className="route-home-card-container">
                <div className="route-home">
                  <IonCardHeader class="route-home-card-header">
                    <IonIcon icon={personCircleOutline} size="large"></IonIcon>
                    <IonCardTitle>{point.name}</IonCardTitle>
                  </IonCardHeader>
                </div>
              </IonCard>
            ))}
          </div>
        </IonContent>
      ) : (
        <div id="route-home-loading">
          <img src={loading}></img>
        </div>
      )}
    </IonPage>
  );
};

export { RouteHome };
