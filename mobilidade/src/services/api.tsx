
interface Data {
    token: string
}

export async function apiCheckLoginToken(data: Data) {
    const response = await fetch("http://127.0.0.1:3000/check-login", {
        method: "POST",
        body: JSON.stringify(data),
    });

    const dataReturn = await response.json();

    return dataReturn;

}