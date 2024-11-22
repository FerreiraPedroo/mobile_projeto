import mysql from "mysql2/promise";
import QRCode from "qrcode";
const global = {};

async function connect() {
  if (global.connection && global.connection.state !== "disconnected") {
    return global.connection;
  }
  // const connection = await mysql.createConnection(
  //   "mysql://admin:adminmobil@database-mobil.cxs2my6o0uab.us-west-2.rds.amazonaws.com/mobil"
  // );
  const connection = await mysql.createConnection(
    "mysql://root:root@127.0.0.1:3306/mobil"
  );
  global.connection = connection;

  return connection;
}

///////////////////////////////////////////////////////////////////////////////
// ROUTE /////////////////////////////////////////////////////////////////////
async function selectRoute(routeId) {
  const conn = await connect();
  const [routeResults] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

  // ROUTE STATUS
  const [routeStatus] = await conn.query(`SELECT * FROM route_status WHERE route_id=${routeId}`);

  const routeInfo = {
    ...routeResults[0],
    status: routeStatus[0],
  };

  // PASSAGER //////////////////////////////////////////////////////////////////////////////////////////////////////
  const [routeRespPassagerResult] = await conn.query(
    `SELECT passager_id FROM route_passagers WHERE route_id=${routeId}`
  );
  const respPassagerIds = routeRespPassagerResult.length
    ? routeRespPassagerResult.reduce((prev, curr, idx) => {
        if (idx == 0) return curr.passager_id;
        return prev + ", " + curr.passager_id;
      }, "")
    : null;

  let respPassagerInfo = [];
  if (respPassagerIds) {
    const [passagerResults] = await conn.query(
      `SELECT * FROM passager WHERE id IN(${respPassagerIds})`
    );
    respPassagerInfo = passagerResults;
  }

  return { route: routeInfo, respPassagerInfo };
}
async function routeList(userId) {
  const conn = await connect();

  // QRCode.toDataURL("resp-add", function (err, url) {
  //   console.log(url);
  // });

  const [routes] = await conn.query(`SELECT * FROM route WHERE user_id=${userId}`);

  const routeIds = routes.length
    ? routes.reduce((prev, curr, idx) => {
        if (idx == 0) return curr.id;
        return prev + ", " + curr.id;
      }, "")
    : null;

  // PASSAGER
  const [routeRespPassagerRows] = await conn.query(
    `SELECT route_id FROM route_passagers WHERE route_id in (${routeIds})`
  );

  return { routes, routeRespPassagerRows };
}
async function routeDayList(userId) {
  const conn = await connect();

  // QRCode.toDataURL("resp-add", function (err, url) {
  //   console.log(url);
  // });

  const [routes] = await conn.query(`SELECT * FROM route WHERE user_id=${userId}`);

  const routeIds = routes.length
    ? routes.reduce((prev, curr, idx) => {
        if (idx == 0) return curr.id;
        return prev + ", " + curr.id;
      }, "")
    : null;

  // TODAY DATE
  let routeDay = new Date().toLocaleDateString("pt-BR").split("/").reverse().join("-");

  // ROUTE DAY
  const [routeDayStatusRows] = await conn.query(
    `SELECT * FROM route_status WHERE route_id in (${routeIds}) AND date='${routeDay}'`
  );

  const routeDayStatusIds = routeDayStatusRows.map((routeDayId) => routeDayId.route_id);

  const routesDayInfo = routes.filter((route) =>
    routeDayStatusIds.find((routeId) => routeId == route.id)
  );

  // PASSAGER
  let routeRespPassager = [];
  if (routesDayInfo.length) {
    const [routeRespPassagerRows] = await conn.query(
      `SELECT route_id FROM route_passagers WHERE route_id in (${routeDayStatusIds.join(",")})`
    );
    routeRespPassager = routeRespPassagerRows;
  }

  const routesInfoDayWithStatus = routesDayInfo.map((routeDay) => {
    routeDay["status"] =
      routeDayStatusRows.find((routeStatus) => routeStatus.route_id == routeDay.id) ?? null;
    return routeDay;
  });

  return { routes: routesInfoDayWithStatus, routeRespPassagerRows: routeRespPassager };
}
// ROUTE CALENDAR
async function selectRouteCalendar(routeId, year, month) {
  const conn = await connect();

  const dateMonth = new Date(year, month);
  const firstDay = new Date(dateMonth.getFullYear(), dateMonth.getMonth(), 1).toISOString();
  const lastDay = new Date(dateMonth.getFullYear(), dateMonth.getMonth() + 1, 0).toISOString();

  // ROUTE STATUS
  const [routeStatus] = await conn.query(
    `SELECT * FROM route_status WHERE route_id=${routeId} AND date BETWEEN date('${
      firstDay.split("T")[0]
    }') AND date('${lastDay.split("T")[0]}')`
  );

  return { routeStatus };
}
async function addRouteCalendar(routeId, dateDay) {
  const conn = await connect();

  const dateMonth = dateDay.split("-").reverse().join("-");
  console.log({ dateDay });
  console.log({ dateMonth });

  // ROUTE STATUS
  const [routeStatus] = await conn.query(
    `SELECT * FROM route_status WHERE route_id=${routeId} AND date='${dateMonth}'`
  );

  console.log({ routeStatus }, !routeStatus.length);

  if (!routeStatus.length) {
    const [routeStatusInserted] = await conn.query(
      `INSERT INTO route_status (route_id, status , date) VALUES (${routeId}, 'ATIVO', '${dateMonth}')`
    );
    console.log({ routeStatusInserted });
  } else {
    return "EXISTS";
  }

  return "OK";
}
async function removeRouteCalendar(routeId, dateDayId) {
  const conn = await connect();

  // ROUTE STATUS
  const [routeStatus] = await conn.query(`SELECT * FROM route_status WHERE id='${dateDayId}'`);

  if (routeStatus.length) {
    const [routeStatusDeleted] = await conn.query(
      `DELETE FROM route_status WHERE id='${dateDayId}'`
    );
    console.log({ routeStatusDeleted });
  } else {
    return "NOT EXISTS";
  }

  return "OK";
}

