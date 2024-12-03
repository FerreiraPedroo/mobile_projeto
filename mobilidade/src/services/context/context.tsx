import React, {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useLayoutEffect,
  useState,
} from "react";
import { Storage } from "@ionic/storage";

interface IUserInfo {
  userId: number | null;
  userName: string | null;
  token: string | null;
  type: string | null;
}

interface IUserContext {
  userInfo: IUserInfo;
  changeUserInfo: any;
  updatePage: boolean;
  setUpdatePage: Dispatch<SetStateAction<boolean>>;
}

const ContextAppInfo = createContext<IUserContext>({
  changeUserInfo: () => null,
  userInfo: { userId: null, userName: null, token: null, type: null },
  updatePage: false,
  setUpdatePage: () => null,
});

const newStorage = new Storage({
  name: "mobildb",
});

function AppContext({ children }: { children: ReactElement }) {
  const [userInfo, setUserInfo] = useState({
    userId: null,
    userName: null,
    token: null,
    type: null,
  });
  const [updatePage, setUpdatePage] = useState(false);

  async function changeUserInfo(info: IUserInfo) {
    const storage = await newStorage.create();
    const storedUserInfo = await storage.set("userInfo", info);
    setUserInfo(storedUserInfo);
  }

  useLayoutEffect(() => {
    async function loadStoreUserInfo() {
      const storage = await newStorage.create();
      const storedUserInfo = await storage.get("userInfo");

      if (storedUserInfo) {
        setUserInfo(storedUserInfo);
      } else {
        setUserInfo({ userId: null, userName: null, token: null, type: null });
      }
    }
    loadStoreUserInfo();
  }, []);

  return (
    <ContextAppInfo.Provider value={{ changeUserInfo, userInfo, updatePage, setUpdatePage }}>
      {children}
    </ContextAppInfo.Provider>
  );
}

export { AppContext, ContextAppInfo };
