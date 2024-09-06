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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useEffect, useRef, useState } from "react";

import "./routeHome.css";
import loading from "../../../assets/img/loading.gif";
import { add } from "ionicons/icons";

interface RouteHome {
  id: number;
  name: string;
  photo: string;
  boarding_point: number;
  landing_point: number;
  passagers: number;
}
interface RouteHomeParams
  extends RouteComponentProps<{
    routeId: string;
  }> { }
interface ModalInfoInterface {
  type: string;
  data: null | [{ name: string }] | []
}

import routePoint from "../../../assets/img/point.png";

const RouteHome: React.FC<RouteHomeParams> = ({ match }) => {
  const [routeInfo, setRouteInfo] = useState<RouteHome | null>(null);
  const [modalInfo, setModalInfo] = useState<ModalInfoInterface>({ type: "", data: null });
  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function openAddModal(typeParam: string, routeParam: string) {
    setModalInfo({ type: typeParam, data: null });

    try {

      const response = await fetch(`http://localhost:3000/${routeParam}/${1}`, {
        method: "GET",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const pointListReturn = await response.json();

      if (pointListReturn.codStatus == "201")
        console.log(pointListReturn)
      setModalInfo(pointListReturn)

    } catch (error) {
      setModalInfo({ type: "", data: [] })
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
          return;
        }

        throw "Erro";
      } catch (error) {
        setRouteInfo(null)
      }
    };

    getRoute(match.params.routeId);

  }, []);

  return (
    <IonPage ref={page}>
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
          <IonItem>
            <p>Rota</p>
          </IonItem>
          <p id="route-home-name">{routeInfo.name}</p>

          <div id="route-home-container">
            <IonAccordionGroup expand="inset" mode={"md"}>
              <IonAccordion value="first">
                <IonItem slot="header" color="light">
                  <IonLabel>Pontos de embarque</IonLabel>
                </IonItem>
                <div className="route-home-add-point" slot="content">
                  <IonFabButton id="open-modal" size="small" onClick={() => openAddModal("boarding", "point-list")}>
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </div>
                <div className="ion-padding" slot="content">
                  First Content
                </div>
              </IonAccordion>
              <IonAccordion value="second">
                <IonItem slot="header" color="light">
                  <IonLabel>Pontos de desembarque</IonLabel>
                </IonItem>
                <div className="route-home-add-point" slot="content">
                  <IonFabButton id="open-modal" size="small" onClick={() => openAddModal("landing", "point-list")}>
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </div>
                <div className="ion-padding" slot="content">
                  Second Content
                </div>
              </IonAccordion>
              <IonAccordion value="third">
                <IonItem slot="header" color="light">
                  <IonLabel>Passageiros</IonLabel>
                </IonItem>
                <div className="route-home-add-point" slot="content">
                  <IonFabButton id="open-modal" size="small" onClick={() => openAddModal("passager", "passager-list")}>
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </div>
                <div className="ion-padding" slot="content">
                  Third Content
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </div>

          <IonModal ref={modal} trigger="open-modal" presentingElement={presentingElement!}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Adicionar</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => dismiss()}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              {modalInfo.data ?
                <IonList>
                  {modalInfo.data.map((item) => {
                    return (
                      <IonItem key={item.name}>
                        <IonAvatar slot="start">
                          <IonImg src={routePoint} />
                        </IonAvatar>
                        <IonLabel>
                          <h2>{item.name}</h2>
                          <p>Sales Rep</p>
                        </IonLabel>
                      </IonItem>
                    )
                  }
                  )}
                </IonList>

                : <div id="route-home-loading">
                  <img src={loading}></img>
                </div>}
            </IonContent>
          </IonModal>
        </IonContent>
      ) : (
        <div id="route-home-loading">
          <img src={loading}></img>
        </div>
      )}
    </IonPage>
  );
};

export { RouteHome };
