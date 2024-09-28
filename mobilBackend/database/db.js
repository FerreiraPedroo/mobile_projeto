import mysql from 'mysql2/promise'

const global = {};

async function connect() {
    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection
    }
    const connection = await mysql.createConnection("mysql://root:root@127.0.0.1:3306/mobil");
    global.connection = connection;
    return connection;
}

async function selectRoute(routeId) {
    const conn = await connect();
    const [route] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

    // BOARDING
    const [boardingPoint] = await conn.query(`SELECT point_id FROM route_points WHERE route_id=${routeId} AND type="boarding"`);
    const boardingPointsId = boardingPoint.length ? boardingPoint.join(",") : null;

    let boardingPointsInfo = [];
    if (boardingPointsId) {
        const [boardingPointsRows] = await conn.query(`SELECT id, name, photo, name FROM point WHERE id IN('${boardingPointsId}')`)
        boardingPointsInfo = boardingPointsRows;
    }
    console.log(boardingPointsId)
    // LANDING
    const [landingPoint] = await conn.query(`SELECT point_id FROM route_points WHERE route_id=${routeId} AND type="landing"`);
    const landingPointsIds = landingPoint.length ? landingPoint.join(",") : null;

    let landingPointsInfo = [];
    if (landingPointsIds) {
        const [landingPointsRows] = await conn.query(`SELECT id, name, photo, name FROM point WHERE id IN('${landingPointsIds}')`)
        landingPointsInfo = landingPointsRows;
    }

    // PASSAGER
    const [routeRespPassagerRows] = await conn.query(`SELECT responsable_passager_id FROM route_responsable_passager WHERE route_id=${routeId}`);
    const respPassagerIds = routeRespPassagerRows.length ? routeRespPassagerRows.join(",") : null;

    let respPassagerInfo = [];
    if (respPassagerIds) {
        const [passagerRows] = await conn.query(`SELECT * FROM responsable_passager WHERE id IN('${respPassagerIds}')`)
        respPassagerInfo = passagerRows;
    }

    return { route: route[0], boardingPointsInfo, landingPointsInfo, respPassagerInfo };
}

async function routeList(userId) {
    const conn = await connect();
    console.log({userId})
    const [routes] = await conn.query(`SELECT * FROM route WHERE user_id=${userId}`);
    const routeIds = routes.map(route => route.id).join(",");


    // BOARDING
    const [boardingPointRows] = await conn.query(`SELECT point_id FROM route_points WHERE route_id in (${routeIds}) AND type="boarding"`);
    // LANDING
    const [landingPointRows] = await conn.query(`SELECT point_id FROM route_points WHERE route_id in (${routeIds}) AND type="landing"`);
    // PASSAGER
    const [routeRespPassagerRows] = await conn.query(`SELECT responsable_passager_id FROM route_responsable_passager WHERE route_id in (${routeIds})`);

    return { routes, boardingPointRows, landingPointRows, routeRespPassagerRows }
}

async function pointList(routeId) {
    const conn = await connect();
    const [route] = await conn.query(`SELECT * FROM route WHERE id=${routeId}`);

    if (!route.length) {
        throw { codStatus: 422, message: "Rota não encontrada", error: "" };
    }

    // BOARDING
    const [boardingPoint] = await conn.query(`SELECT point_id FROM route_points WHERE route_id=${routeId} AND type="boarding"`);
    const boardingPointsId = boardingPoint.length ? boardingPoint.join(",") : null;

    let boardingPointsInfo = [];
    if (boardingPointsId) {
        const [boardingPointsRows] = await conn.query(`SELECT id, name, photo, name FROM point WHERE id IN('${boardingPointsId}')`)
        boardingPointsInfo = boardingPointsRows;
    }

}


// USER ///////////////////////////////////////////////////////////////
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
    console.log(user)
    if (!user.length) {
        return new Error({ codStatus: 422, message: "Usuario não encontrado.", error: "" });
    }

    return user[0];
}
async function setUserToken(userId, token) {
    console.log(`UPDATE user SET token='${token}' WHERE id=${userId}`)
    const conn = await connect();
    await conn.query(`UPDATE user SET token='${token}' WHERE id=${userId}`);
    
    return true;
}

////////////////////////////////////////////////////////////////////////
export { selectRoute, routeList, pointList, getUserByEmail, getUserByID, setUserToken }