import { repositoryHandler } from "@/server/repositoryApi";

export default repositoryHandler({ baseEnv: "FIADMIN_URL", endpoint: "multimedia", sort: "created_date desc" });