async function routeCreate(userId, routeName) {
  const conn = await connect();

  const [route] = await conn.query(
    `SELECT * FROM route WHERE name='${routeName}' AND user_id='${userId}'`
  );

  if (route.length) {
    throw { codStatus: 422, message: "Esta rota existente.", error: "" };
  }

  const [routeResult] = await conn.query(
    `INSERT INTO route (name, user_id) VALUES ('${routeName}',${userId})`
  );

  return routeResult;
}
async function routeDelete(routeId, userId, type) {
  const conn = await connect();

  const [route] = await conn.query(`SELECT id FROM route WHERE id=${routeId}`);

  if (!route.length) {
    throw { codStatus: 422, message: "Rota não encontrada", error: "" };
  }

  const [routePassagerResults] = await conn.query(
    `SELECT id FROM route_passagers WHERE route_id=${routeId}`
  );

  let routePassagerIds = null;
  if (routePassagerResults.length) {
    routePassagerIds = routePassagerResults.length
      ? routePassagerResults.reduce((prev, curr, idx) => {
          if (idx == 0) return curr.id;
          return prev + ", " + curr.id;
        }, "")
      : null;
  }

  const [routePointsResult] = await conn.query(
    `SELECT id FROM route_points WHERE route_id=${routeId}`
  );

  let routePointIds = null;
  if (routePointsResult.length) {
    routePointIds = routePointsResult.length
      ? routePointsResult.reduce((prev, curr, idx) => {
          if (idx == 0) return curr.id;
          return prev + ", " + curr.id;
        }, "")
      : null;
  }

  if (routePassagerIds) {
    await conn.query(`DELETE FROM route_passagers WHERE id IN (${routePassagerIds})`);
  }
  if (routePointIds) {
    await conn.query(`DELETE FROM route_points WHERE id IN (${routePointIds})`);
  }
  if (route.length) {
    await conn.query(`DELETE FROM route WHERE id=${routeId}`);
  }

  return "OK";
}

