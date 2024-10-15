import {
  IonAccordionGroup,
  IonButton,
  IonButtons,
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

import { trashSharp } from "ionicons/icons";

import loading from "../../../assets/img/loading.gif";

import "./responsableConfig.css";

interface RouteConfig {
  id: number;
  name: string;
  photo: string;
}

interface RouteConfigParams
  extends RouteComponentProps<{
    responsableId: string;
  }> {}

interface ModalInfoInterface {
  type: string;
  route: string;
  data: null | [{ id: number; name: string }] | [];
}

const ResponsableConfig: React.FC<RouteConfigParams> = ({ match }) => {
  const router = useIonRouter();
  const responsableId = match.params.responsableId;

  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);
  const [responsableInfo, setResponsableInfo] = useState<RouteConfig | null>(null);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);

  async function responsableDelete() {
    try {
      const response = await fetch(`http://localhost:3000/responsable/${responsableId}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const deleteReturn = await response.json();

      if (deleteReturn.codStatus == 200) {
        setModalDeleteShow(false);
        setUpdatePage((prev) => !prev);
        router.push("/responsables");
      }
    } catch (error) {}
  }

  useEffect(() => {
    async function getResponsable() {
      try {
        const response = await fetch(`http://localhost:3000/responsable/${responsableId}`, {
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
              onClick={() => setModalDeleteShow(true)}
            >
              <IonIcon icon={trashSharp}></IonIcon>
            </IonButton>
          </div>
          <div id="route-config-container">
            <IonAccordionGroup expand="inset" mode={"md"}>
              {/* <IonAccordion value="first"> */}
              <IonItem slot="header" color="light">
                <IonLabel>Passageiros</IonLabel>
              </IonItem>
              {/* {responsableInfo && responsableInfo.boardingPoints.map((point) => (
                  <div key={point.id} className="route-config-point" slot="content">
                    <IonIcon icon={locationOutline} className={"route-config-icon"} size="large"></IonIcon>
                    <p className="route-config-point-name">{point.name}</p>
                    <div className="route-config-point-delete">
                      <IonButton color="danger" className="route-config-button-trash" onClick={() => openDeleteModal("boarding", "Ponto de embarque", point.id, point.name, "point")}>
                        <IonIcon icon={trashSharp}></IonIcon>
                      </IonButton>
                    </div>
                  </div>
                ))} */}
              {/* </IonAccordion> */}
            </IonAccordionGroup>
          </div>

          <IonModal
            isOpen={modalDeleteShow}
            initialBreakpoint={0.5}
            breakpoints={[0.5]}
            onWillDismiss={() => setModalDeleteShow(false)}
          >
            <div className="route-config-delete-modal">
              <p>Deseja realmente excluir o responsável ?</p>

              <div className="route-config-delete-modal-buttons">
                <IonButton color="danger" expand="full" onClick={() => responsableDelete()}>
                  EXCLUIR
                </IonButton>
                <IonButton color="medium" expand="full" onClick={() => setModalDeleteShow(false)}>
                  VOLTAR
                </IonButton>
              </div>
            </div>
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
