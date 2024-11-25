import { IonApp, IonRoute, IonRouterOutlet, IonSplitPane, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
// import '@ionic/react/css/palettes/dark.class.css';
// import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { Splash } from "./pages/splash/splash";

import { Home } from "./pages/home/home";
import { Login } from "./pages/login/login";
import { Register } from "./pages/registerUser/registerUser";
import { RouteList } from "./pages/route/routeList/routeList";
import { RouteConfig } from "./pages/route/routeConfig/routeConfig";
import { RouteHome } from "./pages/route/routeHome/routeHome";
import { PointList } from "./pages/point/pointList/pointList";
import { ResponsableConfig } from "./pages/driverResponsable/responsableConfig/responsableConfig";
import { ResponsableList } from "./pages/driverResponsable/responsableList/responsableList";

import { RespHome } from "./pages/resp/home/respHome";
import { RespPassagerList } from "./pages/resp/passager/passagerList";
import { ResponsablePassagerConfig } from "./pages/route/routePassagerConfig/routePassagerConfig";
import { RespPassagerConfig } from "./pages/resp/passagerConfig/passagerConfig";

setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true} component={Splash} />
            <Route path="/login" exact={true} component={Login} />
            <Route path="/home" exact={true} component={Home} />
            <Route path="/register" exact={true} component={Register} />
            <Route path="/routes" exact={true} component={RouteList} />
            <Route path="/route/:routeId" exact={true} component={RouteHome} />
            <Route path="/route-config/:routeId" exact={true} component={RouteConfig} />
            <Route path="/route-config/:routeId/:passagerId" exact={true} component={ResponsablePassagerConfig} />
            <Route path="/responsables" exact={true} component={ResponsableList} />
            <Route path="/responsable/:responsableId" exact={true} component={ResponsableConfig} />
            <Route path="/points" exact={true} component={PointList} />

            <Route path="/resp-home" exact={true} component={RespHome} />
            <Route path="/resp-passagers" exact={true} component={RespPassagerList} />
            <Route path="/resp-passager-config/:passagerId" exact={true} component={RespPassagerConfig} />
            <Redirect to={"/"} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
