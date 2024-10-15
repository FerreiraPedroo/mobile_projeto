import express, { urlencoded } from "express";
import cors from "cors";
import QRCode from "qrcode";

import { validateTokenJWT } from "./helpers/jwt.js";
import { loginUserService } from "./service/loginUserService.js";

import * as db from "./database/db.js";

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:8100",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    credentials: true,
    // exposedHeaders: ["x-strao-update-data"]
  })
);

app.post("/check-login", async (req, res, next) => {
  const { token } = req.body;
  try {
    if (token) {
      const tokenValid = await validateTokenJWT(token);

      const userInfo = await db.getUserByID(tokenValid.token);

      if (userInfo instanceof Error) {
        throw userInfo;
      }

      return res.status(200).send({ codStatus: 200, message: "OK" });
    } else {
      throw { codStatus: 422, error: "Token não enviado." };
    }
  } catch (error) {
    return res.status(error.codStatus || 500).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao checar o token.",
      error: error.error,
    });
  }
});

app.post("/login", async (req, res, next) => {
  const { user, password } = req.body;

  try {
    if (user || password) {
      const logedToken = await loginUserService({ user, password });
      console.log({ logedToken });
      return res.status(200).send({ codStatus: 200, message: "Login OK.", data: logedToken });
    } else {
      throw { codStatus: 422, error: "Usuário ou senha errado(s)." };
    }
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao efetuar o login.",
      error: error.error,
    });
  }
});

// ROUTE ////////////////////////////////////////////////////////////////////
app.get("/point/:userId/:routeId/:type", async (req, res, next) => {
  const { userId, routeId, type } = req.params;

  try {
    const pointListData = await db.userPointList(userId, routeId, type);

    const pointsInfo = pointListData.map((point) => {
      return {
        id: point.id,
        name: point.name,
        photo: point.photo,
      };
    });

    return res.status(200).send({ codStatus: 200, message: "OK", data: pointsInfo });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter a lista de pontos.",
      error: error.error,
    });
  }
});
app.post("/point/:routeId/:pointId/:type", async (req, res, next) => {
  const { routeId, pointId, type } = req.params;

  try {
    const routePointData = await db.routePointAdd(routeId, pointId, type);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter a lista de pontos.",
      error: error.error,
    });
  }
});
app.delete("/point/:routeId/:pointId/:type", async (req, res, next) => {
  const { routeId, pointId, type } = req.params;

  try {
    const routePointData = await db.routePointDelete(routeId, pointId, type);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter a lista de pontos.",
      error: error.error,
    });
  }
});

