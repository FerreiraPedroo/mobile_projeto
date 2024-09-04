import jwt from "jsonwebtoken";
/**
 * Cria um JWT apartir do texto
 * @param {*} text
 * @returns
 */
export async function createTokenJWT(text) {
	const tokenJWT = jwt.sign({ token: text }, "SECRET", { expiresIn: 99936000 });
	return tokenJWT;
}

/**
 * Verifica se o token é válido
 * @param {String} token
 * @returns JWT Decoded
 */
export async function validateTokenJWT(token) {
	const tokenEncoded = token;

	try {
		jwt.verify(tokenEncoded, "SECRET", (err, decodec) => {
			if (err) throw { codStatus: 401, error: "Token de acesso expirado." };
		});

		const tokenDecoded = jwt.decode(tokenEncoded);

		return tokenDecoded;
	} catch (error) {
		throw { codStatus: 401, message: "Erro interno generalizado do servidor.", error };
	}
}
