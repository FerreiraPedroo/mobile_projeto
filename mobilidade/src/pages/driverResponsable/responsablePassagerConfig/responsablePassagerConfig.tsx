import {
  IonButton,
  IonButtons,
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useContext, useEffect, useState } from "react";
import { ContextAppInfo } from "../../../services/context/context";

import { add, personCircleOutline, trashSharp } from "ionicons/icons";

import loading from "../../../assets/img/loading.gif";

import "./responsablePassagerConfig.css";

interface RouteConfig {
  id: number;
  name: string;
  photo: string;
  boardingPoints: {
    id: number;
    name: string;
    maps: string;
  }[],
  blandingPoints: {
    id: number;
    name: string;
    maps: string;
  }[],
}

interface RouteConfigParams
  extends RouteComponentProps<{
    responsableId: string;
    passagerId: string;
  }> { }

interface ModalInfoInterface {
  id: number;
  name: string;
  route: string;
}

const ResponsablePassagerConfig: React.FC<RouteConfigParams> = ({ match }) => {
  const { responsableId, passagerId } = match.params;

  const router = useIonRouter();

  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);
  const [passagerInfo, setPassagerInfo] = useState<RouteConfig | null>(null);
  const [modalDeletePassagerShow, setModalDeletePassagerShow] = useState(false);
  const [modalDeletePassagerInfo, setModalDeletePassagerInfo] = useState<ModalInfoInterface>();

  async function handleDelete(id: number, route: string) {
    try {
      const response = await fetch(
        `http://localhost:3000/${route}/${userInfo.userId}/${responsableId}${route == "responsable-passager" ? "/" + id : ""
        }`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const deleteReturn = await response.json();

      if (deleteReturn.codStatus == 200) {
        setModalDeletePassagerShow(false);
        setUpdatePage((prev) => !prev);
        router.push("/responsables")
      }
    } catch (error) { }
  }

  async function openDeletePassagerModal(id: number, name: string, route: string) {
    setModalDeletePassagerShow(true);
    setModalDeletePassagerInfo({ id, name, route });
  }

  useEffect(() => {
    async function getResponsable() {
      try {
        const response = await fetch(`http://localhost:3000/responsable/${responsableId}/passager/${passagerId}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const routeDataReturn = await response.json();

        if (routeDataReturn.codStatus == 200) {
          setPassagerInfo(routeDataReturn.data);
        } else {
          throw "Erro";
        }
      } catch (error) {
        setPassagerInfo(null);
      }
    }

    getResponsable();
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

      {passagerInfo ? (
        <IonContent fullscreen>
          <IonItem id="route-config-route">Passageiro</IonItem>
          <div id="route-config-name-box">
            <p id="route-config-name">{passagerInfo.name}</p>
          </div>
          <div id="route-config-container">
            <IonItem slot="header" color="light">
              <IonLabel>Ponto de embarque</IonLabel>
              {passagerInfo && passagerInfo.boardingPoints.length == 0 &&
                (<IonFabButton id="open-modal" size="small" onClick={() => ""}>
                  <IonIcon icon={add}></IonIcon>
                </IonFabButton>)
              }
            </IonItem>
            {passagerInfo &&
              passagerInfo.boardingPoints.map((point) => (
                <div key={point.id} className="route-config-point" slot="content">
                  <IonIcon
                    icon={personCircleOutline}
                    className={"route-config-icon"}
                    size="large"
                  ></IonIcon>
                  <p className="route-config-point-name">{point.name}</p>
                  <div className="route-config-point-delete">
                    <IonButton
                      color="danger"
                      className="route-config-button-trash"
                      onClick={() =>
                        openDeletePassagerModal(point.id, point.name, "boarding")
                      }
                    >
                      <IonIcon icon={trashSharp}></IonIcon>
                    </IonButton>
                  </div>
                </div>
              ))}
          </div>

          <IonModal
            isOpen={modalDeletePassagerShow}
            initialBreakpoint={0.5}
            breakpoints={[0.5]}
            onWillDismiss={() => setModalDeletePassagerShow(false)}
          >
            {modalDeletePassagerInfo ? (
              <div className="route-config-delete-modal">
                <p>
                  Deseja realmente excluir{" "}
                  {modalDeletePassagerInfo.route == "responsable"
                    ? "o RESPONSÁVEL, todos os passageiros serão excluidos."
                    : "o passageiro "}
                  ?
                </p>
                <div className="route-config-delete-item-name">{modalDeletePassagerInfo.name}</div>
                <div className="route-config-delete-modal-buttons">
                  <IonButton
                    color="danger"
                    expand="full"
                    onClick={() =>
                      handleDelete(modalDeletePassagerInfo.id, modalDeletePassagerInfo.route)
                    }
                  >
                    EXCLUIR
                  </IonButton>
                  <IonButton
                    color="medium"
                    expand="full"
                    onClick={() => setModalDeletePassagerShow(false)}
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
      ) : (
        <div id="route-config-loading">
          <img src={loading}></img>
        </div>
      )}
    </IonPage>
  );
};

export { ResponsablePassagerConfig };