// ROUTE PASSAGER
async function passagerList(userId, routeId, type) {
  const conn = await connect();

  const [route] = await conn.query(`SELECT id FROM route WHERE id=${routeId}`);

  if (!route.length) {
    throw { codStatus: 422, message: "Rota não encontrada", error: "" };
  }

  const [responsables] = await conn.query(`SELECT id FROM user WHERE driver_id=${userId}`);

  if (!responsables.length) {
    return { responsables: [], responsablePassagers: [] };
  }

  const responsableResultIds = responsables.length
    ? responsables.reduce((prev, curr, idx) => {
        if (idx == 0) return curr.id;
        return prev + ", " + curr.id;
      }, "")
    : null;

  // PASSAGER EXIST ////////////////////////////////////////////////////////////////////////////////////////////
  const [routeRespPassagerResult] = await conn.query(
    `SELECT * FROM route_passagers WHERE route_id=${routeId}`
  );
  const respPassagerIds = routeRespPassagerResult.length
    ? routeRespPassagerResult.reduce((prev, curr, idx) => {
        if (idx == 0) return curr.passager_id;
        return prev + ", " + curr.passager_id;
      }, "")
    : null;

  const [responsablePassagers] = await conn.query(
    `SELECT * FROM passager WHERE user_responsable_id IN (${responsableResultIds}) ${
      respPassagerIds ? "AND id NOT IN (" + respPassagerIds + ")" : ""
    }`
  );

  return { responsables, responsablePassagers };
}
async function routePassagerAdd(routeId, passagerId, type) {
  const conn = await connect();

  const [route] = await conn.query(`SELECT id FROM route WHERE id=${routeId}`);
  if (!route.length) {
    throw { codStatus: 422, message: "Rota não encontrada", error: "" };
  }

  const [passagerRouteExists] = await conn.query(
    `SELECT id FROM route_passagers WHERE route_id=${routeId} AND passager_id=${passagerId}`
  );
  if (passagerRouteExists.length) {
    throw { codStatus: 422, message: `Este passageiro ja esta na rota.`, error: "" };
  }

  const [passagerRouteAdded] = await conn.query(
    `INSERT INTO route_passagers (passager_id, route_id) VALUES (${passagerId},${routeId})`
  );

  return passagerRouteAdded;
}
async function routePassagerSelect(routeId, passagerId) {
  const conn = await connect();

  const [passager] = await conn.query(`SELECT * FROM passager WHERE id=${passagerId}`);

  if (!passager.length) {
    return new Error({ codStatus: 422, message: "Passageiro não encontrado.", error: "" });
  }

  // PASSAGER ROUTE
  const [routePassagerPoints] = await conn.query(
    `SELECT * FROM route_passagers WHERE passager_id=${passagerId} AND route_id=${routeId}`
  );

  const routePassagersPointIds = routePassagerPoints.reduce(
    (prev, passager, idx) => {
      if (passager.boarding_point_id == null && passager.landing_point_id == null) {
        return prev;
      }

      if (passager.boarding_point_id) {
        prev.boardingPoints += prev.boardingPoints.length
          ? ", " + passager.boarding_point_id
          : passager.boarding_point_id;
      }

      if (passager.landing_point_id) {
        prev.landingPoints += prev.landingPoints.length
          ? ", " + passager.landing_point_id
          : passager.landing_point_id;
      }

      return prev;
    },
    { boardingPoints: "", landingPoints: "" }
  );

  let boardingPoints = [];
  if (routePassagersPointIds.boardingPoints.length) {
    const [pointsFind] = await conn.query(
      `SELECT * FROM point WHERE id IN ('${routePassagersPointIds.boardingPoints}')`
    );
    boardingPoints = pointsFind;
  }
  let landingPoints = [];
  if (routePassagersPointIds.landingPoints.length) {
    const [pointsFind] = await conn.query(
      `SELECT * FROM point WHERE id IN ('${routePassagersPointIds.landingPoints}')`
    );
    landingPoints = pointsFind;
  }

  return { passager: passager[0], boardingPoints, landingPoints };
}

