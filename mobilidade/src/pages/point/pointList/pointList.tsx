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

import { add, trashSharp } from "ionicons/icons";

import pointImg from "../../../assets/img/point.png";
import { MapAddPoint } from "../../../components/googleMaps/googleMapsAddPoint";

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
  const [pointCoordinate, setPointCoordinate] = useState<string>("");

  const [modalDeletePointShow, setModalDeletePointShow] = useState(false);
  const [modalDeletePointInfo, setModalDeletePointInfo] = useState<Point>();

  async function createPoint() {
    try {
      const response = await fetch(`http://localhost:3000/point`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ pointName, pointMaps: pointCoordinate, userId: userInfo.userId }),
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
            id="point-list-add-route-icon"
            size="small"
            onClick={() => setModalShow(true)}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonItem>

        <div id="point-container">
          {pointsList.map((point, key) => {
            return (
              <IonCard key={key} className="point-card-container">
                <div className="point-config">
                  <div>
                    <IonCardHeader class="point-card-header">
                      <img className="point-photo" src={pointImg}></img>
                      <IonCardTitle>{point.name}</IonCardTitle>
                    </IonCardHeader>
                  </div>
                  <IonButton
                    color="danger"
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
          // initialBreakpoint={1}
          // breakpoints={[1]}
          onWillDismiss={() => {
            setModalShow(false);
            setPointName("");
          }}
        >
          <div className="point-config-delete-modal">
            <MapAddPoint setPointCoordinate={setPointCoordinate}></MapAddPoint>
            <p id="point-list-add-route-text">Digite o nome do ponto de parada:</p>
            <input
              type="text"
              name="pointName"
              value={pointName}
              onChange={(e) => setPointName(e.target.value!)}
            />
            <div className="point-config-delete-modal-buttons">
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
            <div className="point-config-delete-modal">
              <p>Deseja realmente excluir o ponto de parada ?</p>
              <div className="point-config-delete-item-name">{modalDeletePointInfo.name}</div>
              <div className="point-config-delete-modal-buttons">
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
