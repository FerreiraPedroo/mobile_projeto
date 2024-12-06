import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonContent,
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
    status: number;
    boarding_time: string;
    landing_time: string;
    boarding_point: string;
    landing_point: string;
    boarding_point_maps: string;
    landing_point_maps: string;
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
import {
  caretForwardOutline,
  enterOutline,
  exitOutline,
  personOutline,
  squareOutline,
} from "ionicons/icons";
import { UserConfig } from "../../../components/userConfig/userConfig";

const RouteHome: React.FC<RouteHomeParams> = ({ match }) => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);
  const [routeInfo, setRouteInfo] = useState<Route | null>(null);
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
        `http://127.0.0.1:3000/route-passager-status/${passagerId}/${match.params.routeId}/${
          match.params.date.split("T")[0]
        }/${status}`,
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
          <div slot="end">
            <UserConfig />
          </div>
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
              <IonLabel id="route-home-header-passagers">Passageiros</IonLabel>
            </IonItem>
            {routeInfo.passagers.map((passager) => (
              <IonCard key={passager.name} className="route-home-card-container" color="light">
                <div className="route-home">
                  <IonCardHeader class="route-home-card-header">
                    <IonIcon className="point-user-icon" icon={personOutline} size="large" />
                    <IonText className="route-home-card-title">{passager.name}</IonText>
                  </IonCardHeader>

                  <div className="route-home-passager-buttons">
                    {passager.status == 0 ? (
                      <IonButton
                        color="primary"
                        size="small"
                        onClick={() => changeStatusPassager(passager.id, "boarding")}
                        disabled={routeInfo.status.status != "EM ANDAMENTO" || !passager.boarding_point_maps || !passager.landing_point_maps}
                      >
                        <IonIcon className="point-icon" icon={caretForwardOutline} color="light" />
                        <IonIcon className="point-icon" icon={squareOutline} color="light" />
                      </IonButton>
                    ) : (
                      ""
                    )}
                    {passager.status == 1 ? (
                      <IonButton
                        color="primary"
                        size="small"
                        onClick={() => changeStatusPassager(passager.id, "landing")}
                        disabled={routeInfo.status.status != "EM ANDAMENTO"}
                      >
                        <IonIcon className="point-icon" icon={squareOutline} color="light" />
                        <IonIcon className="point-icon" icon={caretForwardOutline} color="light" />
                      </IonButton>
                    ) : (
                      ""
                    )}
                    {passager.status == 2 ? (
                      <IonButton
                        color="light"
                        size="small"
                        onClick={() => changeStatusPassager(passager.id, "re-boarding")}
                        disabled={routeInfo.status.status != "EM ANDAMENTO"}
                      >
                        <IonIcon className="point-icon" icon={caretForwardOutline} color="medium" />
                        <IonIcon className="point-icon" icon={squareOutline} color="medium" />
                        {/* <IonIcon className="point-icon" icon={enterOutline} color="dark" /> */}
                      </IonButton>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <hr />
                <div className="route-home-passager-points-conteiner">
                  <div className="route-home-passager-points-box">
                    <IonIcon className="point-icon" icon={enterOutline} color="dark" />:{" "}
                    {passager.boarding_point ?? "-"}
                  </div>
                  <div className="route-home-passager-points-box">
                    <IonIcon className="point-icon" icon={exitOutline} color="dark" />:{" "}
                    {passager.landing_point ?? "-"}
                  </div>
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
