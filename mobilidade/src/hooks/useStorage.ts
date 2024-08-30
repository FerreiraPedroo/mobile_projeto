import { Storage } from "@ionic/storage";
import { useEffect, useState } from "react";
export interface RouteList {
  id: number;
  name: string;
  photo: string;
  boarding_point_amount: number;
  passager_amount: number;
}

export interface ResponsableList {
  id: number;
  name: string;
  photo: string;
  boarding_point_amount: number;
  passager_amount: number;
}

export function useStorage() {
  const [store, setStore] = useState<Storage>();
  const [loginToken, setLoginToken] = useState<String>("return");
  const [routeList, setRouteList] = useState<RouteList[]>([]);
  const [responsableList, setResponsableList] = useState<ResponsableList[]>([]);

  useEffect(() => {
    const initStorage = async () => {
      const newStore = new Storage({
        name: "mobildb",
      });
      const createdStore = await newStore.create();
      setStore(createdStore);

      const storedLoginToken = await createdStore.get("logintoken" || []);
      setLoginToken(storedLoginToken);

      const storedRouteList = await createdStore.get("routelist" || []);
      setRouteList(storedRouteList);

      const storedResponsableList = await createdStore.get("responsablelist" || []);
      setResponsableList(storedResponsableList);
    };

    initStorage();
  }, []);

  return { loginToken, routeList, responsableList };
}
