import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonMenuButton,
  IonPage,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";

import { GoogleMap } from "@capacitor/google-maps";

import "./splash.css";
import { useStorage } from "../../hooks/useStorage";

const Splash: React.FC = () => {
  const { loginToken } = useStorage();

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonTitle>
          <IonImg src="./src/img/logo.jpg"></IonImg>
        </IonTitle>
      </IonContent>
    </IonPage>
  );
};

export { Splash };
