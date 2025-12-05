import { useCallback, useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import Head from "next/head";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";

export default function CustomRoute() {
  const router = useRouter();
  const {
    query: { customRoute },
  } = router;
  const { globalConfig } = useContext(GlobalContext);
  const [fixedPath, setFixedPath] = useState("");

  const fixRouter = () => {
    const fullRoute = router.asPath;
    const path = fullRoute.split("/");
    if (
      globalConfig?.acf.regionais?.find(
        (region) => region.rest_api_prefix.toLocaleLowerCase() == path[0]
      )
    ) {
      let aux = path[0];
      path.splice(0);
      router.push(`${path[0]}/content/${path.join("/")}`);
    } else {
      router.push(`/content/${path[path.length - 1]}`);
      setFixedPath(`/content/${path[path.length - 1]}`);
    }
  };

  useEffect(() => {
    fixRouter();
  }, [customRoute]);

  return (
    <>
      <Head>
        <title>Loading - The WHO Traditional Medicine Global Library</title>
      </Head>
      <LoadingOverlay visible={true} />
    </>
  );
}
