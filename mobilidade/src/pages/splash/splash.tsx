import {
  IonContent,
  IonPage,
  useIonRouter,
} from "@ionic/react";

import { useStorage } from "../../hooks/useStorage";

import "./splash.css";
import { useEffect } from "react";

const Splash: React.FC = () => {
  
  const router = useIonRouter();

  const { loginToken } = useStorage();

  useEffect(()=>{
    const checkLogin = async () => {
      if(!loginToken){
        router.push("/login","root","replace")
      }else {
        console.log("OK",{loginToken})

      }
    }
    checkLogin()
  },[])

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
