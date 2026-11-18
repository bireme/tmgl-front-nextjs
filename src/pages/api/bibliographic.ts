import { repositoryHandler } from "@/server/repositoryApi";

export default repositoryHandler({ endpoint: "bibliographic/v1", keyEnv: "BVSALUD_API_KEY", items: true });
