import express, { urlencoded } from 'express'
import { validateTokenJWT } from './helpers/jwt.js';
import { loginUserService } from './service/loginUserService.js';
import cors from "cors";
import QRCode from 'qrcode';


const app = express();
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(
    cors({
        origin: "http://localhost:8100",
        methods: "GET, POST, PUT, DELETE",
        credentials: true,
        exposedHeaders: ["x-strao-update-data"]
    })
);

app.post("/check-login", async (req, res, next) => {
    const { token } = req.body;
    try {
        if (token) {
            const tokenValid = await validateTokenJWT(token);
            return res.status(200).send({ codStatus: 200, message: "OK" })
        } else {
            throw { codStatus: 422, error: "Token não enviado." }
        }
    } catch (error) {
        return res.status(error.codStatus || 500).send({
            codStatus: error.codStatus || 500,
            message: error.message || "[ROT]: Erro ao checar o token.",
            error: error.error
        })
    }
})

app.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (email && password) {
            const logedToken = await loginUserService({ email, password });
            return res.status(200).send({ codStatus: 200, message: "Login OK.", data: logedToken })
        } else {
            throw { codStatus: 422, error: "Usuário ou senha errado(s)." }
        }
    } catch (error) {
        return res.status(error.codStatus || 422).send({
            codStatus: error.codStatus || 500,
            message: error.message || "[ROT]: Erro ao efetuar o login.",
            error: error.error
        })
    }
})

app.get("/point-list/:userId", async (req, res, next) => {
    const { userId } = req.params;

    try {
        if (userId) {
            // const routeListData = await routeList(userId);

            // const routeInfo = routeListData.map((route) => {
            //     return {
            //         id: route.id,
            //         nome: route.name,
            //         photo: route.photo,
            //         boarding_point_amount: route.boarding_point.length,
            //         passager_amount: route.passager.length,
            //     }
            // })

            const routeInfo = [{ name: "Ponto1" }, { name: "Ponto2" }, { name: "Ponto3" }, { name: "Ponto4" }]

            return res.status(200).send({ codStatus: 200, message: "OK", data: routeInfo });
        } else {
            throw { codStatus: 422, error: "Id do usuário não é valido." }
        }
    } catch (error) {
        return res.status(error.codStatus || 422).send({
            codStatus: error.codStatus || 500,
            message: error.message || "[ROT]: Erro ao checar o token.",
            error: error.error
        })
    }
})

app.get("/day-route-list/:userId", async (req, res, next) => {
    const { userId } = req.params;

    try {
        // if (userId) {
        // const routeListData = await routeList(userId);

        // const routeInfo = routeListData.map((route) => {
        //     return {
        //         id: route.id,
        //         nome: route.name,
        //         photo: route.photo,
        //         boarding_point_amount: route.boarding_point.length,
        //         passager_amount: route.passager.length,
        //     }
        // })

        const routeDayList = [
            {
                id: 0,
                name: "Pedro H",
                photo: "./src/assets/img/ default.png",
                boarding_point: 0,
                landing_point: 0,
                passagers: 0,
                starthour: "07:00",
            },
            {
                id: 1,
                name: "Pedro Henrique de Assis ",
                photo: "default.png",
                boarding_point: 0,
                landing_point: 0,
                passagers: 0,
                starthour: "07:00",
            },
            {
                id: 2,
                name: "Assis Ferreira NAscimento",
                photo: "default.png",
                boarding_point: 0,
                landing_point: 0,
                passagers: 0,
                starthour: "07:00",
            },
            {
                id: 3,
                name: "Henrique de NAscimento",
                photo: "default.png",
                boarding_point: 0,
                landing_point: 0,
                passagers: 0,
                starthour: "07:00",
            },
        ]
        return res.status(200).send({ codStatus: 200, message: "OK", data: routeDayList });
        // } else {
        //     throw { codStatus: 422, error: "Id do usuário não é valido." }
        // }
    } catch (error) {
        return res.status(error.codStatus || 422).send({
            codStatus: error.codStatus || 500,
            message: error.message || "[ROT]: Erro ao checar o token.",
            error: error.error
        })
    }
})

app.get("/route-list/:userId", async (req, res, next) => {
    const { userId } = req.params;

    try {
        if (userId) {
            const routeListData = await routeList(userId);

            const routeInfo = routeListData.map((route) => {
                return {
                    id: route.id,
                    nome: route.name,
                    photo: route.photo,
                    boarding_point_amount: route.boarding_point.length,
                    passager_amount: route.passager.length,
                }
            })

            return res.status(200).send({ codStatus: 200, message: "OK", data: routeInfo });
        } else {
            throw { codStatus: 422, error: "Id do usuário não é valido." }
        }
    } catch (error) {
        return res.status(error.codStatus || 422).send({
            codStatus: error.codStatus || 500,
            message: error.message || "[ROT]: Erro ao checar o token.",
            error: error.error
        })
    }
})

app.get("/route/:routeId", async (req, res, next) => {
    const { routeId } = req.params;
    console.log({ routeId })
    const routeInfo = {
        id: 0,
        name: "routeData.name",
        photo: "routeData.photo",
        boarding_point_amount: [{
            id: "point.id",
            name: "point.name",
        }],
        passager_amount: [{
            id: "passager.id",
            name: "passager.name",
        }]
    }

    return res.status(200).send({ codStatus: 200, message: "OK", data: routeInfo });


    try {
        // if (userId) {
        //     const routeData = await routeRead(routeId);

        //     const routeInfo = {
        //         id: routeData.id,
        //         nome: routeData.name,
        //         photo: routeData.photo,
        //         boarding_point_amount: routeData.boarding_point.map((point) => {
        //             return {
        //                 id: point.id,
        //                 name: point.name,
        //             }
        //         }),
        //         passager_amount: routeData.passager.map((passager) => {
        //             return {
        //                 id: passager.id,
        //                 name: passager.name,
        //             }
        //         }),
        //     }

        //     return res.status(200).send({ codStatus: 200, message: "OK", data: routeInfo });
        // } else {
        //     throw { codStatus: 422, error: "Id dda rota não é valido." }
        // }
    } catch (error) {
        return res.status(error.codStatus || 422).send({
            codStatus: error.codStatus || 500,
            message: error.message || "[ROT]: Erro ao checar o token.",
            error: error.error
        })
    }
})

app.get("/qrcode/:responsableId", async (req, res, next) => {
    const { responsableId } = req.params;

    try {
        const generateQR = async (text) => {
            try {
                return await QRCode.toDataURL(text)
            } catch (err) {
                throw { codStatus: 422, error: "Erro ao gerar o QR Code." }
            }
        }

        const QRCodeInfo = await generateQR(responsableId);

        return res.status(200).send({ codStatus: 200, message: "OK", data: QRCodeInfo, responsableId });

    } catch (error) {
        return res.status(error.codStatus || 422).send({
            codStatus: error.codStatus || 500,
            message: error.message || "[ROT]: Não foi possivel gerar o QRCode.",
            error: error.error
        })
    }
})



app.listen(3000, () => {
    console.log("SERVER RUN PORT:3000")
},)
