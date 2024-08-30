import { IonButton, IonContent, IonFooter, IonImg, IonPage, IonText, IonTitle } from "@ionic/react";
import { useParams } from "react-router";

import "./login.css";
import { useState } from "react";

const Login: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const [login, setLogin] = useState({ user: "", password: "" });

  const [loginError, setLoginError] = useState({
    user: "",
    datauser: "",
    password: "",
    datapassword: "",
  });

  const handleInput = (e: any) => {
    const errorClean = { [e.target.name]: "", ["data" + e.target.name]: "" };

    if (!e.target.value && e.target.name == "user") {
      errorClean[e.target.name] = "O usuario não pode estar vazio.";
      errorClean["data" + e.target.name] = "erro";
    }

    if (!e.target.value && e.target.name == "password") {
      errorClean[e.target.name] = "A senha não pode estar vazio.";
      errorClean["data" + e.target.name] = "erro";
    }

    setLogin((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
    setLoginError((prev) => {
      return { ...prev, ...errorClean };
    });
  };

  const handleSubmit = () => { };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div id="branding-container">
          <img id="login-img" src="./src/assets/img/logo.jpg" />
          <IonText></IonText>
          <p id="login-title" >Mobil</p>
        </div>

        <div id="form-container">
          <div className="box-input">
            <p className="input-label">Usuário</p>
            <input
              type="text"
              name="user"
              data-error={loginError.datauser}
              onChange={(e) => handleInput(e)}
              value={login.user}
            />
            <div id="user-error-label-user">{loginError.user}</div>
          </div>

          <div className="box-input">
            <p className="input-label">Senha</p>
            <input
              type="password"
              name="password"
              data-error={loginError.datapassword}
              onChange={(e) => handleInput(e)}
              value={login.password}
            />
            <div id="user-error-label-password">{loginError.password}</div>
          </div>
        </div>

        <div id="action-container">
          <div className="box-input">
            <IonButton color={"primary"} title="ENTRAR" routerLink="/home">
              ENTRAR
            </IonButton>
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
