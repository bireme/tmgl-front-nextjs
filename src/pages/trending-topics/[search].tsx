import { useRouter } from "next/router";

export default function TrendingTopicsSearch() {
  const router = useRouter();
  const {
    query: { search },
  } = router;
  return <>teste</>;
}
