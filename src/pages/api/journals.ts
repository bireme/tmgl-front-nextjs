import { repositoryHandler } from "@/server/repositoryApi";

export default repositoryHandler({ endpoint: "title/v1", keyEnv: "BVSALUD_API_KEY", items: true });
