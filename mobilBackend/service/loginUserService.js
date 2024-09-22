import { getUserByEmail, getUserByID, setUserToken } from "../database/db.js";
import { createTokenJWT } from "../helpers/jwt.js";

export async function loginUserService({ user, password }) {
	try {
		///////////////////////////////////////////////////////////////////////////////////////////
		// Obter os dados do usuário pelo email do login.
		const userInfo = await getUserByEmail(user);
		if (!userInfo) {
			throw { codStatus: 401, error: "Usuário ou senha errados." };
		}

		///////////////////////////////////////////////////////////////////////////////////////////
		// Pega a chave de identificação e gera o token de identificação do usuário.
		const userAuthToken = await createTokenJWT(userInfo.id);

		await setUserToken(userInfo.id, userAuthToken)

		const logedToken = {
			userId: userInfo.id,
			userName: userInfo.name,
			token: userAuthToken
		};

		return logedToken;
	} catch (error) {
		throw {
			codStatus: error.codStatus || 500,
			message: "[SER]: Erro ao efetuar o login.",
			error: error.error || error.message
		};

	}
}
