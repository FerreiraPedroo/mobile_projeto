import {
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
    status: number;
    boarding_time: string;
    landing_time: string;
    boarding_point: string;
    landing_point: string;
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
    date: string;
  }> {}

import { ContextAppInfo } from "../../../services/context/context";

import "./routeHome.css";
import { MyMap } from "../../../components/googleMaps/googleMaps";
import { personCircleOutline } from "ionicons/icons";

const RouteHome: React.FC<RouteHomeParams> = ({ match }) => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);
  const [routeInfo, setRouteInfo] = useState<Route | null>(null);
  console.log({ routeInfo });
  console.log({updatePage});
  const [finishModal, setFinishModal] = useState(false);

  // STATUS DA ROTA
  const changeStatusRoute = useCallback(async (status: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/route-status/${match.params.routeId}/${match.params.date}/${status}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const routeDataReturn = await response.json();

      if (routeDataReturn.codStatus == 200) {
        setUpdatePage((prev) => !prev);
        return;
      }

      throw "Erro";
    } catch (error) {}
  }, []);

  // STATUS DOS PASSAGEIROS
  const changeStatusPassager = useCallback(async (passagerId: number, status: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/route-passager-status/${passagerId}/${match.params.routeId}/${match.params.date.split("T")[0]}/${status}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const routeDataReturn = await response.json();

      if (routeDataReturn.codStatus == 200) {
        setUpdatePage((prev) => !prev);
        return;
      }

      throw "Erro";
    } catch (error) {}
  }, []);

  // VERIFICAR SE TODOS OS PASSAGEIROS
  const passagerVerify = useCallback(() => {
    if (routeInfo) {
      const isPassagerLanding = routeInfo.passagers.filter((passager) => passager.status != 2);

      if (isPassagerLanding) {
      }
    }
  }, []);

  useEffect(() => {
    async function getRoute(routeId: string) {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/route/${routeId}/date/${match.params.date}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
              {routeInfo.status.status == "NÃO INICIADO" && (
                <IonButton
                  color="secondary"
                  size="default"
                  onClick={() => changeStatusRoute("start")}
                >
                  INICIAR ROTA
                </IonButton>
              )}
              {routeInfo.status.status == "EM ANDAMENTO" && (
                <IonButton
                  color="danger"
                  size="default"
                  onClick={() => changeStatusRoute("finish")}
                >
                  FINALIZAR ROTA
                </IonButton>
              )}
              {routeInfo.status.status == "FINALIZADO" && (
                <IonButton color="light" size="default" onClick={() => changeStatusRoute("reopen")}>
                  REABRIR ROTA
                </IonButton>
              )}
            </div>
          </IonItem>

          <MyMap routeInfo={routeInfo}></MyMap>

          <div>
            <IonItem slot="header" color="light">
              <IonLabel>Passageiros</IonLabel>
            </IonItem>
            {routeInfo.passagers.map((passager) => (
              <IonCard key={passager.name} className="route-home-card-container">
                <div className="route-home">
                  <IonCardHeader class="route-home-card-header">
                    <IonIcon icon={personCircleOutline} size="large"></IonIcon>
                    <IonCardTitle>{passager.name}</IonCardTitle>
                  </IonCardHeader>

                  <div className="route-home-passager-buttons">
                    {passager.status == 0 ? (
                      <IonButton
                        color="primary"
                        size="default"
                        onClick={() => changeStatusPassager(passager.id, "boarding")}
                        disabled={routeInfo.status.status != "EM ANDAMENTO"}
                      >
                        EMBARCAR
                      </IonButton>
                    ) : (
                      ""
                    )}
                    {passager.status == 1 ? (
                      <IonButton
                        color="primary"
                        size="default"
                        onClick={() => changeStatusPassager(passager.id, "landing")}
                        disabled={routeInfo.status.status != "EM ANDAMENTO"}
                      >
                        DESEMBARCAR
                      </IonButton>
                    ) : (
                      ""
                    )}
                    {passager.status == 2 ? (
                      <IonButton
                        color="light"
                        size="default"
                        onClick={() => changeStatusPassager(passager.id, "re-boarding")}
                        disabled={routeInfo.status.status != "EM ANDAMENTO"}
                      >
                        REEMBARCAR
                      </IonButton>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="route-home-passager-points">
                  <div>PONTO EMBARQUE: {passager.boarding_point ?? "-"}</div>
                  <div>PONTO DESEMBARQUE: {passager.landing_point ?? "-"}</div>
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
