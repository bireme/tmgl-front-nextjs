import { repositoryHandler } from "@/server/repositoryApi";

export default repositoryHandler({ endpoint: "event/v1", keyEnv: "BVSALUD_API_KEY", sort: "created_date DESC" });
