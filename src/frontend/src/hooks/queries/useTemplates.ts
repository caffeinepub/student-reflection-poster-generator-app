import { useQuery } from "@tanstack/react-query";
import type { Template } from "../../backend";
import { getTemplateMetadata } from "../../lib/templates/catalog";
import { useActor } from "../useActor";

export function useGetTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      if (!actor) return [];
      const backendTemplates = await actor.getTemplates();

      // If backend has no templates, use local catalog
      if (backendTemplates.length === 0) {
        return getTemplateMetadata();
      }

      return backendTemplates;
    },
    enabled: !!actor && !isFetching,
  });
}
