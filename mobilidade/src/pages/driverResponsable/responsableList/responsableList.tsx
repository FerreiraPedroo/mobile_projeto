import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonMenuButton,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useContext, useEffect, useState } from "react";
import { ContextAppInfo } from "../../../services/context/context";
import { add, man } from "ionicons/icons";

import "./responsableList.css";
import { UserConfig } from "../../../components/userConfig/userConfig";

interface Responsable {
  id: number;
  name: string;
  photo: string;
  passagerAmount: number;
}

const ResponsableList: React.FC = () => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  const [responsableList, setResponsableList] = useState<Responsable[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [userResponsable, setUserResponsable] = useState("");

  async function changeResponsable(e: any) {
    setUserResponsable(e.target.value);
  }

  async function addResponsable() {
    try {
      const response = await fetch(`http://127.0.0.1:3000/responsable-add`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ userResponsableId: userResponsable, driverId: userInfo.userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const routeDataReturn = await response.json();
      if (routeDataReturn.codStatus == 200) {
        setUpdatePage((prev) => !prev);
        setModalShow(false);
      }
      throw "Erro";
    } catch (error) {}
  }

  useEffect(() => {
    if (userInfo.userId) {
      async function getRoutes(userId: number) {
        try {
          const response = await fetch(`http://127.0.0.1:3000/responsable-list/${userId}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const routeDataReturn = await response.json();
          if (routeDataReturn.codStatus == 200) {
            setResponsableList(routeDataReturn.data);
            return;
          }

          throw "Erro";
        } catch (error) {
          setResponsableList([]);
        }
      }

      getRoutes(userInfo.userId);
    }
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

      <IonContent fullscreen>
        <IonItem>
          <p>Responsáveis</p>
          <IonFabButton
            id="route-list-add-route-icon"
            size="small"
            onClick={() => setModalShow(true)}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonItem>

        <div id="route-container">
          {responsableList.map((responsable, key) => {
            return (
              <IonCard key={key} color="light" routerLink={`/responsable/${responsable.id}`}>
                <IonCardHeader class="route-card-header">
                  <img className="route-photo" src={man}></img>
                  <IonCardTitle>{responsable.name}</IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="route-card-point">
                  <div>ID: {responsable.id}</div>
                  <div>Passageiros: {responsable.passagerAmount}</div>
                </IonCardContent>
              </IonCard>
            );
          })}
        </div>

        <IonModal
          isOpen={modalShow}
          initialBreakpoint={0.5}
          breakpoints={[0.5]}
          onWillDismiss={() => setModalShow(false)}
        >
          <div className="route-config-delete-modal">
            <div id="route-responsable-add">
              <div id="route-responsable-add-text">Digite o ID do responsável.</div>

              <input type="text" onChange={(e) => changeResponsable(e)} />
            </div>
            <div className="route-config-delete-modal-buttons">
              <IonButton
                color="medium"
                expand="full"
                disabled={!userResponsable}
                onClick={() => addResponsable()}
              >
                SALVAR
              </IonButton>
              <IonButton color="medium" expand="full" onClick={() => setModalShow(false)}>
                VOLTAR
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export { ResponsableList };
