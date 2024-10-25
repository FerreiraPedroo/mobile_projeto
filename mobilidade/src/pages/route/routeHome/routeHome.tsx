import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
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

interface Route {
  id: number;
  name: string;
  photo: string;
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
import { MyMap } from "../../../components/googleMaps/googleMaps";
import { personCircleOutline } from "ionicons/icons";

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

          <MyMap routeInfo={routeInfo}></MyMap>

          <div>
            <IonItem slot="header" color="light">
              <IonLabel>Passageiros</IonLabel>
            </IonItem>
            {routeInfo.passagers.map((point) => (
              <IonCard key={point.name} className="route-home-card-container">
                <div className="route-home">
                  <div>
                    <IonCardHeader class="route-home-card-header">
                      <IonIcon
                        icon={personCircleOutline}
                        size="large"
                      ></IonIcon>
                      <IonCardTitle>{point.name}</IonCardTitle>
                    </IonCardHeader>
                  </div>

                  {/* <IonButton
                    color="danger"
                    className=""
                    onClick={() => ""}
                  >
                    <IonIcon icon={"trashSharp"}></IonIcon>
                  </IonButton> */}
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
