import mysql from "mysql2/promise";
import QRCode from "qrcode";
const global = {};

async function connect() {
  if (global.connection && global.connection.state !== "disconnected") {
    return global.connection;
  }
  const connection = await mysql.createConnection("mysql://root:root@127.0.0.1:3306/mobil");
  global.connection = connection;
  return connection;
}

///////////////////////////////////////////////////////////////////////////////
// ROUTE /////////////////////////////////////////////////////////////////////
async function selectRoute(routeId) {
  const conn = await connect();
  const [routeResults] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

  // BOARDING //////////////////////////////////////////////////////////////////////////////////////////////////////
  const [boadingPointsResult] = await conn.query(
    `SELECT point_id FROM route_points WHERE route_id=${routeId} AND type="boarding"`
  );

  const boardingPointsId = boadingPointsResult.length
    ? boadingPointsResult.reduce((prev, curr, idx) => {
      if (idx == 0) return curr.point_id;
      return prev + ", " + curr.point_id;
    }, "")
    : null;

  let boardingPointsInfo = [];
  if (boardingPointsId) {
    const [boardingPointsResult] = await conn.query(
      `SELECT id, name, maps, photo, name FROM point WHERE id IN ( ${boardingPointsId} )`
    );
    boardingPointsInfo = boardingPointsResult;
  }

  // LANDING //////////////////////////////////////////////////////////////////////////////////////////////////////
  const [landingPointResult] = await conn.query(
    `SELECT point_id FROM route_points WHERE route_id=${routeId} AND type="landing"`
  );

  const landingPointsIds = landingPointResult.length
    ? landingPointResult.reduce((prev, curr, idx) => {
      if (idx == 0) return curr.point_id;
      return prev + ", " + curr.point_id;
    }, "")
    : null;

  let landingPointsInfo = [];
  if (landingPointsIds) {
    const [landingPointsResults] = await conn.query(
      `SELECT id, name, maps, photo FROM point WHERE id IN( ${landingPointsIds} )`
    );
    landingPointsInfo = landingPointsResults;
  }

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

  return { route: routeResults[0], boardingPointsInfo, landingPointsInfo, respPassagerInfo };
}
async function routeList(userId) {
  const conn = await connect();
  console.log({ userId });
  QRCode.toDataURL("resp-add", function (err, url) {
    console.log(url);
  });

  const [routes] = await conn.query(`SELECT * FROM route WHERE user_id=${userId}`);

  const routeIds = routes.length
    ? routes.reduce((prev, curr, idx) => {
      if (idx == 0) return curr.id;
      return prev + ", " + curr.id;
    }, "")
    : null;

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

  return { routes, boardingPointRows, landingPointRows, routeRespPassagerRows };
}
async function routeCreate(routeName, userId, day) {
  const conn = await connect();
  const [route] = await conn.query(
    `SELECT * FROM route WHERE name='${routeName}' AND user_id='${userId}'`
  );

  if (route.length) {
    throw { codStatus: 422, message: "Esta rota existente.", error: "" };
  }

  let routeDay = null;
  if (day) {
    routeDay = new Date(day);
  } else {
    routeDay = Date.now();
  }
  console.log(routeDay);
  const [routeResult] = await conn.query(
    `INSERT INTO route (name, user_id, day) VALUES ('${routeName}',${userId}, ${routeDay})`
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
    `SELECT * FROM passager WHERE user_responsable_id IN (${responsableResultIds}) ${respPassagerIds ? "AND id NOT IN (" + respPassagerIds + ")" : ""
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
async function routePassagerDelete(routeId, passagerId, type) {
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
    `DELETE FROM route_passagers WHERE route_id=${routeId} AND passager_id='${passagerId}'`
  );

  return pointResult;
}
// ROUTE POINTS
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
    `SELECT id, name, photo FROM point WHERE user_id=${userId} ${routePointIds ? `AND id NOT IN (${routePointIds})` : ""
    }`
  );

  return pointResult;
}
async function routePointAdd(routeId, pointId, type) {
  const conn = await connect();

  const [route] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

  if (!route.length) {
    throw { codStatus: 422, message: "Rota não encontrada", error: "" };
  }

  const [routePointExists] = await conn.query(
    `SELECT point_id FROM route_points WHERE route_id=${routeId} AND point_id=${pointId} AND type='${type}'`
  );

  if (routePointExists.length) {
    throw { codStatus: 422, message: `Este ponto ja foi adicionado a ${type}`, error: "" };
  }

  const [pointResult] = await conn.query(
    `INSERT INTO route_points (route_id, point_id, type) VALUES (${routeId}, ${pointId}, '${type}')`
  );

  return pointResult;
}
async function routePointDelete(routeId, pointId, type) {
  const conn = await connect();

  const [route] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

  if (!route.length) {
    throw { codStatus: 422, message: "Rota não encontrada", error: "" };
  }

  const [routePointExists] = await conn.query(
    `SELECT point_id FROM route_points WHERE route_id=${routeId} AND point_id=${pointId} AND type='${type}'`
  );

  if (!routePointExists.length) {
    throw { codStatus: 422, message: `Este ponto não existe na rota do tipo ${type}.`, error: "" };
  }

  const [pointResult] = await conn.query(
    `DELETE FROM route_points WHERE route_id=${routeId} AND point_id=${pointId} AND type='${type}'`
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
      console.log(route.route_id);

      return route.route_id;
    })
  );

  /*






 */

  console.log("OK", routeIds);

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
async function responsablePassagerSelect(responsableId, passagerId) {
  const conn = await connect();

  const [passager] = await conn.query(`SELECT * FROM passager WHERE id=${passagerId} AND user_responsable_id=${responsableId}`);

  if (!passager.length) {
    return new Error({ codStatus: 422, message: "Passageiro não encontrado.", error: "" });
  }

  // PASSAGER ROUTE
  const [routePassagerPoints] = await conn.query(`SELECT * FROM route_passagers WHERE passager_id=${passagerId}`);
  const routesIds = routePassagerPoints.reduce((prev, route, idx) => {
    if (idx == 0) return route.route_id;
    return prev += ", " + route.route_id;
  }, "");

  let passagerRoutes = []
  if (routesIds.length) {
    const [routes] = await conn.query(`SELECT * FROM route WHERE id IN (${routesIds})`)
    passagerRoutes = routes;
  }

  // console.log({ passagerRoutes })

  // const routePassagers = routePassagerPoints.reduce((prev, passager, idx) => { }, [])

  const routePassagersPointIds = routePassagerPoints.reduce((prev, passager, idx) => {
    if (passager.boarding_point_id == null && passager.landing_point_id == null) {
      return prev;
    }

    if (passager.boarding_point_id) {
      const boarding = prev.find((p) => p == passager.boarding_point_id)
      if (!boarding) {
        prev.push(passager.boarding_point_id)
      }
    }

    if (passager.landing_point_id) {
      const landing = prev.find((p) => p == passager.landing_point_id)
      if (landing) {
        if (!prev.find((p) => { p == passager.landing_point_id })) {
          prev.push(passager.landing_point_id)
        }
      }
    }

    return prev

  }, []);

  console.log({ routePassagersPointIds })




  let boardingPoints = []
  if (routePassagersPointIds.boardingPoints) {
    const [pointsFind] = await conn.query(
      `SELECT * FROM point WHERE id IN ('${routePassagersPointIds}')`
    );
    boardingPoints = pointsFind;
  }
  let landingPoints = []
  if (routePassagersPointIds.landingPoints) {
    const [pointsFind] = await conn.query(
      `SELECT * FROM point WHERE id IN ('${routePassagersPointIds}')`
    );
    landingPoints = pointsFind;
  }

  return { passager: passager[0], boardingPoints, landingPoints };
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
  selectRoute,
  routeList,
  pointList,
  routePointAdd,
  getUserByEmail,
  getUserByID,
  setUserToken,
  routePointDelete,
  passagerList,
  routePassagerAdd,
  routePassagerDelete,
  routeCreate,
  routeDelete,
  respRouteList,
  userPointList,
  pointCreate,
  responsablesList,
  selectResponsable,
  responsableDelete,
  pointDelete,
  responsablePassagerSelect
};