app.get("/day-route-list/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (userId) {
      const routeListData = await db.routeList(userId);

      const routeInfo = routeListData.routes.map((route) => {
        const boardingPoints = routeListData.boardingPointRows.filter(
          (point) => point.route_id == route.id
        );
        const landingPoints = routeListData.landingPointRows.filter(
          (point) => point.route_id == route.id
        );
        const passagers = routeListData.routeRespPassagerRows.filter(
          (point) => point.route_id == route.id
        );

        return {
          id: route.id,
          name: route.name,
          photo: route.photo,
          boarding_point_amount: boardingPoints.length,
          landing_point_amount: landingPoints.length,
          passager_amount: passagers.length,
        };
      });

      return res.status(200).send({ codStatus: 200, message: "OK", data: routeInfo });
    } else {
      throw { codStatus: 422, error: "Id do usuário não é valido." };
    }
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao checar o token.",
      error: error.error,
    });
  }
});
app.get("/route-list/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (userId) {
      const { routes, boardingPointRows, landingPointRows, routeRespPassagerRows } =
        await db.routeList(userId);

      const routesInfo = routes.map((route) => {
        const boardingPointsAmount = boardingPointRows.filter(
          (point) => point.route_id == route.id
        ).length;
        const landingPointsAmount = landingPointRows.filter(
          (point) => point.route_id == route.id
        ).length;
        const passagerAmount = routeRespPassagerRows.filter(
          (point) => point.route_id == route.id
        ).length;
        return {
          id: route.id,
          name: route.name,
          photo: route.photo,
          boardingPointsAmount,
          landingPointsAmount,
          passagerAmount,
        };
      });

      return res.status(200).send({ codStatus: 200, message: "OK", data: routesInfo });
    } else {
      throw { codStatus: 422, error: "Id do usuário não é valido." };
    }
  } catch (error) {
    console.log(error);
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao checar o token.",
      error: error.error,
    });
  }
});
app.get("/route/:routeId", async (req, res, next) => {
  const { routeId } = req.params;

  try {
    const routeData = await db.selectRoute(routeId);

    let routeInfo = null;

    if (!routeData) {
      throw { codStatus: 422, message: "Rota não encontrada." };
    }

    const routeBoardingPoint = routeData.boardingPointsInfo.map((point) => {
      return {
        id: point.id,
        name: point.name,
      };
    });

    const routeLandingPoint = routeData.landingPointsInfo.map((point) => {
      return {
        id: point.id,
        name: point.name,
      };
    });

    const routePassager = routeData.respPassagerInfo.map((passager) => {
      return {
        id: passager.id,
        name: passager.name,
      };
    });

    routeInfo = {
      id: routeData.route.id,
      name: routeData.route.name,
      photo: routeData.route.photo,
      start_time: routeData.route.start_time,
      end_time: routeData.route.end_time,
      boardingPoints: routeBoardingPoint,
      landingPoints: routeLandingPoint,
      passagers: routePassager,
    };

    return res.status(200).send({ codStatus: 200, message: "OK", data: routeInfo });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao obter a rota.",
      error: error.error,
    });
  }
});
app.post("/route", async (req, res, next) => {
  const { routeName, userId, day } = req.body;

  try {
    const routeData = await db.routeCreate(routeName, userId, day);

    if (!routeData) {
      throw { codStatus: 422, message: "Não foi possivel criar a rota." };
    }

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao obter a rota.",
      error: error.error,
    });
  }
});
app.delete("/route/:routeId/:userId/:type", async (req, res, next) => {
  const { routeId, userId, type } = req.params;

  try {
    const routeDeleted = await db.routeDelete(routeId, userId, type);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    console.log({ error });
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao excluir a rota.",
      error: error.error,
    });
  }
});
/////////////////////////////////////////////////////////////////////////////

// POINTS /////////////////////////////////////////////////////////////////
app.get("/point-list/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (userId) {
      const { points } = await db.pointList(userId);

      const pointsInfo = points.map((point) => {
        return {
          id: point.id,
          name: point.name,
          photo: point.maps,
          photo: point.photo,
        };
      });

      return res.status(200).send({ codStatus: 200, message: "OK", data: pointsInfo });
    } else {
      throw { codStatus: 422, error: "Id do usuário não é valido." };
    }
  } catch (error) {
    console.log(error);
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao checar o token.",
      error: error.error,
    });
  }
});

app.post("/point", async (req, res, next) => {
  const { pointName, userId, maps, photo } = req.body;

  try {
    const routeData = await db.pointCreate(pointName, userId, maps, photo);

    if (!routeData) {
      throw { codStatus: 422, message: "Não foi possivel criar o ponto de parada.." };
    }

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao criar a rota.",
      error: error.error,
    });
  }
});

/////////////////////////////////////////////////////////////////////////////

