import { repositoryHandler } from "@/server/repositoryApi";

export default repositoryHandler({ endpoint: "leisref/v1", keyEnv: "BVSALUD_API_KEY", items: true });
