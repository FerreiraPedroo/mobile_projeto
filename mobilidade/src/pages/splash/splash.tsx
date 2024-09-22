import {
  IonContent,
  IonPage,
  useIonRouter,
} from "@ionic/react";

import { useContext, useEffect } from "react";
import { ContextAppInfo } from "../../services/context/context";

import "./splash.css";

const Splash: React.FC = () => {
  const { userInfo } = useContext(ContextAppInfo);
  const router = useIonRouter();

  useEffect(() => {
    if (userInfo.token != null) {
      async function checkToken() {
        try {
          const response = await fetch(`http://localhost:3000/check-login`, {
            method: "POST",
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ token: userInfo.token })
          });

          const loginDataReturn = await response.json();
          if (loginDataReturn.codStatus == 200) {
            router.push("/home");
            return;
          }
        } catch (error) {
        }
      }
      checkToken()
    } else {
      router.push("/login");
    }

  }, [])

  return (
    <IonPage>
      <IonContent fullscreen>
        <div id="splash-box">
          <img id="splash-img" src="./src/assets/img/logo.jpg"></img>
        </div>
      </IonContent>
    </IonPage>
  );
};

export { Splash };
