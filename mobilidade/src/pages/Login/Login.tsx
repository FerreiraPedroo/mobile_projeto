import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { ContextAppInfo } from "../../services/context/context";
import { IonButton, IonContent, IonFooter, IonPage, IonText } from "@ionic/react";

import "./login.css";

const Login: React.FC = () => {
  const router = useIonRouter();
  const { userInfo, changeUserInfo } = useContext(ContextAppInfo);

  const [login, setLogin] = useState({ user: "", password: "" });
  const [loginError, setLoginError] = useState({
    user: "",
    datauser: "",
    password: "",
    datapassword: "",
    error: "",
  });

  const handleInput = (e: any) => {
    const errorClean = { [e.target.name]: "", ["data" + e.target.name]: "", error: "" };

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

  async function handleSubmit() {
    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          user: login.user,
          password: login.password,
        }),
      });

      const loginDataReturn = await response.json();

      if (loginDataReturn.codStatus == 200) {
        await changeUserInfo({
          userId: loginDataReturn.data.userId,
          userName: loginDataReturn.data.userName,
          token: loginDataReturn.data.token,
          type: loginDataReturn.data.type,
        });
      } else {
        await changeUserInfo({ userId: null, userName: null, token: null });
        setLoginError((prev) => {
          return { ...prev, error: "Erro ao conectar, tente novamente." };
        });
      }
    } catch (error) {
      setLoginError((prev) => {
        return { ...prev, error: "Erro ao conectar, tente novamente." };
      });
    }
  }

  useLayoutEffect(() => {
    if (userInfo.token != null) {
      async function checkToken() {
        try {
          const response = await fetch(`http://127.0.0.1:3000/check-login`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ token: userInfo.token }),
          });

          const loginDataReturn = await response.json();

          if (loginDataReturn.codStatus == 200) {
            if (userInfo.type == "driver") {
              router.push("/home");
            }
            if (userInfo.type == "responsable") {
              router.push("/resp-home");
            }
          } else {
            await changeUserInfo({ userId: null, userName: null, token: null });
            setLoginError((prev) => {
              return { ...prev, error: "Erro ao conectar, tente novamente." };
            });
          }
        } catch (error) {
          setLoginError((prev) => {
            return { ...prev, error: "Erro ao conectar, tente novamente." };
          });
        }
      }
      checkToken();
    }
  }, [userInfo]);

  return (
    <IonPage>
      <div className="content">
        <div id="branding-container">
          <img id="login-img" src="./src/assets/img/logo.jpg" />
          <IonText></IonText>
          <p id="login-title">Mobil</p>
        </div>

        <div id="form-container">
          <div className="box-input">
            <p className="input-label">Email</p>
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
          <div id="erro-div">{loginError.error}</div>
        </div>

        <div id="action-container">
          <div className="box-input">
            <IonButton id="button-text" color={"primary"} title="ENTRAR" onClick={handleSubmit}>
              ENTRAR
            </IonButton>
          </div>
        </div>
        
        <div id="register-box">
          <IonText class="register-text">
            Não tem registro?
          </IonText>
          <IonText class="register-text-2" onClick={() => router.push("/register")} >
            Registre aqui
          </IonText>

          <IonFooter>
            <h3>@Mobil 2024</h3>
          </IonFooter>
        </div>
      </div>


    </IonPage>
  );
};

export { Login };
