import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenuButton,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";

import { ContextAppInfo } from "../../../services/context/context";
import { UserConfig } from "../../../components/userConfig/userConfig";
import { add, personOutline } from "ionicons/icons";
import "./passagerList.css";

interface Passager {
  id: number;
  name: string;
  photo: string;
  passagerAmount: number;
}

const RespPassagerList: React.FC = () => {
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  const [passagerList, setPassagerList] = useState<Passager[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [passagerName, setPassagerName] = useState<string | number>("");

  async function createPassager() {
    try {
      const response = await fetch(`http://127.0.0.1:3000/resp-passager`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ passagerName, userId: userInfo.userId }),
        headers: { "Content-Type": "application/json" },
      });

      const listReturn = await response.json();

      if (listReturn.codStatus == 200) {
        setModalShow(false);
        setPassagerName("");
        setUpdatePage((prev) => !prev);
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (userInfo.userId) {
      async function getPassagers(userId: number) {
        try {
          const response = await fetch(`http://127.0.0.1:3000/resp-passager-list/${userId}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const passagerDataReturn = await response.json();
          if (passagerDataReturn.codStatus == 200) {
            setPassagerList(passagerDataReturn.data);
            return;
          }

          throw "Erro";
        } catch (error) {
          setPassagerList([]);
        }
      }

      getPassagers(userInfo.userId);
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
          <p>Passageiros</p>
          <IonFabButton
            id="resp-passager-list-add-passager-icon"
            size="small"
            onClick={() => setModalShow(true)}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonItem>

        <div id="resp-passager-container">
          {passagerList.map((passager, key) => {
            return (
              <IonCard key={key} color="light" routerLink={`/resp-passager-config/${passager.id}`}>
                <IonCardHeader class="resp-passager-card-header">
                  <IonIcon icon={personOutline} size="large"></IonIcon>
                  <IonCardTitle>{passager.name}</IonCardTitle>
                </IonCardHeader>

                {/* <IonCardContent className="passager-card-point">
                  <div>Passageiros: {passager.passagerAmount}</div>
                </IonCardContent> */}
              </IonCard>
            );
          })}
        </div>

        <IonModal
          isOpen={modalShow}
          initialBreakpoint={0.5}
          breakpoints={[0.5]}
          onWillDismiss={() => {
            setModalShow(false);
            setPassagerName("");
          }}
        >
          <div className="resp-passager-config-add-modal">
            <p>Digite o nome do passageiro:</p>
            <input
              id="resp-passager-config-input-name"
              type="text"
              name="passagerName"
              value={passagerName}
              onChange={(e) => setPassagerName(e.target.value!)}
            />
            <div className="resp-passager-config-add-modal-buttons">
              <IonButton
                className="point-config-add-buttons"
                color="primary"
                expand="full"
                onClick={() => createPassager()}
                disabled={!passagerName}
              >
                ADICIONAR
              </IonButton>
              <IonButton
                className="point-config-add-buttons"
                color="medium"
                expand="full"
                onClick={() => setModalShow(false)}
              >
                VOLTAR
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export { RespPassagerList };
