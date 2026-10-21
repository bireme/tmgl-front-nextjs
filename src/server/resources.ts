import axios from "axios";
import type { GetServerSideProps } from "next";
import { decryptFromEnv } from "@/helpers/crypto";
import type { EvidenceMapApiResponseDto, EvidenceMapItemDto } from "@/services/types/evidenceMapsDto";
import type { JournalItemDto, JournalsApiResponseDto } from "@/services/types/journalsDto";
import type { RepositoryApiResponse } from "@/services/types/repositoryTypes";
import { parseCountriesByAttr, parseJournalCountries, parseMultLangStringAttr, parseThematicAreabyAttr } from "@/services/apiRepositories/utils";

export interface ResourcePageProps<T> { initialItem: T }

/** Fetch upstream directly: never depend on the incoming host or a browser-only API. */
export function resourcePageProps(kind: "resource" | "title"): GetServerSideProps {
  return async ({ params }) => {
    const id = params?.id;
    if (typeof id !== "string" || !/^\d+$/.test(id)) return { notFound: true };
    if (!process.env.BVSALUD_URL || !process.env.BVSALUD_API_KEY) {
      throw new Error("BVS resource configuration is incomplete");
    }
    const api = axios.create({
      baseURL: `${process.env.BVSALUD_URL.replace(/\/$/, "")}/${kind}/v1/`,
      headers: { apiKey: decryptFromEnv(process.env.BVSALUD_API_KEY) },
      timeout: 30000,
    });
    let item: EvidenceMapItemDto | JournalItemDto;
    try {
      if (kind === "resource") {
        const { data } = await api.get<EvidenceMapApiResponseDto>(`${id}/`, { params: { format: "json", lang: "en" } });
        if (!data?.title) throw new Error("Invalid evidence map response");
        item = {
          id: String(data.id), title: data.title, excerpt: data.abstract,
          links: data.link, created_at: new Date(data.created_time), updated_at: new Date(data.updated_time),
          countries: parseCountriesByAttr(data.publication_country),
          areas: parseThematicAreabyAttr(data.thematic_areas),
          descriptors: data.descriptors?.map((descriptor) => descriptor.text),
        };
      } else {
        const [{ data }, { data: search }] = await Promise.all([
          api.get<JournalsApiResponseDto>(`${id}/`, { params: { format: "json", lang: "en" } }),
          api.get<RepositoryApiResponse["data"]>("search/", { params: { fq: `django_id:${id}`, count: 1, start: 0, q: "*:*", lang: "en" } }),
        ]);
        const doc = search?.diaServerResponse?.[0]?.response?.docs?.[0];
        if (!data?.title || !doc) throw new Error("Invalid journal response");
        item = {
          id: String(data.id_number), title: data.title, excerpt: doc.abstract,
          links: doc.link, logo: doc.logo_image_file, issn: data.issn,
          responsibility_mention: data.responsibility_mention,
          created_at: new Date(data.created_time), updated_at: new Date(data.updated_time),
          descriptors: data.descriptors || doc.descriptor, countries: parseJournalCountries(doc),
          description: doc.description ? parseMultLangStringAttr(doc.description) : undefined,
          coverage: data.initial_date || data.final_date ? `${data.initial_date || ""}-${data.final_date || ""}` : undefined,
          language: doc.language?.flatMap((entry) => entry.split("|").map((part) => {
            const [lang, content] = part.split("^");
            return { lang, content: content || "" };
          })),
        };
      }
    } catch (error) {
      // Only a confirmed missing upstream record is a 404; outages remain 5xx.
      if (axios.isAxiosError(error) && error.response?.status === 404) return { notFound: true };
      throw error;
    }
    // Next.js page props cannot contain Dates or undefined properties.
    return { props: { initialItem: JSON.parse(JSON.stringify(item)) } };
  };
}
