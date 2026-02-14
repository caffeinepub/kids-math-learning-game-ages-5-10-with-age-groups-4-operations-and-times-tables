import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { GameType, AgeGroup, UserProfile, Difficulty } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      gameType: GameType;
      ageGroup: AgeGroup;
      correct: number;
      total: number;
      stars: number;
      difficulty: Difficulty;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitResult(
        params.gameType,
        params.ageGroup,
        BigInt(params.correct),
        BigInt(params.total),
        BigInt(params.stars),
        params.difficulty
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressSummary'] });
    },
  });
}

export function useGetProgressSummary() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['progressSummary'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProgressSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePracticeStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { table: number; correct: number; attempts: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePracticeStats(
        BigInt(params.table),
        BigInt(params.correct),
        BigInt(params.attempts)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesTableSummary'] });
    },
  });
}

export function useGetTimesTableSummary() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['timesTableSummary'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTimesTableSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEarnedReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { difficulty: Difficulty; reward: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEarnedReward(params.difficulty, params.reward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['earnedRewards'] });
    },
  });
}

export function useGetEarnedRewards(difficulty: Difficulty) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['earnedRewards', difficulty],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEarnedRewards(difficulty);
    },
    enabled: !!actor && !isFetching,
  });
}