// ROUTE PASSAGER POINTS
async function userPointList(userId, routeId, type) {
  const conn = await connect();

  const [route] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

  if (!route.length) {
    throw { codStatus: 422, message: "Rota não encontrada", error: "" };
  }

  const [routePoint] = await conn.query(
    `SELECT point_id FROM route_points WHERE route_id=${routeId} AND type='${type}'`
  );
  const routePointIds = routePoint.length
    ? routePoint.reduce((prev, curr, idx) => {
        if (idx == 0) return curr.point_id;
        return prev + ", " + curr.point_id;
      }, "")
    : null;

  const [pointResult] = await conn.query(
    `SELECT id, name, photo FROM point WHERE user_id=${userId} ${
      routePointIds ? `AND id NOT IN (${routePointIds})` : ""
    }`
  );

  return pointResult;
}
async function routePassagerPointAdd(routeId, pointId, passagerId, type) {
  const conn = await connect();

  const [route] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

  if (!route.length) {
    throw { codStatus: 422, message: "Rota não encontrada", error: "" };
  }

  const [point] = await conn.query(`SELECT * FROM point WHERE id=${pointId}`);

  if (!point.length) {
    throw { codStatus: 422, message: "Ponto não encontrada", error: "" };
  }

  const [passager] = await conn.query(`SELECT * FROM passager WHERE id=${passagerId}`);

  if (!passager.length) {
    throw { codStatus: 422, message: "Passageiro não encontrada", error: "" };
  }

  const [routePassagerPointExists] = await conn.query(
    `SELECT * FROM route_passagers WHERE route_id=${routeId} AND passager_id=${passagerId}`
  );

  const typePoint = type == "boarding" ? "boarding_point_id" : "landing_point_id";

  if (!routePassagerPointExists.length) {
    const [pointResult] = await conn.query(
      `INSERT INTO route_passagers (passager_id, route_id, ${typePoint}) VALUES (${passagerId}, ${routeId}, ${pointId})`
    );
  } else {
    const [pointResult] = await conn.query(
      `UPDATE route_passagers SET ${typePoint} = ${pointId} WHERE id=${routePassagerPointExists[0].id}`
    );
  }

  return "OK";
}
async function routePassagerPointDelete(routeId, passagerId, type) {
  const conn = await connect();

  const [route] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

  if (!route.length) {
    throw { codStatus: 422, message: "Rota não encontrada", error: "" };
  }

  const [routePassagerExists] = await conn.query(
    `SELECT * FROM route_passagers WHERE route_id=${routeId} AND passager_id='${passagerId}'`
  );

  if (!routePassagerExists.length) {
    throw { codStatus: 422, message: `O passageiro não está na rota.`, error: "" };
  }

  const [pointResult] = await conn.query(
    `UPDATE route_passagers SET ${
      type == "boarding" ? "boarding_point_id" : "landing_point_id"
    }=null  WHERE route_id=${routeId} AND passager_id='${passagerId}'`
  );

  return pointResult;
}

