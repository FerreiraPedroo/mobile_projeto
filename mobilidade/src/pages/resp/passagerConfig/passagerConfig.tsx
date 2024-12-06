import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ContextAppInfo } from "../../../services/context/context";

import { add, locationOutline, personOutline, trashSharp } from "ionicons/icons";

import loading from "../../../assets/img/loading.gif";

import "./passagerConfig.css";
import { UserConfig } from "../../../components/userConfig/userConfig";

interface PassagerConfig {
  id: number;
  name: string;
  photo: string;
  routes: {
    id: number;
    name: string;
  }[];
}
interface RouteConfigParams
  extends RouteComponentProps<{
    passagerId: string;
  }> { }
interface ModalDeleteInfoInterface {
  type: string;
  typeName: string;
  route: string;
  data: null | { id: number; name: string };
}


const RespPassagerConfig: React.FC<RouteConfigParams> = ({ match }) => {
  const router = useIonRouter();
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  const [passagerInfo, setPassagerInfo] = useState<PassagerConfig>();
  const [modalDeleteShow, setModalDeleteShow] = useState(false);

  async function routeItemDelete() {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/resp-passager/${userInfo.userId}/${match.params.passagerId}`,
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
        setModalDeleteShow(false);
        setUpdatePage((prev) => !prev);
        router.push("/resp-passagers");
      }
    } catch (error) { }
  }

  useEffect(() => {
    async function getPassager(passagerId: string) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/resp-passager-config/${passagerId}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const passagerDataReturn = await response.json();

        if (passagerDataReturn.codStatus == 200) {
          setPassagerInfo(passagerDataReturn.data);
        } else {
          throw "Erro";
        }
      } catch (error) {
        router.push("/resp-passagers");
      }
    }

    getPassager(match.params.passagerId);

  }, [userInfo]);

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

      {passagerInfo ? (
        <IonContent fullscreen>
          <IonItem id="resp-passager-config-route">Passageiro</IonItem>
          <div id="resp-passager-config-name-box">
            <p id="resp-passager-config-name">{passagerInfo.name}</p>
            <IonButton
              color="danger"
              className="resp-passager-config-button-trash"
              onClick={() =>
                setModalDeleteShow(true)
              }
            >
              <IonIcon icon={trashSharp}></IonIcon>
            </IonButton>
          </div>

          <IonItem className="resp-passager-config-calendar-head" color="light">
            <IonLabel>Rotas associadas</IonLabel>
          </IonItem>
          <div>
            {passagerInfo &&
              passagerInfo.routes.map((route) => (
                <IonItem
                  key={route.name}
                  className="resp-passager-confg-card-container"
                >
                  <div className="resp-passager-config">
                    <IonCardHeader class="resp-passager-config-card-header">
                      <IonIcon
                        icon={personOutline}
                        className={"resp-passager-config-icon"}
                        size="large"
                      ></IonIcon>
                      <IonCardTitle>{route.name}</IonCardTitle>
                    </IonCardHeader>
                  </div>
                </IonItem>
              ))}
          </div>

          <IonModal
            isOpen={modalDeleteShow}
            initialBreakpoint={0.5}
            breakpoints={[0.5]}
            onWillDismiss={() => setModalDeleteShow(false)}
          >
            <div className="resp-passager-config-delete-modal">
              <p>
                Deseja realmente excluir
                <br />
                <br />
              </p>
              <div className="resp-passager-config-delete-item-name">{passagerInfo.name}</div>
              <div className="resp-passager-config-delete-modal-buttons">
                <IonButton
                  className="resp-passager-config-delete-buttons"
                  color="danger"
                  expand="full"
                  onClick={() => routeItemDelete()}
                >
                  EXCLUIR
                </IonButton>
                <IonButton
                  className="resp-passager-config-delete-buttons"
                  color="medium"
                  expand="full"
                  onClick={() => setModalDeleteShow(false)}
                >
                  VOLTAR
                </IonButton>
              </div>
            </div>
          </IonModal>

        </IonContent>
      ) : (
        <div id="resp-passager-config-loading">
          <img src={loading}></img>
        </div>
      )}
    </IonPage>
  );
};

export { RespPassagerConfig };
