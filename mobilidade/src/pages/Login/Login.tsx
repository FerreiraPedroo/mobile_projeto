import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonImg, IonInput, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';

import './Login.css';

const Login: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>

      <IonContent fullscreen>

        <div id='box-header'>
          <IonImg src="./src/assets/img/mobil-icon.png" />
          <IonTitle>Mobil</IonTitle>
        </div>


        <div id="container">
          <div className="box-input">
            <strong>USUÁRIO</strong>
            <IonInput />
          </div>
          <div className="box-input">
            <strong>SENHA</strong>
            <IonInput type='password' />
          </div>
          <div className="box-input">
            <IonButton color={'primary'} title='ENTRAR'>ENTRAR</IonButton>
          </div>
        </div>
        
      </IonContent>

      <IonFooter>
        <p>@Mobil 2024</p>
      </IonFooter>
    </IonPage>
  );
};

export { Login };
