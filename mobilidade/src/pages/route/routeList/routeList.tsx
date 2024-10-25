import {
  IonButton,
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
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";

import { ContextAppInfo } from "../../../services/context/context";
import routeImg from "../../../assets/img/route-map.png";
import { add } from "ionicons/icons";
import "./routeList.css";

interface Route {
  id: number;
  name: string;
  photo: string;
  passagerAmount: number;
}

const RouteList: React.FC = () => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  const [routesList, setRoutesList] = useState<Route[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [routeName, setRouteName] = useState<string | number>("");
  const [routeStartTime, setRouteStartTime] = useState<string | number>("");

  async function createRoute() {
    try {
      const response = await fetch(`http://localhost:3000/route`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ routeName, routeStartTime, userId: userInfo.userId }),
        headers: { "Content-Type": "application/json" },
      });

      const listReturn = await response.json();

      if (listReturn.codStatus == 200) {
        setUpdatePage((prev) => !prev);
        setModalShow(false);
        setRouteName("");
        setRouteStartTime("")
      }
    } catch (error) {}
  }

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

      <IonContent fullscreen>
        <IonItem>
          <p>Rotas</p>
          <IonFabButton
            id="route-list-add-route-icon"
            size="small"
            onClick={() => setModalShow(true)}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
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
                  <div>Passageiros: {route.passagerAmount}</div>
                </IonCardContent>
              </IonCard>
            );
          })}
        </div>

        <IonModal
          isOpen={modalShow}
          initialBreakpoint={0.5}
          breakpoints={[0.5]}
          onWillDismiss={() => {
            setModalShow(false);
            setRouteName("");
          }}
        >
          <div className="route-config-delete-modal">
            <p id="route-list-add-route-text">Digite o nome da rota:</p>
            <input
              type="text"
              name="routeName"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value!)}
            />
            <p id="route-list-add-route-text">Digite o horário de inicio:</p>
            <input
              type="time"
              name="routeStartTime"
              value={routeStartTime}
              onChange={(e) => setRouteStartTime(e.target.value!)}
            />
            <div className="route-config-delete-modal-buttons">
              <IonButton color="primary" expand="full" onClick={() => createRoute()}>
                CRIAR
              </IonButton>
              <IonButton color="medium" expand="full" onClick={() => setModalShow(false)}>
                VOLTAR
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export { RouteList };
