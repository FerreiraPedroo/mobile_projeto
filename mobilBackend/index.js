import express, { urlencoded } from "express";
import cors from "cors";

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

app.post("/register", async (req, res, next) => {
  const { user, name, password, userType } = req.body;

  try {
    const userData = await db.createUser(user, password, name, userType);

    if (!userData) {
      throw { codStatus: 422, message: "Não foi possivel registrar..." };
    }

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao criar o usuario.",
      error: error.error,
    });
  }
});

// ROUTE ////////////////////////////////////////////////////////////////////
app.get("/day-route-list/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (userId) {
      const routeListData = await db.routeDayList(userId);

      const routeInfo = routeListData.routes.map((route) => {
        const passagers = routeListData.routeRespPassagerRows.filter(
          (point) => point.route_id == route.id
        );

        return {
          id: route.id,
          name: route.name,
          photo: route.photo,
          start_time: route.start_time,
          passager_amount: passagers.length,
          status: route.status,
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
      const { routes, routeRespPassagerRows } = await db.routeList(userId);

      const routesInfo = routes.map((route) => {
        // const boardingPointsAmount = boardingPointRows.filter(
        //   (point) => point.route_id == route.id
        // ).length;
        // const landingPointsAmount = landingPointRows.filter(
        //   (point) => point.route_id == route.id
        // ).length;
        const passagerAmount = routeRespPassagerRows.filter(
          (point) => point.route_id == route.id
        ).length;
        return {
          id: route.id,
          name: route.name,
          photo: route.photo,
          day: route.day,
          // landingPointsAmount,
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
app.get("/route-config/:routeId", async (req, res, next) => {
  const { routeId } = req.params;

  try {
    const routeData = await db.selectRouteConfig(routeId);

    let routeInfo = null;

    if (!routeData) {
      throw { codStatus: 422, message: "Rota não encontrada." };
    }

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
app.get("/route-status/:routeId/:routeDate/:status", async (req, res, next) => {
  const { routeId, status, routeDate } = req.params;

  try {
    const routeData = await db.routeStatus(routeId, routeDate, status);

    if (!routeData) {
      throw { codStatus: 422, message: "Rota não encontrada." };
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
app.get("/route-passager-status/:passagerId/:routeId/:routeDate/:status", async (req, res, next) => {
  const { passagerId, routeId, routeDate, status } = req.params;

  try {
    const routeData = await db.routePassagerStatus(passagerId, routeId, routeDate, status);

    if (!routeData) {
      throw { codStatus: 422, message: "Rota não encontrada." };
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
app.get("/route/:routeId/date/:routeDate", async (req, res, next) => {
  const { routeId, routeDate } = req.params;

  try {
    const routeData = await db.selectRoute(routeId, routeDate);

    let routeInfo = null;

    if (!routeData) {
      throw { codStatus: 422, message: "Rota não encontrada." };
    }

    const routePassager = routeData.routePassagerInfo.map((passager) => {
      return {
        id: passager.passager_id,
        name: passager.name,
        status: passager.status,
        date: passager.date,
        boarding_time: passager.boarding_time,
        landing_time: passager.landing_time,
        boarding_point: passager.boarding_point,
        landing_point: passager.landing_point,
      };
    });

    routeInfo = {
      id: routeData.route.id,
      name: routeData.route.name,
      photo: routeData.route.photo,
      start_time: routeData.route.start_time,
      end_time: routeData.route.end_time,
      passagers: routePassager,
      status: routeData.route.status,
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
  const { routeName, userId } = req.body;

  try {
    const routeData = await db.routeCreate(userId, routeName);

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
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao excluir a rota.",
      error: error.error,
    });
  }
});
// RETORNA O CALENDARIO DE UMA ROTA, QUE ESTÁ DENTRO DA CONFIGURAÇÃO DA ROTA.
app.get("/route/calendar/:routeId/:year/:month", async (req, res, next) => {
  const { routeId, year, month } = req.params;

  try {
    const { routeStatus } = await db.selectRouteCalendar(routeId, year, month);

    if (!routeStatus) {
      throw { codStatus: 422, message: "Calendario não encontrado." };
    }

    const routeCalendarInfo = routeStatus.map((status) => {
      return {
        id: status.id,
        date: status.date,
        start_time: status.start_time,
      };
    });

    return res.status(200).send({ codStatus: 200, message: "OK", data: routeCalendarInfo });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao obter a rota.",
      error: error.error,
    });
  }
});
// ADICIONA NA ROTA O DIA NA DATA DO CALENDARIO.
app.post("/calendar-add/:routeId/:dateDay", async (req, res, next) => {
  const { routeId, dateDay } = req.params;

  try {
    const routeStatus = await db.addRouteCalendar(routeId, dateDay);

    return res.status(200).send({ codStatus: 200, message: "OK", data: routeStatus });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao adicionar o dia a rota.",
      error: error.error,
    });
  }
});
// REMOVE DA ROTA O DIA NA DATA DO CALENDARIO.
app.delete("/calendar-remove/:routeId/:dateDayId/:type", async (req, res, next) => {
  const { routeId, dateDayId } = req.params;

  try {
    const routeStatus = await db.removeRouteCalendar(routeId, dateDayId);

    if (routeStatus == "NOT EXISTS") {
      throw { codStatus: 422, message: "Esse dia não está na rota." };
    }

    return res.status(200).send({ codStatus: 200, message: "OK", data: routeStatus });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao adicionar o dia a rota.",
      error: error.error,
    });
  }
});
// RETONAR AS INFORMAÇÕES DO PONTO DE EMBARQUE E DESEMBARQUE AO PASSAGEIRO DA ROTA
app.get("/route/:routeId/passager/:passagerId", async (req, res, next) => {
  const { routeId, passagerId } = req.params;

  try {
    const { passager, boardingPoints, landingPoints } = await db.routePassagerSelect(
      routeId,
      passagerId
    );

    const passagerInfo = {
      id: passager.id,
      name: passager.name,
      boardingPoints: boardingPoints.map((point) => {
        return {
          id: point.id,
          name: point.name,
          maps: point.maps,
        };
      }),
      landingPoints: landingPoints.map((point) => {
        return {
          id: point.id,
          name: point.name,
          maps: point.maps,
        };
      }),
    };

    return res.status(200).send({ codStatus: 200, message: "OK", data: passagerInfo });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao obter a rota.",
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
  const { pointName, userId, pointMaps, photo } = req.body;

  try {
    const routeData = await db.pointCreate(pointName, userId, pointMaps, photo);

    if (!routeData) {
      throw { codStatus: 422, message: "Não foi possivel criar o ponto de parada.." };
    }

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao o ponto de parada.",
      error: error.error,
    });
  }
});
app.delete("/point/:pointId/:userId", async (req, res, next) => {
  const { pointId, userId } = req.params;

  try {
    const pointDeleted = await db.pointDelete(pointId, userId);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    console.log({ error });
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao excluir o ponto de parada.",
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
      message: error.message || "[ROT]: Erro ao obter a lista de passageiros.",
      error: error.error,
    });
  }
});
app.post("/passager/:routeId/:passagerId/:type", async (req, res, next) => {
  const { routeId, passagerId, type } = req.params;

  try {
    await db.routePassagerAdd(routeId, passagerId, type);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter a lista de pontos.",
      error: error.error,
    });
  }
});
app.delete("/passager/:passagerId/route/:routeId/type-point/:type", async (req, res, next) => {
  const { passagerId, routeId, type } = req.params;

  try {
    const routePointData = await db.routePassagerPointDelete(routeId, passagerId, type);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter a lista de pontos.",
      error: error.error,
    });
  }
});
app.delete("/passager/:passagerId/route/:routeId", async (req, res, next) => {
  const { passagerId, routeId } = req.params;

  try {
    await db.routePassagerDelete(passagerId, routeId);

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
app.post("/passager/:routeId/:passagerId/:pointId/type/:type", async (req, res, next) => {
  const { routeId, passagerId, pointId, type } = req.params;

  try {
    const routePointData = await db.routePassagerPointAdd(routeId, pointId, passagerId, type);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao obter atualizar o ponto do passageiro.",
      error: error.error,
    });
  }
});

/////////////////////////////////////////////////////////////////////////////

// RESPONSABLE //////////////////////////////////////////////////////////////
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

app.get("/resp-passager-list/:responsableId", async (req, res, next) => {
  const { responsableId } = req.params;

  try {
    const { responsablePassagers } = await db.respPassagerList(responsableId);

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
      message: error.message || "[ROT]: Erro ao obter a lista de passageiros.",
      error: error.error,
    });
  }
});

app.post("/resp-passager", async (req, res, next) => {
  const { passagerName, userId } = req.body;

  try {
    const passagerData = await db.respPassagerCreate(passagerName, userId);

    if (!passagerData) {
      throw { codStatus: 422, message: "Não foi possivel criar o passageiro.." };
    }

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao criar o passageiro.",
      error: error.error,
    });
  }
});

app.delete("/resp-passager/:userId/:passagerId", async (req, res, next) => {
  const { userId, passagerId } = req.params;

  try {
    const passagerDeleted = await db.respPassagerDelete(userId, passagerId);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 422,
      message: error.message || "[ROT]: Erro ao excluir o passageiro.",
      error: error.error,
    });
  }
});