// PASSAGER /////////////////////////////////////////////////////////////////
app.get("/passager/:userId/:routeId/:type", async (req, res, next) => {
  const { userId, routeId, type } = req.params;

  try {
    const { responsables, responsablePassagers } = await db.passagerList(userId, routeId, type);

    const passagerInfo = responsablePassagers.map((passager) => {
      return {
        id: passager.id,
        name: passager.name,
        photo: passager.photo,
      };
    });

    return res.status(200).send({ codStatus: 200, message: "OK", data: passagerInfo });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter a lista de pontos.",
      error: error.error,
    });
  }
});
app.post("/passager/:routeId/:passagerId/:type", async (req, res, next) => {
  const { routeId, passagerId, type } = req.params;

  try {
    const routePointData = await db.routePassagerAdd(routeId, passagerId, type);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter a lista de pontos.",
      error: error.error,
    });
  }
});
app.delete("/passager/:routeId/:passagerId/:type", async (req, res, next) => {
  const { routeId, passagerId, type } = req.params;

  try {
    const routePointData = await db.routePassagerDelete(routeId, passagerId, type);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter a lista de pontos.",
      error: error.error,
    });
  }
});
/////////////////////////////////////////////////////////////////////////////

// RESPONSABLE /////////////////////////////////////////////////////////////
app.get("/resp-day-route-list/:userId/:day", async (req, res, next) => {
  const { userId, day } = req.params;

  try {
    if (userId && day) {
      const routeListData = await db.respRouteList(userId, day);

      const routeInfo = routeListData.routes.map((route) => {
        const boardingPoints = routeListData.boardingPointRows.filter(
          (point) => point.route_id == route.id
        );
        const landingPoints = routeListData.landingPointRows.filter(
          (point) => point.route_id == route.id
        );
        const passagers = routeListData.routeRespPassagerRows.filter(
          (point) => point.route_id == route.id
        );

        return {
          id: route.id,
          name: route.name,
          photo: route.photo,
          boarding_point_amount: boardingPoints.length,
          landing_point_amount: landingPoints.length,
          passager_amount: passagers.length,
        };
      });

      return res.status(200).send({ codStatus: 200, message: "OK", data: routeInfo });
    } else {
      throw { codStatus: 422, error: "Id do usuário não é valido." };
    }
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao checar o token.",
      error: error.error,
    });
  }
});

app.get("/qrcode/:responsableId", async (req, res, next) => {
  const { responsableId } = req.params;

  try {
    const generateQR = async (text) => {
      try {
        return await QRCode.toDataURL(text);
      } catch (err) {
        throw { codStatus: 422, error: "Erro ao gerar o QR Code." };
      }
    };

    const QRCodeInfo = await generateQR(responsableId);

    return res.status(200).send({ codStatus: 200, message: "OK", data: QRCodeInfo, responsableId });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Não foi possivel gerar o QRCode.",
      error: error.error,
    });
  }
});

app.get("/responsable-list/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (userId) {
      const { responsables, resposablePassager } = await db.responsablesList(userId);

      const responsablesInfo = responsables.map((responsable) => {
        const passagerAmount = resposablePassager.filter(
          (passager) => passager.user_responsable_id == responsable.id
        ).length;

        return {
          id: responsable.id,
          name: responsable.name,
          photo: responsable.photo,
          passagerAmount: passagerAmount,
        };
      });

      return res.status(200).send({ codStatus: 200, message: "OK", data: responsablesInfo });
    } else {
      throw { codStatus: 422, error: "Id do usuário não é valido." };
    }
  } catch (error) {
    console.log(error);
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao checar o token.",
      error: error.error,
    });
  }
});

app.get("/responsable/:responsableId", async (req, res, next) => {
  const { responsableId } = req.params;

  try {
    const { responsableResult, routeRespPassagerResult } = await db.selectResponsable(
      responsableId
    );

    const responsableInfo = {
      id: responsableResult.id,
      name: responsableResult.name,
      email: responsableResult.email,
      passagers: routeRespPassagerResult.map((passager) => {
        return {
          id: passager.id,
          name: passager.name
        }
      }),
    };

    return res.status(200).send({ codStatus: 200, message: "OK", data: responsableInfo });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao obter a rota.",
      error: error.error,
    });
  }
});

/////////////////////////////////////////////////////////////////////////////

app.listen(3000, () => {
  console.log("SERVER RUN PORT:3000");
});
