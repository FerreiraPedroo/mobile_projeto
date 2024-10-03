import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useContext, useEffect, useState } from "react";
import { ContextAppInfo } from "../../../services/context/context";

import { add, locationOutline, personCircleOutline, trashSharp } from "ionicons/icons";

import loading from "../../../assets/img/loading.gif";
import routePoint from "../../../assets/img/point.png";

import "./routeConfig.css";
import { OverlayEventDetail } from "@ionic/core";


interface RouteConfig {
  id: number;
  name: string;
  photo: string;
  boardingPoints: {
    id: number,
    name: string
  }[];
  landingPoints: {
    id: number,
    name: string
  }[];
  passagers: {
    id: number,
    name: string
  }[];
}

interface RouteConfigParams
  extends RouteComponentProps<{
    routeId: string;
  }> { }

interface ModalInfoInterface {
  type: string;
  route: string;
  data: null | [{ id: number, name: string }] | []
}

interface ModalDeleteInfoInterface {
  type: string;
  typeName: string;
  route: string;
  data: null | { id: number, name: string }
}

const RouteConfig: React.FC<RouteConfigParams> = ({ match }) => {
  const [modalDeleteInfo, setModalDeleteInfo] = useState<ModalDeleteInfoInterface>({ type: "", typeName: "", route: "", data: null });
  const [modalInfo, setModalInfo] = useState<ModalInfoInterface>({ type: "", route: "", data: null });
  const [routeInfo, setRouteInfo] = useState<RouteConfig | null>(null);

  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  async function openAddModal(itemType: string, routeParam: string) {
    setModalShow(true)
    setModalInfo({ type: itemType, route: routeParam, data: null });

    try {
      const response = await fetch(`http://localhost:3000/${routeParam}/${userInfo.userId}/${match.params.routeId}/${itemType}`, {
        method: "GET",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const listReturn = await response.json();

      if (listReturn.codStatus == 200) {
        setModalInfo({ type: itemType, route: routeParam, data: listReturn.data })
      }

    } catch (error) {
      setModalInfo({ type: "", route: "", data: [] })
    }
  }
  async function openDeleteModal(type: string, typeName: string, itemID: number, itemName: string, routeParam: string) {
    setModalDeleteShow(true)
    setModalDeleteInfo({ type, typeName, route: routeParam, data: { id: itemID, name: itemName } })
  }
  async function routeAddItem(typeParam: string, routeParam: string, itemID: number) {
    try {
      const response = await fetch(`http://localhost:3000/${routeParam}/${match.params.routeId}/${itemID}/${typeParam}`, {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const addReturn = await response.json();

      if (addReturn.codStatus == 200) {
        setModalShow(false);
        setUpdatePage((prev) => !prev)
      }

    } catch (error) {

    }
  }
  async function routeItemDelete(type: string, itemID: number, routeParam: string) {
    try {
      const response = await fetch(`http://localhost:3000/${routeParam}/${match.params.routeId}/${itemID}/${type}`, {
        method: "DELETE",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const deleteReturn = await response.json();

      if (deleteReturn.codStatus == 200) {
        console.log({ deleteReturn })
        setModalDeleteShow(false);
        setUpdatePage((prev) => !prev)
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    async function getRoute(routeId: string) {

      try {
        const response = await fetch(`http://localhost:3000/route/${routeId}`, {
          method: "GET",
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const routeDataReturn = await response.json();

        if (routeDataReturn.codStatus == 200) {
          setRouteInfo(routeDataReturn.data)
        } else {
          throw "Erro";
        }

      } catch (error) {
        setRouteInfo(null)
      }
    };

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
        </IonToolbar>
      </IonHeader>

      {routeInfo ? (
        <IonContent fullscreen>
          <IonItem id="route-config-route">
            Rota
          </IonItem>
          <div id="route-config-name-box">
            <p id="route-config-name">{routeInfo.name}</p>
            <IonButton color="danger" className="route-config-button-trash" onClick={() => openDeleteModal("route", "Rota", userInfo.userId!, routeInfo.name, "route")}>
              <IonIcon icon={trashSharp}></IonIcon>
            </IonButton>
          </div>
          <div id="route-config-container">
            <IonAccordionGroup expand="inset" mode={"md"}>
              <IonAccordion value="first">
                <IonItem slot="header" color="light">
                  <IonLabel>Pontos de embarque</IonLabel>
                </IonItem>
                <div className="route-config-list-point" slot="content">
                  <IonFabButton id="open-modal" size="small" onClick={() => openAddModal("boarding", "point")}>
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </div>
                {routeInfo && routeInfo.boardingPoints.map((point) => (
                  <div key={point.id} className="route-config-point" slot="content">
                    <IonIcon icon={locationOutline} className={"route-config-icon"} size="large"></IonIcon>
                    <p className="route-config-point-name">{point.name}</p>
                    <div className="route-config-point-delete">
                      <IonButton color="danger" className="route-config-button-trash" onClick={() => openDeleteModal("boarding", "Ponto de embarque", point.id, point.name, "point")}>
                        <IonIcon icon={trashSharp}></IonIcon>
                      </IonButton>
                    </div>
                  </div>
                ))}
              </IonAccordion>
              <IonAccordion value="second">
                <IonItem slot="header" color="light">
                  <IonLabel>Pontos de desembarque</IonLabel>
                </IonItem>
                <div className="route-config-list-point " slot="content">
                  <IonFabButton id="open-modal" size="small" onClick={() => openAddModal("landing", "point")}>
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </div>
                {routeInfo && routeInfo.landingPoints.map((point) => (
                  <div key={point.id} className="route-config-point" slot="content">
                    <IonIcon icon={locationOutline} className={"route-config-icon"} size="large"></IonIcon>
                    <p className="route-config-point-name">{point.name}</p>
                    <div className="route-config-point-delete">
                      <IonButton color="danger" className="route-config-button-trash" onClick={() => openDeleteModal("landing", "Ponto de desembarque", point.id, point.name, "point")}>
                        <IonIcon icon={trashSharp}></IonIcon>
                      </IonButton>
                    </div>
                  </div>
                ))}
              </IonAccordion>
              <IonAccordion value="third">
                <IonItem slot="header" color="light">
                  <IonLabel>Passageiros</IonLabel>
                </IonItem>
                <div className="route-config-add-point" slot="content">
                  <IonFabButton id="open-modal" size="small" onClick={() => openAddModal("passager", "passager")}>
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </div>
                {routeInfo && routeInfo.passagers.map((point) => (
                  <div key={point.id} className="route-config-point" slot="content">
                    <IonIcon icon={personCircleOutline} className={"route-config-icon"} size="large"></IonIcon>
                    <p className="route-config-point-name">{point.name}</p>
                    <div className="route-config-point-delete">
                      <IonButton color="danger" className="route-config-button-trash" onClick={() => openDeleteModal("passager", "Passageiro", point.id, point.name, "passager")}>
                        <IonIcon icon={trashSharp}></IonIcon>
                      </IonButton>
                    </div>
                  </div>
                ))}
              </IonAccordion>
            </IonAccordionGroup>
          </div>

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
              {modalInfo.data && modalInfo.data.length == 0 ? <div id='route-config-point-empty'>VAZIO</div> : ""}
              {modalInfo.data ?
                <IonList>
                  {modalInfo.data.map((item) => (
                    <IonItem key={item.name}>
                      <IonAvatar slot="start" onClick={() => routeAddItem(modalInfo.type, modalInfo.route, item.id)}>
                        <IonImg src={routePoint} />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{item.name}</h2>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
                : <div id="route-config-loading">
                  <img src={loading}></img>
                </div>
              }
            </IonContent>
          </IonModal>

          <IonModal isOpen={modalDeleteShow} initialBreakpoint={.50} breakpoints={[.50]} onWillDismiss={() => setModalDeleteShow(false)}>
            {modalDeleteInfo && modalDeleteInfo.data ?
              <div className="route-config-delete-modal">
                <p>Deseja realmente excluir<br /><span>{modalDeleteInfo.typeName}</span></p>
                <div className="route-config-delete-item-name">{modalDeleteInfo.data.name}</div>
                <div className="route-config-delete-modal-buttons">
                  <IonButton color="danger" expand="full" onClick={() => routeItemDelete(modalDeleteInfo.type, modalDeleteInfo.data!.id, modalDeleteInfo.route)}>EXCLUIR</IonButton>
                  <IonButton color="medium" expand="full" onClick={() => setModalDeleteShow(false)}>VOLTAR</IonButton>
                </div>
              </div>
              : ""}
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

export { RouteConfig };
