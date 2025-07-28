import { GlobalConfigAcf } from "@/services/types/globalAcf";
import { GlobalConfigAcfSchema } from "@/services/globalConfig/GlobalConfigZodSchema";
import { GlobalConfigApi } from "@/services/globalConfig/GlobalConfigApi";
import { GlobalContext } from "./globalContext";
import { useContext } from "react";
import { useEffect } from "react";
import useSWR from "swr";

const fetchGlobalConfig = async (): Promise<GlobalConfigAcf> => {
  console.log("Fetching global config from API or cache");
  const cached = localStorage.getItem("globalConfig");
  if (cached) {
    console.log("Using cached global config");
    try {
      const parsed = JSON.parse(cached);
      const validated = GlobalConfigAcfSchema.parse(parsed); // lança se for inválido
      return validated;
    } catch (e) {
      console.warn("Invalid cached global config:", e);
      localStorage.removeItem("globalConfig");
    }
  }
  console.log("Fetching global config from API");
  const _configApi = new GlobalConfigApi();
  try {
    const data = await _configApi.getGlobalConfig();
    localStorage.setItem("globalConfig", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching global config:", error);
    throw new Error("Failed to fetch global config");
  }
};

export const GlobalConfigLoader = () => {
  const { setGlobalConfig } = useContext(GlobalContext);
  console.log("Loading global config...");
  const { data } = useSWR("globalConfig", fetchGlobalConfig, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 60 * 6, // 6 horas
  });

  useEffect(() => {
    if (data) {
      setGlobalConfig(data);
    }
  }, [data]);

  return null; // esse componente não renderiza nada visível
};
