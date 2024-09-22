import React, { createContext, ReactElement, ReactEventHandler, useState } from "react";

interface IuserInfo {
    userInfo: {
        userId: number | null
        userName: string | null
        token: string | null
    }
    setUserInfo: React.Dispatch<React.SetStateAction<{ userId: null; userName: null; token: null; }>>
}

const ContextAppInfo = createContext<IuserInfo>({ setUserInfo: () => { return }, userInfo: { userId: null, userName: null, token: null } })

function AppContext({ children }: { children: ReactElement }) {
    const [userInfo, setUserInfo] = useState({ userId: null, userName: null, token: null })

    return (
        <ContextAppInfo.Provider value={{ setUserInfo, userInfo }}>
            {children}
        </ContextAppInfo.Provider>
    )
}



export { AppContext, ContextAppInfo };