import { repositoryHandler } from "@/server/repositoryApi";

export default repositoryHandler({ endpoint: "resource/v1", keyEnv: "BVSALUD_API_KEY", items: true });
