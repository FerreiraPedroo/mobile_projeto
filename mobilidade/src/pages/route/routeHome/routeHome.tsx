import {
  IonAccordion,
  IonAccordionGroup,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { RouteComponentProps } from "react-router";
import { useContext, useEffect, useState } from "react";

import "./routeHome.css";
import loading from "../../../assets/img/loading.gif";
import { add } from "ionicons/icons";

interface Route {
  id: number;
  name: string;
  photo: string;
  boardingPoints: {
    id: number;
    name: string;
  }[];
  landingPoints: {
    id: number;
    name: string;
  }[];
  passagers: {
    id: number;
    name: string;
  }[];
}
interface RouteHomeParams
  extends RouteComponentProps<{
    routeId: string;
  }> {}

import { ContextAppInfo } from "../../../services/context/context";

import "./routeHome.css";

const RouteHome: React.FC<RouteHomeParams> = ({ match }) => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);
  const [routeInfo, setRouteInfo] = useState<Route | null>(null);

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
          </IonItem>

          <div>
            <IonAccordionGroup expand="inset" mode={"md"}>
              <IonAccordion value="first">
                <IonItem slot="header" color="light">
                  <IonLabel>Passageiros</IonLabel>
                </IonItem>
                {routeInfo.passagers.map((point) => (
                  <div key={point.id} className="route-home-add-point" slot="content">
                    {point.name}
                  </div>
                ))}
              </IonAccordion>
              <IonAccordion value="second">
                <IonItem slot="header" color="light">
                  <IonLabel>Pontos de desembarque</IonLabel>
                </IonItem>
                {routeInfo.boardingPoints.map((point) => (
                  <div key={point.id} className="route-home-add-point" slot="content">
                    {point.name}
                  </div>
                ))}
              </IonAccordion>
              <IonAccordion value="third">
                <IonItem slot="header" color="light">
                  <IonLabel>Pontos de desembarque</IonLabel>
                </IonItem>
                {routeInfo.landingPoints.map((point) => (
                  <div key={point.id} className="route-home-add-point" slot="content">
                    {point.name}
                  </div>
                ))}
              </IonAccordion>
            </IonAccordionGroup>
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