///////////////////////////////////////////////////////////////////////////////
// POINTS ////////////////////////////////////////////////////////////////////
async function pointList(userId) {
  const conn = await connect();

  const [points] = await conn.query(`SELECT * FROM point WHERE user_id=${userId}`);

  return { points };
}
async function pointCreate(pointName, userId, maps = null, photo = null) {
  const conn = await connect();
  const [point] = await conn.query(
    `SELECT * FROM point WHERE name='${pointName}' AND user_id='${userId}'`
  );

  if (point.length) {
    throw { codStatus: 422, message: "Esse ponto de parada existente.", error: "" };
  }

  const [pointResult] = await conn.query(
    `INSERT INTO point (user_id, name, maps, photo) VALUES (${userId}, '${pointName}', '${maps}', '${photo}')`
  );

  return pointResult;
}
async function pointDelete(pointId, userId) {
  const conn = await connect();

  const [point] = await conn.query(
    `SELECT id FROM point WHERE id=${pointId} AND user_id=${userId}`
  );

  if (!point.length) {
    throw { codStatus: 422, message: "Ponto de parada não encontrada", error: "" };
  }

  await conn.query(`DELETE FROM route_points WHERE point_id=${pointId}`);

  await conn.query(`DELETE FROM point WHERE id=${pointId}`);

  return "OK";
}

///////////////////////////////////////////////////////////////////////////////
// USER //////////////////////////////////////////////////////////////////////
async function getUserByEmail(email) {
  const conn = await connect();

  const [user] = await conn.query(`SELECT * FROM user WHERE email='${email}'`);

  if (!user.length) {
    throw { codStatus: 422, message: "Usuario não encontrado.", error: "" };
  }

  return user[0];
}
async function getUserByID(userId) {
  const conn = await connect();

  const [user] = await conn.query(`SELECT * FROM user WHERE id=${userId}`);

  if (!user.length) {
    return new Error({ codStatus: 422, message: "Usuario não encontrado.", error: "" });
  }

  return user[0];
}
async function setUserToken(userId, token) {
  const conn = await connect();
  await conn.query(`UPDATE user SET token='${token}' WHERE id=${userId}`);

  return true;
}
async function createUser(email, password, name, userType) {
  const conn = await connect();

  const [user] = await conn.query(`SELECT * FROM user WHERE email='${email}'`);

  if (user.length) {
    throw { codStatus: 422, message: "Email ja cadastrado.", error: "" };
  }

  const [createdUser] = await conn.query(
    `INSERT INTO user ('email','password','name','user_type') VALUES ('${email}','${password}','${name}','${userType}')`
  );

  if (!createdUser.length) {
    throw { codStatus: 422, message: "Não foi possivel criar o usuario.", error: "" };
  }

  return createdUser[0];
}

