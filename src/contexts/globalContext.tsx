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
  countryName: string;
  setCountryName: Dispatch<SetStateAction<string>>;
  globalConfig?: GlobalConfigAcf;
  setGlobalConfig: Dispatch<SetStateAction<GlobalConfigAcf | undefined>>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
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
  const [language, setLanguage] = useState<string>("en");
  const [countryName, setCountryName] = useState<string>("");
  return (
    <GlobalContext.Provider
      value={{
        regionName,
        countryName,
        setCountryName,
        setRegionName,
        globalConfig,
        setGlobalConfig,
        language,
        setLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
