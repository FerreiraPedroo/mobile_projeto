import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';


const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>

      </IonContent>
    </IonPage>
  );
};

export default Home;
