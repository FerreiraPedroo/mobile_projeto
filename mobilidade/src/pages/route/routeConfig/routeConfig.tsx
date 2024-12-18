import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ContextAppInfo } from "../../../services/context/context";

import { add, locationOutline, personOutline, trashSharp } from "ionicons/icons";

import loading from "../../../assets/img/loading.gif";

import "./routeConfig.css";
import { UserConfig } from "../../../components/userConfig/userConfig";

interface RouteConfig {
  id: number;
  name: string;
  photo: string;
  boardingPoints: {
    id: number;
    name: string;
  }[];
  landingPoints: {
    id: number;
    name: string;
  }[];
  passagers: {
    id: number;
    name: string;
  }[];
}
interface RouteConfigParams
  extends RouteComponentProps<{
    routeId: string;
  }> {}
interface ModalInfoInterface {
  type: string;
  route: string;
  data: null | [{ id: number; name: string }] | [];
}
interface ModalDeleteInfoInterface {
  type: string;
  typeName: string;
  route: string;
  data: null | { id: number; name: string };
}
interface CalendarConfig {
  route: string;
  data: string;
}

const RouteConfig: React.FC<RouteConfigParams> = ({ match }) => {
  const router = useIonRouter();
  const { userInfo, updatePage, setUpdatePage } = useContext(ContextAppInfo);

  const [modalDeleteInfo, setModalDeleteInfo] = useState<ModalDeleteInfoInterface>({
    type: "",
    typeName: "",
    route: "",
    data: null,
  });
  const [modalInfo, setModalInfo] = useState<ModalInfoInterface>({
    type: "",
    route: "",
    data: null,
  });
  const [modalCalendarInfo, setModalCalendarInfo] = useState<CalendarConfig | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteConfig | null>(null);

  const [addCalendarModalShow, setAddCalendarModalShow] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [routeCalendar, setRouteCalendar] = useState([]);
  const [actualDate, setActualDate] = useState<string>("");

  const [showCalendarButtons, setShowCalendarButtons] = useState(false);

  async function openCalendarAddModal(routeParam: string, data: string) {
    const adjustedDate = data.split("T")[0].split("-").reverse().join("-");

    setModalCalendarInfo({ route: routeParam, data: adjustedDate });
    setAddCalendarModalShow(true);
  }
  async function openAddModal(itemType: string, routeParam: string) {
    setModalShow(true);
    setModalInfo({ type: itemType, route: routeParam, data: null });

    try {
      const response = await fetch(
        `http://127.0.0.1:3000/${routeParam}/${userInfo.userId}/${match.params.routeId}/${itemType}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const listReturn = await response.json();

      if (listReturn.codStatus == 200) {
        setModalInfo({ type: itemType, route: routeParam, data: listReturn.data });
      }
    } catch (error) {
      setModalInfo({ type: "", route: "", data: [] });
    }
  }
  async function openDeleteModal(
    type: string,
    typeName: string,
    itemID: number,
    itemName: string,
    routeParam: string
  ) {
    setModalDeleteShow(true);
    setModalDeleteInfo({ type, typeName, route: routeParam, data: { id: itemID, name: itemName } });
  }

  async function routeAddNewItem(routeParam: string, data: string) {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/${routeParam}/${match.params.routeId}/${data}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const addReturn = await response.json();

      if (addReturn.codStatus == 200) {
        setModalShow(false);
        setAddCalendarModalShow(false);
        setUpdatePage((prev) => !prev);
      }
    } catch (error) {}
  }
  async function routeAddItem(typeParam: string, routeParam: string, itemID: number) {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/${routeParam}/${match.params.routeId}/${itemID}/${typeParam}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const addReturn = await response.json();

      if (addReturn.codStatus == 200) {
        setModalShow(false);
        setUpdatePage((prev) => !prev);
      }
    } catch (error) {}
  }
  async function routeItemDelete(type: string, itemID: number, routeParam: string) {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/${routeParam}/${match.params.routeId}/${itemID}/${type}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const deleteReturn = await response.json();

      if (deleteReturn.codStatus == 200) {
        setModalDeleteShow(false);
        setUpdatePage((prev) => !prev);
        if (type == "route") {
          router.push("/routes");
        }
      }
    } catch (error) {}
  }
  const getRouteCalendar = useCallback(async (routeId: string, year: number, month: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/route/calendar/${routeId}/${year}/${month}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const routeDataReturn = await response.json();

      if (routeDataReturn.codStatus == 200) {
        const statusDays = routeDataReturn.data.map((status: any) => {
          return {
            id: status.id,
            date: status.date.split("T")[0],
            textColor: "#09721b",
            backgroundColor: "#c8e5d0",
          };
        });

        setRouteCalendar(statusDays);

        const newDate = new Date().toISOString().split("T")[0];
        const findDate = statusDays.find((day: any) => day.date == newDate);

        if (findDate) {
          setShowCalendarButtons(false);
        } else {
          setShowCalendarButtons(true);
        }
      } else {
        throw "Erro";
      }
    } catch (error) {
      setRouteCalendar([]);
    }
  }, []);

  useEffect(() => {
    async function getRoute(routeId: string) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/route-config/${routeId}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const routeDataReturn = await response.json();

        if (routeDataReturn.codStatus == 200) {
          setRouteInfo(routeDataReturn.data);
        } else {
          throw "Erro";
        }
      } catch (error) {
        setRouteInfo(null);
      }
    }

    getRoute(match.params.routeId);

    const monthActual = new Date().getMonth();

    getRouteCalendar(match.params.routeId, 2024, monthActual);
  }, [userInfo, updatePage]);

  const handleDateChange = (event: any) => {
    const date = event.detail.value;
    const findDate = routeCalendar.find((day: any) => day.date == date.split("T")[0]);

    if (findDate) {
      setShowCalendarButtons(true);
    } else if (showCalendarButtons) {
      setShowCalendarButtons(false);
    }
    setActualDate(date);
  };

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

      {routeInfo ? (
        <IonContent fullscreen>
          <IonItem id="route-config-route">Configuração da rota</IonItem>
          <div id="route-config-name-box">
            <p id="route-config-name">{routeInfo.name}</p>
            <IonButton
              color="danger"
              className="route-config-button-trash"
              onClick={() =>
                openDeleteModal("route", "Rota", userInfo.userId!, routeInfo.name, "route")
              }
            >
              <IonIcon icon={trashSharp}></IonIcon>
            </IonButton>
          </div>

          <IonAccordionGroup className="route-config-calendar-accordion">
            <IonAccordion toggle-icon-slot="start" value="first">
              <IonItem className="route-config-calendar-head" slot="header" color="light">
                <IonLabel>Calendário</IonLabel>
              </IonItem>
              <div slot="content">
                <IonDatetime
                  presentation="date"
                  onIonChange={handleDateChange}
                  locale="pt-BR"
                  // value={String(new Date().toISOString())}
                  size="cover"
                  highlightedDates={routeCalendar}
                ></IonDatetime>
                <div id="route-config-calendar-buttons">
                  {showCalendarButtons ? (
                    <IonButton
                      disabled={!actualDate}
                      color="danger"
                      onClick={() => {
                        const findDate: any = routeCalendar.find(
                          (day: any) => day.date == actualDate.split("T")[0]
                        );

                        openDeleteModal(
                          "type",
                          "O dia da rota",
                          findDate!.id,
                          actualDate.split("T")[0].split("-").reverse().join("-"),
                          "calendar-remove"
                        );
                      }}
                    >
                      REMOVER
                    </IonButton>
                  ) : (
                    ""
                  )}

                  <IonButton
                    disabled={!actualDate || showCalendarButtons}
                    color="primary"
                    onClick={() => openCalendarAddModal("calendar-add", actualDate)}
                  >
                    ADICIONAR
                  </IonButton>
                </div>
              </div>
              <div id="route-config-list-days" slot="content"></div>
            </IonAccordion>

            <IonAccordion toggle-icon-slot="start" value="second">
              <IonItem className="route-config-calendar-head" slot="header" color="light">
                <IonLabel>Passageiros</IonLabel>
              </IonItem>
              <div slot="content">
                <IonItem slot="header" color="light">
                  <IonFabButton
                    id="open-modal"
                    size="small"
                    onClick={() => openAddModal("passager", "passager")}
                  >
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>

                  <IonLabel>Adicionar</IonLabel>
                </IonItem>
                {routeInfo &&
                  routeInfo.passagers.map((passager) => (
                    <IonCard
                      key={passager.name}
                      color="light"
                      className="route-confg-card-container"
                      onClick={() =>
                        router.push(`/route-config/${match.params.routeId}/${passager.id}`)
                      }
                    >
                      <div className="route-config">
                        <IonCardHeader class="route-config-card-header">
                          <IonIcon
                            icon={personOutline}
                            className={"route-config-icon"}
                            size="large"
                          ></IonIcon>
                          <IonCardTitle class="route-config-card-header-name">{passager.name}</IonCardTitle>
                        </IonCardHeader>
                      </div>
                    </IonCard>
                  ))}
              </div>
            </IonAccordion>
          </IonAccordionGroup>

          <IonModal isOpen={addCalendarModalShow} initialBreakpoint={0.5} breakpoints={[0.5]}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Adicionar</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setAddCalendarModalShow(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              {modalCalendarInfo && (
                <div className="route-config-delete-modal">
                  <p>
                    Adicionar a rota neste dia:
                    <br />
                    <br />
                  </p>
                  <div className="route-config-delete-item-name">{modalCalendarInfo.data}</div>
                  <br />
                  <div className="route-config-delete-modal-buttons">
                    <IonButton
                      color="primary"
                      expand="full"
                      onClick={() =>
                        routeAddNewItem(modalCalendarInfo.route, modalCalendarInfo.data)
                      }
                    >
                      ADICIONAR
                    </IonButton>
                    <IonButton
                      color="medium"
                      expand="full"
                      onClick={() => setAddCalendarModalShow(false)}
                    >
                      VOLTAR
                    </IonButton>
                  </div>
                </div>
              )}
            </IonContent>
          </IonModal>

          <IonModal isOpen={modalShow}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Adicionar</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setModalShow(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              {modalInfo.data && modalInfo.data.length == 0 ? (
                <div id="route-config-point-empty">Nenhum passageiro</div>
              ) : (
                ""
              )}
              {modalInfo.data ? (
                <IonList>
                  {modalInfo.data.map((item) => (
                    <IonItem key={item.name}>
                      <IonAvatar
                        slot="start"
                        onClick={() => routeAddItem(modalInfo.type, modalInfo.route, item.id)}
                      >
                        <IonIcon
                          icon={modalInfo.type == "passager" ? personOutline : locationOutline}
                          className="route-config-icon"
                          size="large"
                        ></IonIcon>
                      </IonAvatar>
                      <IonLabel>
                        <h2>{item.name}</h2>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              ) : (
                <div id="route-config-loading">
                  <img src={loading}></img>
                </div>
              )}
            </IonContent>
          </IonModal>

          <IonModal
            isOpen={modalDeleteShow}
            initialBreakpoint={0.5}
            breakpoints={[0.5]}
            onWillDismiss={() => setModalDeleteShow(false)}
          >
            {modalDeleteInfo && modalDeleteInfo.data ? (
              <div className="route-config-delete-modal">
                <p>
                  Deseja realmente excluir
                  <br />
                  <span>{modalDeleteInfo.typeName}</span>
                </p>
                <div className="route-config-delete-item-name">{modalDeleteInfo.data.name}</div>
                <div className="route-config-delete-modal-buttons">
                  <IonButton
                    className="route-config-delete-buttons"
                    color="danger"
                    expand="full"
                    onClick={() =>
                      routeItemDelete(
                        modalDeleteInfo.type,
                        modalDeleteInfo.data!.id,
                        modalDeleteInfo.route
                      )
                    }
                  >
                    EXCLUIR
                  </IonButton>
                  <IonButton
                    className="route-config-delete-buttons"
                    color="medium"
                    expand="full"
                    onClick={() => setModalDeleteShow(false)}
                  >
                    VOLTAR
                  </IonButton>
                </div>
              </div>
            ) : (
              ""
            )}
          </IonModal>
        </IonContent>
      ) : (
        <div id="route-config-loading">
          <img src={loading}></img>
        </div>
      )}
    </IonPage>
  );
};

export { RouteConfig };
