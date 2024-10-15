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
  IonInput,
  IonItem,
  IonMenuButton,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";

import { ContextAppInfo } from "../../../services/context/context";

import pointImg from "../../../assets/img/point.png";
import { add } from "ionicons/icons";
import "./pointList.css";

interface Route {
  id: number;
  name: string;
  photo: string;
  maps: number;
}

const PointList: React.FC = () => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  const [pointsList, setPointsList] = useState<Route[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [pointName, setPointName] = useState<string | number>("")

  async function createPoint() {
    try {
      const response = await fetch(`http://localhost:3000/point`, {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify({ pointName, userId: userInfo.userId }),
        headers: { 'Content-Type': 'application/json' }
      });

      const listReturn = await response.json();

      if (listReturn.codStatus == 200) {
        setPointName("");
        setUpdatePage(prev => !prev)
        setModalShow(false)
      }

    } catch (error) {

    }

  }

  useEffect(() => {
    if (userInfo.userId) {
      async function getPoints(userId: number) {
        try {
          const response = await fetch(`http://localhost:3000/point-list/${userId}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const routeDataReturn = await response.json();
          if (routeDataReturn.codStatus == 200) {
            setPointsList(routeDataReturn.data);
            return;
          }

          throw "Erro";
        } catch (error) {
          setPointsList([]);
        }
      }

      getPoints(userInfo.userId);
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
          <p>Pontos de parada</p>
          <IonFabButton id="route-list-add-route-icon" size="small" onClick={() => setModalShow(true)}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonItem>

        <div id="route-container">
          {pointsList.map((route, key) => {
            return (
              <IonCard key={key} routerLink={`/route-config/${route.id}`}>
                <IonCardHeader class="route-card-header">
                  <img className="route-photo" src={pointImg}></img>
                  <IonCardTitle>{route.name}</IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="route-card-point">
                  <div>Mapa: {route.maps ?? "-"}</div>

                </IonCardContent>
              </IonCard>
            );
          })}
        </div>

        <IonModal isOpen={modalShow} initialBreakpoint={.50} breakpoints={[.50]} onWillDismiss={() => setModalShow(false)}>
          <div className="route-config-delete-modal">
            <p id="route-list-add-route-text">Digite o nome do ponto de parada:</p>
            <IonInput fill="outline" color="dark" value={pointName} onIonInput={(e) => setPointName(e.target.value!)} ></IonInput>
            <div className="route-config-delete-modal-buttons">
              <IonButton color="primary" expand="full" onClick={() => createPoint()}>CRIAR</IonButton>
              <IonButton color="medium" expand="full" onClick={() => setModalShow(false)}>VOLTAR</IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export { PointList };
