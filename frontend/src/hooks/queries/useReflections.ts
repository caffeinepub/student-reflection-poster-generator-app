import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Reflection } from '../../backend';

export function useGetReflections() {
  const { actor, isFetching } = useActor();

  return useQuery<Reflection[]>({
    queryKey: ['reflections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReflection();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveReflection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reflection: Reflection) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveReflection(reflection);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
    },
  });
}

export function useUpdateReflection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reflection: Reflection) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReflection(reflection);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
    },
  });
}
