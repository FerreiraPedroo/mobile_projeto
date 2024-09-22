import React, { createContext, ReactElement, ReactEventHandler, useEffect, useState } from "react";
import { Storage } from "@ionic/storage";

interface IUserInfo {
    userId: number | null
    userName: string | null
    token: string | null
}

interface IUserContext {
    userInfo: IUserInfo
    changeUserInfo: any
}

const ContextAppInfo = createContext<IUserContext>({ changeUserInfo: () => null, userInfo: { userId: null, userName: null, token: null } })

const newStorage = new Storage({
    name: "mobildb",
})

function AppContext({ children }: { children: ReactElement }) {
    const [userInfo, setUserInfo] = useState({ userId: null, userName: null, token: null })

    async function changeUserInfo(info: IUserInfo) {
        const storage = await newStorage.create();

        const storedUserInfo = await storage.set("userInfo", info);

        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
        } else {
            setUserInfo({ userId: null, userName: null, token: null });
        }
    }
    console.log({sotrage: userInfo})
    useEffect(() => {
        async function loadStoreUserInfo() {
            const storage = await newStorage.create();
            const storedUserInfo = await storage.get("userInfo");

            if (storedUserInfo) {
                setUserInfo(storedUserInfo);
            } else {
                setUserInfo({ userId: null, userName: null, token: null });
            }
        }
        loadStoreUserInfo()
    }, [])

    return (
        <ContextAppInfo.Provider value={{ changeUserInfo, userInfo }}>
            {children}
        </ContextAppInfo.Provider>
    )
}



export { AppContext, ContextAppInfo };