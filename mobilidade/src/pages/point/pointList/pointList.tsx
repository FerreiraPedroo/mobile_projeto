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
import { add, trashSharp } from "ionicons/icons";
import "./pointList.css";

interface Point {
  id: number;
  name: string;
  photo: string;
  maps: number;
}

const PointList: React.FC = () => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  const [pointsList, setPointsList] = useState<Point[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [pointName, setPointName] = useState<string | number>("");

  const [modalDeletePointShow, setModalDeletePointShow] = useState(false);
  const [modalDeletePointInfo, setModalDeletePointInfo] = useState<Point>();

  async function createPoint() {
    try {
      const response = await fetch(`http://localhost:3000/point`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ pointName, userId: userInfo.userId }),
        headers: { "Content-Type": "application/json" },
      });

      const listReturn = await response.json();

      if (listReturn.codStatus == 200) {
        setPointName("");
        setUpdatePage((prev) => !prev);
        setModalShow(false);
      }
    } catch (error) {}
  }

  async function deletePointModalOpen(point: Point) {
    setModalDeletePointShow(true);
    setModalDeletePointInfo(point);
  }

  async function deletePoint(pointId: number) {
    try {
      const response = await fetch(`http://localhost:3000/point/${pointId}/${userInfo.userId}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const deleteReturn = await response.json();

      if (deleteReturn.codStatus == 200) {
        setModalDeletePointShow(false);
        setUpdatePage((prev) => !prev);
      }
    } catch (error) {}
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
          <IonFabButton
            id="route-list-add-route-icon"
            size="small"
            onClick={() => setModalShow(true)}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonItem>

        <div id="route-container">
          {pointsList.map((point, key) => {
            return (
              <IonCard key={key}>
                <div className="point-config">
                  <div>
                    <IonCardHeader class="route-card-header">
                      <img className="route-photo" src={pointImg}></img>
                      <IonCardTitle>{point.name}</IonCardTitle>
                    </IonCardHeader>
                  </div>
                  <IonButton
                    color="danger"
                    className="route-config-button-trash"
                    onClick={() => deletePointModalOpen(point)}
                  >
                    <IonIcon icon={trashSharp}></IonIcon>
                  </IonButton>
                </div>
              </IonCard>
            );
          })}
        </div>

        <IonModal
          isOpen={modalShow}
          initialBreakpoint={0.5}
          breakpoints={[0.5]}
          onWillDismiss={() => setModalShow(false)}
        >
          <div className="route-config-delete-modal">
            <p id="route-list-add-route-text">Digite o nome do ponto de parada:</p>
            <IonInput
              fill="outline"
              color="dark"
              value={pointName}
              onIonInput={(e) => setPointName(e.target.value!)}
            ></IonInput>
            <div className="route-config-delete-modal-buttons">
              <IonButton color="primary" expand="full" onClick={() => createPoint()}>
                CRIAR
              </IonButton>
              <IonButton color="medium" expand="full" onClick={() => setModalShow(false)}>
                VOLTAR
              </IonButton>
            </div>
          </div>
        </IonModal>

        <IonModal
          isOpen={modalDeletePointShow}
          initialBreakpoint={0.5}
          breakpoints={[0.5]}
          onWillDismiss={() => setModalDeletePointShow(false)}
        >
          {modalDeletePointInfo ? (
            <div className="route-config-delete-modal">
              <p>Deseja realmente excluir o ponto de parada ?</p>
              <div className="route-config-delete-item-name">{modalDeletePointInfo.name}</div>
              <div className="route-config-delete-modal-buttons">
                <IonButton
                  color="danger"
                  expand="full"
                  onClick={() => deletePoint(modalDeletePointInfo.id)}
                >
                  EXCLUIR
                </IonButton>
                <IonButton
                  color="medium"
                  expand="full"
                  onClick={() => setModalDeletePointShow(false)}
                >
                  VOLTAR
                </IonButton>
              </div>
            </div>
          ) : (
            ""
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export { PointList };
