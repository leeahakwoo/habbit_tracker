// User Profile Type
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Habit Type
export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly'; // 습관의 빈도
  goal_value: number; // 목표 값 (예: 주당 5일)
  category?: string; // 습관 카테고리 (예: health, study, work)
  color?: string; // UI 표시용 색상
  created_at: string;
  updated_at: string;
  deleted_at?: string; // Soft delete
}

// Habit Log Type
export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD 형식
  status: 'none' | 'partial' | 'completed'; // 'none': 기록 없음, 'partial': 부분 성공, 'completed': 완료
  notes?: string; // 메모 (optional)
  created_at: string;
  updated_at: string;
}

// Authentication Type
export interface AuthSession {
  user: {
    id: string;
    email: string;
  };
}
