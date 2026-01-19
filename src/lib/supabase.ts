import type { LeaderboardEntry } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabase: any = null;

async function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!supabase) {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

export async function submitScore(
  playerName: string,
  score: number,
  lines: number,
  level: number
): Promise<LeaderboardEntry | null> {
  const client = await getSupabaseClient();
  
  if (!client) {
    return saveToLocalStorage(playerName, score, lines, level);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client
    .from('scores')
    .insert([{ player_name: playerName, score, lines, level }]) as any)
    .select()
    .single();

  if (error) {
    console.error('Error submitting score:', error);
    return saveToLocalStorage(playerName, score, lines, level);
  }

  return data;
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const client = await getSupabaseClient();
  
  if (!client) {
    return getFromLocalStorage();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit) as any);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return getFromLocalStorage();
  }

  return data || [];
}

function saveToLocalStorage(
  playerName: string,
  score: number,
  lines: number,
  level: number
): LeaderboardEntry {
  const entry: LeaderboardEntry = {
    id: crypto.randomUUID(),
    player_name: playerName,
    score,
    lines,
    level,
    created_at: new Date().toISOString(),
  };

  const existing = getFromLocalStorage();
  existing.push(entry);
  existing.sort((a, b) => b.score - a.score);
  const top100 = existing.slice(0, 100);
  localStorage.setItem('tetris_leaderboard', JSON.stringify(top100));

  return entry;
}

function getFromLocalStorage(): LeaderboardEntry[] {
  const stored = localStorage.getItem('tetris_leaderboard');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}
