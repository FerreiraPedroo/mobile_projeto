
interface Data {
    token: string
}

export async function apiCheckLoginToken(data: Data) {
    const response = await fetch("https://localhost/check-login", {
        method: "POST",
        body: JSON.stringify(data),
    });

    const dataReturn = await response.json();

    return dataReturn;

}