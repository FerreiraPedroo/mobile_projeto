import { useContext, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { ContextAppInfo } from "../../services/context/context";
import { IonButton, IonContent, IonFooter, IonPage, IonText } from "@ionic/react";

import "./registerUser.css";

const Register: React.FC = () => {
  const router = useIonRouter();
  const { userInfo, changeUserInfo } = useContext(ContextAppInfo);

  const [register, setRegister] = useState({ user: "", password: "", name: "", userType: "" });
  const [registerError, setRegisterError] = useState({
    user: "",
    password: "",
    name: "",
    userType: "",
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

    if (!e.target.value && e.target.name == "name") {
      errorClean[e.target.name] = "O nome não pode estar vazio.";
      errorClean["data" + e.target.name] = "erro";
    }

    setRegister((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
    setRegisterError((prev) => {
      return { ...prev, ...errorClean };
    });
  };

  async function handleSubmit() {
    try {
      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          user: register.user,
          password: register.password,
          name: register.name,
          userType: register.userType
        }),
      });

      const registerDataReturn = await response.json();
      console.log({ registerDataReturn })

      if (registerDataReturn.codStatus == 200) {

      } else {

      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <IonPage>
      <IonContent fullscreen>
        <div id="branding-container">
          <img id="register-img" src="./src/assets/img/logo.jpg" />
          <p id="register-title">Mobil</p>
        </div>
          <p id="register-subtitle">DADOS PARA REGISTRO</p>

        <div id="form-container">

          <div className="box-input">
            <p className="input-label">Nome</p>
            <input
              type="text"
              name="name"
              data-error={registerError.name}
              onChange={(e) => handleInput(e)}
              value={register.name}
            />
            <div id="user-error-label-name">{registerError.name}</div>
          </div>

          <div className="box-input">
            <p className="input-label">Email</p>
            <input
              type="text"
              name="user"
              data-error={registerError.user}
              onChange={(e) => handleInput(e)}
              value={register.user}
            />
            <div id="user-error-label-user">{registerError.user}</div>
          </div>

          <div className="box-input">
            <p className="input-label">Senha</p>
            <input
              type="password"
              name="password"
              data-error={registerError.password}
              onChange={(e) => handleInput(e)}
              value={register.password}
            />
            <div id="user-error-label-password">{registerError.password}</div>
          </div>

          <div className="box-input">
            <p className="input-label">Tipo de usuário</p>
            <select
              name="userType"
              data-error={registerError.userType}
              onChange={(e) => handleInput(e)}
              value={register.userType}
            >
              <option value="responsable" selected>Responsável</option>
              <option value="driver">Motorista</option>

            </select>
            <div id="user-error-label-userType">{registerError.userType}</div>
          </div>

        </div>
        <div id="erro-div">{registerError.error}</div>

        <div id="action-container">
          <div className="box-input">
            <IonButton id="button-register" color={"primary"} title="ENTRAR" onClick={handleSubmit}>
              REGISTRAR
            </IonButton>
          </div>
        </div>


      </IonContent>

      <IonFooter>
        <h3>@Mobil 2024</h3>
      </IonFooter>
    </IonPage>
  );
};

export { Register };
