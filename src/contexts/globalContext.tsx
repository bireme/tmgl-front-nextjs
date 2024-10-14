import {
  Children,
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

import { chdir } from "process";

interface IGlobalContextData {
  regionName: string;
  setRegionName: Dispatch<SetStateAction<string>>;
}

interface IGlobalProviderProps {
  children: ReactNode;
}

export const GlobalContext = createContext<IGlobalContextData>(
  {} as IGlobalContextData
);

export const GlobalProvider = ({ children }: IGlobalProviderProps) => {
  const [regionName, setRegionName] = useState<string>("");
  return (
    <GlobalContext.Provider value={{ regionName, setRegionName }}>
      {children}
    </GlobalContext.Provider>
  );
};
