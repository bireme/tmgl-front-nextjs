import { repositoryHandler } from "@/server/repositoryApi";

export default repositoryHandler({ baseEnv: "LIS_API_URL", keyEnv: "DIREV_API_KEY" });
