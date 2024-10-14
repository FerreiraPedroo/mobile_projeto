import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ContextAppInfo } from '../services/context/context';

import { homeOutline, locationOutline, manOutline, mapOutline } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appDriverPages: AppPage[] = [
  {
    title: 'Inicio',
    url: '/home',
    iosIcon: homeOutline,
    mdIcon: homeOutline
  },
  {
    title: 'Rotas',
    url: '/routes',
    iosIcon: mapOutline,
    mdIcon: mapOutline
  },
  {
    title: 'Pontos de parada',
    url: '/landing-point',
    iosIcon: locationOutline,
    mdIcon: locationOutline
  },
  {
    title: 'Responsável',
    url: '/responsable',
    iosIcon: manOutline,
    mdIcon: manOutline
  }
];

const appResponsablePages: AppPage[] = [
  {
    title: 'Inicio',
    url: '/resp-home',
    iosIcon: homeOutline,
    mdIcon: homeOutline
  },
  {
    title: 'Passageiros',
    url: '/resp-passagers',
    iosIcon: manOutline,
    mdIcon: manOutline
  }
];

const Menu: React.FC = () => {
  const location = useLocation();
  const { userInfo } = useContext(ContextAppInfo);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Mobil</IonListHeader>
          <IonNote></IonNote>

          {userInfo.type == "driver" && appDriverPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}

          {userInfo.type == "responsable" && appResponsablePages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}

        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
