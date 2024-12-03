import {
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext } from "react";

import { ContextAppInfo } from "../../services/context/context";

import "./user.css";
import { UserConfig } from "../../components/userConfig/userConfig";
import { personCircleOutline } from "ionicons/icons";

const User: React.FC = () => {
  const { userInfo } = useContext(ContextAppInfo);

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

      <IonItem id="user-id">
        <p>Usuário</p>
        <div>ID: {userInfo.userId}</div>
      </IonItem>

      <div id="user-info-box">
        <IonImg src={personCircleOutline} id="user-img"></IonImg>
      </div>

      <div className="user-label-info">Nome</div>
      <IonItem>
        <h2>{userInfo.userName}</h2>
      </IonItem>
      <div className="user-label-info2">Categoria</div>
      <IonItem>
        <h2>{userInfo.type == "driver" ? "Motorista" : "Responsábel"}</h2>
      </IonItem>

      <IonContent></IonContent>
    </IonPage>
  );
};

export { User };
