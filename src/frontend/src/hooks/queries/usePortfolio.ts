import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PortfolioItem, Reflection, Template } from "../../backend";
import { useActor } from "../useActor";

export function useGetPortfolio() {
  const { actor, isFetching } = useActor();

  return useQuery<PortfolioItem[]>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPortfolio();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGeneratePoster() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reflection,
      templateId,
      hashtags,
    }: {
      reflection: Reflection;
      templateId: bigint;
      hashtags: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generatePoster(reflection, templateId, hashtags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}
