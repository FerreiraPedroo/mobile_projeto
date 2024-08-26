import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import "./Page.css";

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const dateActual = new Date();

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

      <IonContent fullscreen>
        <div id="day-container">{dateActual.toLocaleDateString('pt-BR',  {  weekday: 'long',  year: 'numeric',  month: 'long',  day: 'numeric'})} - {dateActual.toLocaleTimeString()} </div>
      </IonContent>
    </IonPage>
  );
};

export default Page;
