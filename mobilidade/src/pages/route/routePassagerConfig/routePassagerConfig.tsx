import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
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
import { useContext, useEffect, useState } from "react";
import { ContextAppInfo } from "../../../services/context/context";

import { add, locationOutline, personCircleOutline, trashSharp } from "ionicons/icons";

import loading from "../../../assets/img/loading.gif";

import "./routePassagerConfig.css";
import { UserConfig } from "../../../components/userConfig/userConfig";

interface PassagerConfig {
  id: number;
  name: string;
  photo: string;
  boardingPoints: {
    id: number;
    name: string;
    maps: string;
  }[];
  landingPoints: {
    id: number;
    name: string;
    maps: string;
  }[];
}

interface PassagerConfigParams
  extends RouteComponentProps<{
    routeId: string;
    passagerId: string;
  }> {}

interface ModalInfoInterface {
  id: number;
  name: string;
  route: string;
}

interface ModalDelPassInfoInterface {
  passagerId: string | number;
  routeId: string | number;
  name: string;
}

interface ModalAddPointInfoInterface {
  type: string;
  route: string;
  data: null | [{ id: number; name: string }] | [];
}

const RoutePassagerConfig: React.FC<PassagerConfigParams> = ({ match }) => {
  const { routeId, passagerId } = match.params;

  const router = useIonRouter();
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  const [passagerInfo, setPassagerInfo] = useState<PassagerConfig | null>(null);
  const [modalDeletePassagerShow, setModalDeletePassagerShow] = useState(false);
  const [modalDeletePassagerInfo, setModalDeletePassagerInfo] = useState<ModalInfoInterface>();

  const [modalDeleteRoutePassagerShow, setModalDeleteRoutePassagerShow] = useState(false);
  const [modalDeleteRoutePassagerInfo, setModalDeleteRoutePassagerInfo] =
    useState<ModalDelPassInfoInterface>();

  const [modalInfo, setModalInfo] = useState<ModalAddPointInfoInterface>({
    type: "",
    route: "",
    data: null,
  });
  const [modalShow, setModalShow] = useState(false);

  async function openDeletePassagerModal(id: number, name: string, route: string) {
    setModalDeletePassagerShow(true);
    setModalDeletePassagerInfo({ id, name, route });
  }
  async function handleDelete(pointId: number, route: string) {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/passager/${passagerId}/route/${routeId}/type-point/${route}`,
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
        // router.push("/responsables");
      }
    } catch (error) {}
  }

  async function openDeleteRoutePassagerModal(passagerId: number, routeId: string, name: string) {
    setModalDeleteRoutePassagerShow(true);
    setModalDeleteRoutePassagerInfo({ passagerId, routeId, name });
  }
  async function handleRoutePassagerDelete(passagerId: number | string, route: string) {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/passager/${passagerId}/route/${routeId}`,
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
        setModalDeleteRoutePassagerShow(false);
        setUpdatePage((prev) => !prev);
        router.push(`/route-config/${routeId}`);
      }
    } catch (error) {}
  }

  async function openAddModal(type: string) {
    setModalShow(true);
    setModalInfo({ type: "", route: "", data: null });

    try {
      const response = await fetch(`http://127.0.0.1:3000/point-list/${userInfo.userId}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const listReturn = await response.json();

      if (listReturn.codStatus == 200) {
        setModalInfo({ type, route: "", data: listReturn.data });
      }
    } catch (error) {
      setModalInfo({ type: "", route: "", data: [] });
    }
  }

  async function routeAddItem(typeParam: string, itemId: number) {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/passager/${routeId}/${passagerId}/${itemId}/type/${typeParam}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const addReturn = await response.json();

      if (addReturn.codStatus == 200) {
        setModalShow(false);
        setUpdatePage((prev) => !prev);
      }
    } catch (error) {}
  }

  useEffect(() => {
    async function getResponsable() {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/route/${routeId}/passager/${passagerId}`,
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
          <div slot="end">
            <UserConfig />
          </div>
        </IonToolbar>
      </IonHeader>

      {passagerInfo ? (
        <IonContent fullscreen>
          <IonItem id="passager-config-route">Passageiro</IonItem>
          <div id="passager-config-name-box">
            <p id="passager-config-name">{passagerInfo.name}</p>
            <IonButton
              color="danger"
              onClick={() =>
                openDeleteRoutePassagerModal(passagerInfo.id, routeId, passagerInfo.name)
              }
            >
              <IonIcon icon={trashSharp}></IonIcon>
            </IonButton>
          </div>

          <div>
            <IonItem slot="header" color="light">
              <IonLabel>Ponto de embarque</IonLabel>

              {passagerInfo && passagerInfo.boardingPoints.length == 0 && (
                <IonFabButton id="open-modal" size="small" onClick={() => openAddModal("boarding")}>
                  <IonIcon icon={add}></IonIcon>
                </IonFabButton>
              )}
            </IonItem>

            {passagerInfo &&
              passagerInfo.boardingPoints.map((point) => (
                <IonCard key={point.name} color="light" className="route-confg-card-container">
                  <div className="route-config">
                    <div>
                      <IonCardHeader class="route-config-card-header">
                        <IonIcon
                          icon={locationOutline}
                          className="passager-route-config-icon"
                          size="large"
                        ></IonIcon>
                        <IonCardTitle>{point.name}</IonCardTitle>
                      </IonCardHeader>
                    </div>

                    <IonButton
                      color="danger"
                      onClick={() => openDeletePassagerModal(point.id, point.name, "boarding")}
                    >
                      <IonIcon icon={trashSharp}></IonIcon>
                    </IonButton>
                  </div>
                </IonCard>
              ))}
          </div>

          <div>
            <IonItem slot="header" color="light">
              <IonLabel>Ponto de desembarque</IonLabel>

              {passagerInfo && passagerInfo.landingPoints.length == 0 && (
                <IonFabButton id="open-modal" size="small" onClick={() => openAddModal("landing")}>
                  <IonIcon icon={add}></IonIcon>
                </IonFabButton>
              )}
            </IonItem>

            {passagerInfo &&
              passagerInfo.landingPoints.map((point) => (
                <IonCard key={point.name} color="light" className="route-confg-card-container">
                  <div className="route-config">
                    <div>
                      <IonCardHeader class="route-config-card-header">
                        <IonIcon
                          icon={locationOutline}
                          className="passager-route-config-icon"
                          size="large"
                        ></IonIcon>
                        <IonCardTitle>{point.name}</IonCardTitle>
                      </IonCardHeader>
                    </div>

                    <IonButton
                      color="danger"
                      onClick={() => openDeletePassagerModal(point.id, point.name, "landing")}
                    >
                      <IonIcon icon={trashSharp}></IonIcon>
                    </IonButton>
                  </div>
                </IonCard>
              ))}
          </div>

          <IonModal
            isOpen={modalDeleteRoutePassagerShow}
            initialBreakpoint={0.5}
            breakpoints={[0.5]}
            onWillDismiss={() => setModalDeletePassagerShow(false)}
          >
            {modalDeleteRoutePassagerInfo ? (
              <div className="passager-config-delete-modal">
                <p>Deseja realmente excluir da rota o passageiro:</p>
                <div className="passager-config-delete-item-name">
                  {modalDeleteRoutePassagerInfo.name}
                </div>
                <div className="passager-config-delete-modal-buttons">
                  <IonButton
                    className="passager-config-delete-buttons"
                    color="danger"
                    expand="full"
                    onClick={() =>
                      handleRoutePassagerDelete(
                        modalDeleteRoutePassagerInfo.passagerId,
                        modalDeleteRoutePassagerInfo.routeId
                      )
                    }
                  >
                    EXCLUIR
                  </IonButton>
                  <IonButton
                    className="passager-config-delete-buttons"
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

          <IonModal
            isOpen={modalDeletePassagerShow}
            initialBreakpoint={0.5}
            breakpoints={[0.5]}
            onWillDismiss={() => setModalDeletePassagerShow(false)}
          >
            {modalDeletePassagerInfo ? (
              <div className="passager-config-delete-modal">
                <p>
                  Deseja realmente excluir o ponto de
                  {modalDeletePassagerInfo.route == "boarding" ? "embarque" : "desembarque"}:
                </p>
                <div className="passager-config-delete-item-name">
                  {modalDeletePassagerInfo.name}
                </div>
                <div className="passager-config-delete-modal-buttons">
                  <IonButton
                    className="passager-config-delete-buttons"
                    color="danger"
                    expand="full"
                    onClick={() =>
                      handleDelete(modalDeletePassagerInfo.id, modalDeletePassagerInfo.route)
                    }
                  >
                    EXCLUIR
                  </IonButton>
                  <IonButton
                    className="passager-config-delete-buttons"
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

      <IonModal isOpen={modalShow}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Adicionar</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setModalShow(false)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {modalInfo.type == "boarding" ? "Ponto de embarque" : " Ponto de desembarque"}
          {modalInfo.data && modalInfo.data.length == 0 ? (
            <div id="route-config-point-empty">VAZIO</div>
          ) : (
            ""
          )}
          {modalInfo.data ? (
            <IonList>
              {modalInfo.data.map((item) => (
                <IonCard
                  key={item.name}
                  color="light"
                  className="passager-config-card-container"
                  onClick={() => routeAddItem(modalInfo.type, item.id)}
                >
                  <div className="passager-config-home">
                    <div>
                      <IonCardHeader class="passager-config-home-card-header">
                        <IonIcon icon={locationOutline} size="large"></IonIcon>
                        <IonCardTitle>{item.name}</IonCardTitle>
                      </IonCardHeader>
                    </div>
                  </div>
                </IonCard>
              ))}
            </IonList>
          ) : (
            <div id="route-config-loading">
              <img src={loading}></img>
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export { RoutePassagerConfig };
