import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
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
  }> {}

const RouteHome: React.FC<RouteHomeParams> = ({ match }) => {
  const [routeInfo, setRouteInfo] = useState<RouteHome | null>({
    id: 1,
    name: "Rota da putaria",
    photo: "default.png",
    boarding_point: 2,
    landing_point: 2,
    passagers: 10,
  });
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  useEffect(() => {
    setPresentingElement(page.current);

    const getRoute = async (_id: string) => {};
    const routeData = getRoute(match.params.routeId);
  }, []);

  return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{"Mobil"}</IonTitle>
          <IonButton id="open-modal" expand="block">
            Open
          </IonButton>
        </IonToolbar>
      </IonHeader>

      {routeInfo ? (
        <IonContent fullscreen>
          <IonItem>
            <p>Rota</p>
          </IonItem>
          <p id="route-home-name">{routeInfo.name}</p>

          <div id="route-home-container">
            <div id="route-home-boarding">
              <IonAccordionGroup expand="inset" mode={"md"}>
                <IonAccordion value="first">
                  <IonItem slot="header" color="light">
                    <IonLabel>First Accordion</IonLabel>
                  </IonItem>
                  <div className="roite-home " slot="content">
                    <IonFab>
                      <IonFabButton>
                        <IonIcon icon={add}></IonIcon>
                      </IonFabButton>
                    </IonFab>
                  </div>
                  <div className="ion-padding" slot="content">
                    First Content
                  </div>
                </IonAccordion>
                <IonAccordion value="second">
                  <IonItem slot="header" color="light">
                    <IonLabel>Second Accordion</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    Second Content
                  </div>
                </IonAccordion>
                <IonAccordion value="third">
                  <IonItem slot="header" color="light">
                    <IonLabel>Third Accordion</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    Third Content
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            </div>
          </div>

          <IonModal ref={modal} trigger="open-modal" presentingElement={presentingElement!}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Adicionar ponto</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => dismiss()}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonList>
                <IonItem>
                  <IonAvatar slot="start">
                    <IonImg src="https://i.pravatar.cc/300?u=b" />
                  </IonAvatar>
                  <IonLabel>
                    <h2>Connor Smith</h2>
                    <p>Sales Rep</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonAvatar slot="start">
                    <IonImg src="https://i.pravatar.cc/300?u=a" />
                  </IonAvatar>
                  <IonLabel>
                    <h2>Daniel Smith</h2>
                    <p>Product Designer</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonAvatar slot="start">
                    <IonImg src="https://i.pravatar.cc/300?u=d" />
                  </IonAvatar>
                  <IonLabel>
                    <h2>Greg Smith</h2>
                    <p>Director of Operations</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonAvatar slot="start">
                    <IonImg src="https://i.pravatar.cc/300?u=e" />
                  </IonAvatar>
                  <IonLabel>
                    <h2>Zoey Smith</h2>
                    <p>CEO</p>
                  </IonLabel>
                </IonItem>
              </IonList>
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
