import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

import { GlobalConfigAcf } from "@/services/types/globalAcf";

interface IGlobalContextData {
  regionName: string;
  setRegionName: Dispatch<SetStateAction<string>>;
  globalConfig?: GlobalConfigAcf;
  setGlobalConfig: Dispatch<SetStateAction<GlobalConfigAcf | undefined>>;
}

interface IGlobalProviderProps {
  children: ReactNode;
}

export const GlobalContext = createContext<IGlobalContextData>(
  {} as IGlobalContextData
);

export const GlobalProvider = ({ children }: IGlobalProviderProps) => {
  const [regionName, setRegionName] = useState<string>("");
  const [globalConfig, setGlobalConfig] = useState<GlobalConfigAcf | undefined>(
    undefined
  );
  return (
    <GlobalContext.Provider
      value={{ regionName, setRegionName, globalConfig, setGlobalConfig }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
