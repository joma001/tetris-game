import { useState, useEffect, useCallback } from 'react';
import type { LeaderboardEntry } from '../types';
import { getLeaderboard, submitScore } from '../lib/supabase';

interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  submitPlayerScore: (
    playerName: string,
    score: number,
    lines: number,
    level: number
  ) => Promise<LeaderboardEntry | null>;
  refreshLeaderboard: () => Promise<void>;
  getRank: (score: number) => number;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLeaderboard(100);
      setLeaderboard(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard]);

  const submitPlayerScore = useCallback(
    async (
      playerName: string,
      score: number,
      lines: number,
      level: number
    ): Promise<LeaderboardEntry | null> => {
      try {
        const entry = await submitScore(playerName, score, lines, level);
        await refreshLeaderboard();
        return entry;
      } catch (err) {
        console.error('Failed to submit score:', err);
        return null;
      }
    },
    [refreshLeaderboard]
  );

  const getRank = useCallback(
    (score: number): number => {
      const rank = leaderboard.findIndex((entry) => score > entry.score);
      if (rank === -1) {
        return leaderboard.length + 1;
      }
      return rank + 1;
    },
    [leaderboard]
  );

  return {
    leaderboard,
    isLoading,
    error,
    submitPlayerScore,
    refreshLeaderboard,
    getRank,
  };
}
