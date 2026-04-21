/**
 * Supabase Database Types
 * 데이터베이스 테이블의 TypeScript 타입 정의
 */

// ============================================================================
// User Profiles
// ============================================================================
export interface UserProfile {
  id: string; // UUID (auth.users.id)
  avatar_url?: string | null;
  bio?: string | null;
  theme: 'light' | 'dark';
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

// ============================================================================
// Habits
// ============================================================================
export interface Habit {
  id: string; // UUID
  user_id: string; // UUID (auth.users.id)
  name: string;
  frequency: 'daily' | 'weekly'; // 향후 'monthly' 등 확장 가능
  goal_value: number;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

export interface CreateHabitInput {
  name: string;
  frequency?: 'daily' | 'weekly';
  goal_value?: number;
}

export interface UpdateHabitInput {
  name?: string;
  frequency?: 'daily' | 'weekly';
  goal_value?: number;
}

// ============================================================================
// Habit Logs (일별 기록)
// ============================================================================
export interface HabitLog {
  id: string; // UUID
  habit_id: string; // UUID
  user_id: string; // UUID (auth.users.id)
  date: string; // YYYY-MM-DD format
  status: 'none' | 'partial' | 'completed';
  created_at: string; // ISO 8601 timestamp
}

export interface CreateHabitLogInput {
  habit_id: string;
  date: string; // YYYY-MM-DD format
  status: 'none' | 'partial' | 'completed';
}

export interface UpdateHabitLogInput {
  status: 'none' | 'partial' | 'completed';
}

// ============================================================================
// 통계 및 집계 타입
// ============================================================================

/**
 * 습관의 스트릭 정보
 * - currentStreak: 현재 연속된 완료 일수
 * - longestStreak: 최장 연속 완료 일수
 * - totalCompletions: 총 완료 횟수
 * - completionRate: 완료율 (%)
 */
export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0-100
  lastCompletedDate?: string; // YYYY-MM-DD format
}

/**
 * 사용자의 주간 통계
 */
export interface WeeklyStats {
  week: string; // YYYY-Www format (ISO 8601)
  habits: {
    habitId: string;
    name: string;
    completions: number; // 주간 완료 횟수
    targetCompletions: number; // 목표 횟수
  }[];
  totalCompletionRate: number; // 0-100
}

// ============================================================================
// 데이터베이스 응답 타입
// ============================================================================

export interface DatabaseResponse<T> {
  data: T;
  error: null;
}

export interface DatabaseError {
  data: null;
  error: {
    message: string;
    status?: number;
  };
}

export type DatabaseResult<T> = DatabaseResponse<T> | DatabaseError;
