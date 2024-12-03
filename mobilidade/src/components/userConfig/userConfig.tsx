import { IonIcon, IonItem } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

import "./userConfig.css";

function UserConfig() {
  return (
    <IonItem routerLink={"user"} routerDirection="none" lines="none" detail={false}>
      <IonIcon
        className={
          location.pathname == "/user" ? "user-config-button selected" : "user-config-button"
        }
        aria-hidden="true"
        icon={personCircleOutline}
        size="large"
      />
    </IonItem>
  );
}

export { UserConfig };
