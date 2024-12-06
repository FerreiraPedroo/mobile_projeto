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
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useContext, useEffect, useState } from "react";
import { ContextAppInfo } from "../../../services/context/context";

import { personOutline, trashSharp } from "ionicons/icons";

import loading from "../../../assets/img/loading.gif";

import "./responsableConfig.css";
import { UserConfig } from "../../../components/userConfig/userConfig";

interface RouteConfig {
  id: number;
  name: string;
  email: string;
  passagers: {
    id: number;
    name: string;
  }[];
}

interface RouteConfigParams
  extends RouteComponentProps<{
    responsableId: string;
  }> {}

interface ModalInfoInterface {
  id: number;
  name: string;
  route: string;
}

const ResponsableConfig: React.FC<RouteConfigParams> = ({ match }) => {
  const responsableId = match.params.responsableId;
  const router = useIonRouter();

  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);
  const [responsableInfo, setResponsableInfo] = useState<RouteConfig | null>(null);
  const [modalDeletePassagerShow, setModalDeletePassagerShow] = useState(false);
  const [modalDeletePassagerInfo, setModalDeletePassagerInfo] = useState<ModalInfoInterface>();

  async function handleDelete(id: number, route: string) {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/${route}/${userInfo.userId}/${responsableId}${
          route == "responsable-passager" ? "/" + id : ""
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
        router.push("/responsables");
      }
    } catch (error) {}
  }

  async function openDeletePassagerModal(id: number, name: string, route: string) {
    setModalDeletePassagerShow(true);
    setModalDeletePassagerInfo({ id, name, route });
  }

  useEffect(() => {
    async function getResponsable() {
      try {
        const response = await fetch(`http://127.0.0.1:3000/responsable/${responsableId}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const routeDataReturn = await response.json();

        if (routeDataReturn.codStatus == 200) {
          setResponsableInfo(routeDataReturn.data);
        } else {
          throw "Erro";
        }
      } catch (error) {
        setResponsableInfo(null);
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
          <div slot="end">
            <UserConfig />
          </div>
        </IonToolbar>
      </IonHeader>

      {responsableInfo ? (
        <IonContent fullscreen>
          <IonItem id="route-config-route">Responsável</IonItem>
          <div id="route-config-name-box">
            <p id="route-config-name">{responsableInfo.name}</p>
            <IonButton
              color="danger"
              className="route-config-button-trash"
              onClick={() =>
                openDeletePassagerModal(responsableInfo.id, responsableInfo.name, "responsable")
              }
            >
              <IonIcon icon={trashSharp}></IonIcon>
            </IonButton>
          </div>
          <div id="route-config-container">
            <IonItem slot="header" color="light">
              <IonLabel>Passageiros</IonLabel>
            </IonItem>

            {responsableInfo &&
              responsableInfo.passagers.map((passager) => (
                <IonCard
                  color="light"
                  key={passager.name}
                  className="responsable-config-card-container"
                >
                  <div className="responsable-config-home">
                    <div>
                      <IonCardHeader class="responsable-config-home-card-header">
                        <IonIcon icon={personOutline} size="large"></IonIcon>
                        <IonCardTitle>{passager.name}</IonCardTitle>
                      </IonCardHeader>
                    </div>
                  </div>
                </IonCard>
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

export { ResponsableConfig };