app.get("/resp-passager-config/:passagerId", async (req, res, next) => {
  const { passagerId } = req.params;

  try {
    const { passager, routeList } = await db.respPassagerConfig(passagerId);

    if (!passager) {
      throw { codStatus: 422, message: "Não foi possivel carregar os dados passageiro.." };
    }

    const passagerInfo = {
      id: passager.id,
      name: passager.name,
      photo: passager.photo,
      routes: routeList.map((route) => {
        return {
          name: route.name,
        };
      }),
    };

    return res.status(200).send({ codStatus: 200, message: "OK", data: passagerInfo });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao criar o passageiro.",
      error: error.error,
    });
  }
});

/////////////////////////////////////////////////////////////////////////////

// DRIVER RESPONSABLE ///////////////////////////////////////////////////////
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
          name: passager.name,
        };
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

app.post("/responsable-add", async (req, res, next) => {
  const { userResponsableId, driverId } = req.body;

  try {
    const responsableAdded = await db.responsableAddDriver(userResponsableId, driverId);

    return res.status(200).send({ codStatus: 200, message: "OK" });
  } catch (error) {
    return res.status(error.codStatus || 422).send({
      codStatus: error.codStatus || 500,
      message: error.message || "[ROT]: Erro ao obter a rota.",
      error: error.error,
    });
  }
});

app.delete("/responsable/:userId/:responsableId", async (req, res, next) => {
  const { userId, responsableId } = req.params;

  try {
    const responsableDeleted = await db.responsableDelete(userId, responsableId);

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

app.listen(3000, () => {
  console.log("SERVER RUN PORT:3000");
});
