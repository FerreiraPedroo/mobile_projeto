import { createTokenJWT } from "../helpers/jwt.js";

export async function loginUserService({ email, password }) {
	try {
		///////////////////////////////////////////////////////////////////////////////////////////
		// Obter os dados do usuário pelo email do login.
		const user = await checkLoginUser(email, password);

		if (!user) {
			throw { codStatus: 401, error: "Usuário ou senha errados." };
		}

		///////////////////////////////////////////////////////////////////////////////////////////
		// Pega a chave de identificação e gera o token de identificação do usuário.
		const userAuthToken = await createTokenJWT(user.id);

		const logedToken = {
			token: userAuthToken
		};

		return logedToken;
	} catch (error) {
		throw {
			codStatus: error.codStatus || 500,
			message: "[SER]: Erro ao efetuar o login.",
			error: error.error
		};

	}
}