///////////////////////////////////////////////////////////////////////////////
// DRIVER RESPONSABLE/////////////////////////////////////////////////////////
async function respRouteList(userId, day) {
  const conn = await connect();
  const date = new Date(day).setHours(0, 0, 0);

  // RESPONSABLE PASSSAGERS
  const [respPassagers] = await conn.query(
    `SELECT id FROM passager WHERE user_responsable_id=${userId}`
  );
  const respoPassagerIds = respPassagers.reduce((prev, passager, idx) => {
    if (idx == 0) return passager.id;
    return prev + ", " + passager.id;
  }, "");

  if (!respPassagers.length) {
    return { routes: [], boardingPointRows: [], landingPointRows: [], routeRespPassagerRows: [] };
  }

  // ROUTE RESPONSABLE PASSAGERS
  let [routeRespPass] = await conn.query(
    `SELECT route_id FROM route_passagers WHERE passager_id IN (${respoPassagerIds})`
  );
  const routeIds = new Set(
    routeRespPass.map((route) => {
      // console.log(route.route_id);

      return route.route_id;
    })
  );

  /*











 */

  // console.log("OK", routeIds);

  if (!routeIds.length) {
    return { routes: [], boardingPointRows: [], landingPointRows: [], routeRespPassagerRows: [] };
  }

  const [routes] = await conn.query(`SELECT * FROM route WHERE id IN (${routeIds.join(",")})`);
  // BOARDING
  const [boardingPointRows] = await conn.query(
    `SELECT route_id FROM route_points WHERE route_id in (${routeIds}) AND type="boarding"`
  );
  // LANDING
  const [landingPointRows] = await conn.query(
    `SELECT route_id FROM route_points WHERE route_id in (${routeIds}) AND type="landing"`
  );
  // PASSAGER
  const [routeRespPassagerRows] = await conn.query(
    `SELECT route_id FROM route_passagers WHERE route_id in (${routeIds})`
  );

  return { routes: "", boardingPointRows: "", landingPointRows: "", routeRespPassagerRows: "" };
  // return { routes, boardingPointRows, landingPointRows, routeRespPassagerRows }
}
async function responsablesList(userId) {
  const conn = await connect();

  const [user] = await conn.query(`SELECT * FROM user WHERE id=${userId} AND user_type='driver'`);

  if (!user.length) {
    return new Error({ codStatus: 422, message: "Usuario não encontrado.", error: "" });
  }

  // RESPONSABLE
  const [responsables] = await conn.query(
    `SELECT * FROM user WHERE driver_id=${userId} AND user_type='responsable'`
  );
  const responsablesIds = responsables.reduce((prev, responsable, idx) => {
    if (idx == 0) return responsable.id;
    return prev + ", " + responsable.id;
  }, "");

  // PASSAGER
  const [resposablePassager] = await conn.query(
    `SELECT * FROM passager WHERE user_responsable_id IN ('${responsablesIds}')`
  );

  return { responsables, resposablePassager };
}
async function responsableDelete(userId, responsableId) {
  const conn = await connect();

  // RESPOSANBLE ////////////////////////////////////////////////////////////////////
  const [responsable] = await conn.query(
    `SELECT id FROM user WHERE id=${responsableId} AND driver_id=${userId} AND user_type='responsable'`
  );

  if (!responsable.length) {
    throw { codStatus: 422, message: "Responsavel não encontrada", error: "" };
  }

  // RESPOSANBLE PASSAGERS //////////////////////////////////////////////////////////
  const [responsablePassager] = await conn.query(
    `SELECT id FROM passager WHERE user_responsable_id=${responsableId}`
  );

  let responsablePassagerIds = null;
  responsablePassagerIds = responsablePassager.reduce((prev, passagers, idx) => {
    if (idx == 0) return passagers.id;
    return prev + ", " + passagers.id;
  }, "");

  // UPDATE & DELETE ////////////////////////////////////////////////////////////////////
  await conn.query(`DELETE FROM passager WHERE user_responsable_id=${responsableId}`);

  if (responsablePassagerIds) {
    await conn.query(
      `DELETE FROM route_passagers WHERE passager_id IN (${responsablePassagerIds})`
    );
  }

  await conn.query(`UPDATE user SET driver_id=null WHERE id=${responsableId}`);

  return "OK";
}

///////////////////////////////////////////////////////////////////////////////
// RESPONSABLE ///////////////////////////////////////////////////////////////
async function selectResponsable(responsableId) {
  const conn = await connect();
  const [responsableResult] = await conn.query(
    `SELECT * FROM user WHERE id=${responsableId} AND user_type='responsable'`
  );

  if (!responsableResult.length) {
    return new Error({ codStatus: 422, message: "Responsábel não encontrado.", error: "" });
  }

  // PASSAGER //////////////////////////////////////////////////////////////////////////////////////////////////////
  const [routeRespPassagerResult] = await conn.query(
    `SELECT * FROM passager WHERE user_responsable_id=${responsableId}`
  );

  return { responsableResult: responsableResult[0], routeRespPassagerResult };
}

//////////////////////////////////////////////////////////////////////////////
export {
  createUser,
  selectRoute,
  routeList,
  routeDayList,
  pointList,
  routePassagerPointAdd,
  getUserByEmail,
  getUserByID,
  setUserToken,
  // routePointDelete,
  passagerList,
  routePassagerAdd,
  routePassagerPointDelete,
  routeCreate,
  routeDelete,
  respRouteList,
  userPointList,
  pointCreate,
  responsablesList,
  selectResponsable,
  responsableDelete,
  pointDelete,
  routePassagerSelect,
  selectRouteCalendar,
  addRouteCalendar,
  removeRouteCalendar,
};
