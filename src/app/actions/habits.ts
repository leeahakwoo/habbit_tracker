'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateHabitInput, UpdateHabitInput, Habit, HabitLog } from '@/types/database';
import { getCurrentUser } from './auth';

/**
 * 모든 습관 조회
 * @returns 사용자의 모든 습관
 */
export async function getHabits() {
  const supabase = await createClient();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: '로그인이 필요합니다.',
        habits: [],
      };
    }

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        message: error.message,
        habits: [],
      };
    }

    return {
      success: true,
      habits: data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      habits: [],
    };
  }
}

/**
 * 습관 생성
 * @param input - 습관 정보
 * @returns 생성된 습관
 */
export async function createHabit(input: CreateHabitInput) {
  const supabase = await createClient();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: '로그인이 필요합니다.',
      };
    }

    if (!input.name || input.name.trim() === '') {
      return {
        success: false,
        message: '습관 이름은 필수입니다.',
      };
    }

    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: user.id,
          name: input.name.trim(),
          frequency: input.frequency || 'daily',
          goal_value: input.goal_value || 1,
        },
      ])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: '습관이 생성되었습니다.',
      habit: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 습관 업데이트
 * @param habitId - 습관 ID
 * @param input - 업데이트할 정보
 * @returns 업데이트된 습관
 */
export async function updateHabit(habitId: string, input: UpdateHabitInput) {
  const supabase = await createClient();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: '로그인이 필요합니다.',
      };
    }

    // 습관 소유자 확인
    const { data: habit } = await supabase
      .from('habits')
      .select('user_id')
      .eq('id', habitId)
      .single();

    if (!habit || habit.user_id !== user.id) {
      return {
        success: false,
        message: '이 습관을 수정할 권한이 없습니다.',
      };
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.frequency !== undefined) updateData.frequency = input.frequency;
    if (input.goal_value !== undefined) updateData.goal_value = input.goal_value;

    const { data, error } = await supabase
      .from('habits')
      .update(updateData)
      .eq('id', habitId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: '습관이 업데이트되었습니다.',
      habit: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 습관 삭제
 * @param habitId - 습관 ID
 * @returns 성공/실패 메시지
 */
export async function deleteHabit(habitId: string) {
  const supabase = await createClient();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: '로그인이 필요합니다.',
      };
    }

    // 습관 소유자 확인
    const { data: habit } = await supabase
      .from('habits')
      .select('user_id')
      .eq('id', habitId)
      .single();

    if (!habit || habit.user_id !== user.id) {
      return {
        success: false,
        message: '이 습관을 삭제할 권한이 없습니다.',
      };
    }

    const { error } = await supabase.from('habits').delete().eq('id', habitId);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: '습관이 삭제되었습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 특정 날짜의 습관 기록 조회
 * @param date - YYYY-MM-DD 형식의 날짜
 * @returns 해당 날짜의 모든 습관 기록
 */
export async function getHabitLogsByDate(date: string) {
  const supabase = await createClient();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: '로그인이 필요합니다.',
        logs: [],
      };
    }

    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date);

    if (error) {
      return {
        success: false,
        message: error.message,
        logs: [],
      };
    }

    return {
      success: true,
      logs: data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      logs: [],
    };
  }
}

/**
 * 습관 기록 생성 또는 업데이트
 * @param habitId - 습관 ID
 * @param date - YYYY-MM-DD 형식의 날짜
 * @param status - 'none' | 'partial' | 'completed'
 * @returns 저장된 기록
 */
export async function upsertHabitLog(
  habitId: string,
  date: string,
  status: 'none' | 'partial' | 'completed'
) {
  const supabase = await createClient();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: '로그인이 필요합니다.',
      };
    }

    // 습관 소유자 확인
    const { data: habit } = await supabase
      .from('habits')
      .select('user_id')
      .eq('id', habitId)
      .single();

    if (!habit || habit.user_id !== user.id) {
      return {
        success: false,
        message: '이 습관에 접근할 권한이 없습니다.',
      };
    }

    // 기존 기록이 있는지 확인
    const { data: existingLog } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('date', date)
      .single();

    let result;

    if (existingLog) {
      // 업데이트
      result = await supabase
        .from('habit_logs')
        .update({ status })
        .eq('id', existingLog.id)
        .select()
        .single();
    } else {
      // 생성
      result = await supabase
        .from('habit_logs')
        .insert([
          {
            habit_id: habitId,
            user_id: user.id,
            date,
            status,
          },
        ])
        .select()
        .single();
    }

    if (result.error) {
      return {
        success: false,
        message: result.error.message,
      };
    }

    return {
      success: true,
      message: '습관 기록이 저장되었습니다.',
      log: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 습관의 스트릭 계산
 * @param habitId - 습관 ID
 * @returns 현재 스트릭 정보
 */
export async function getHabitStreak(habitId: string) {
  const supabase = await createClient();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: '로그인이 필요합니다.',
      };
    }

    // 습관 소유자 확인
    const { data: habit } = await supabase
      .from('habits')
      .select('user_id')
      .eq('id', habitId)
      .single();

    if (!habit || habit.user_id !== user.id) {
      return {
        success: false,
        message: '이 습관에 접근할 권한이 없습니다.',
      };
    }

    // 모든 기록을 날짜 순으로 정렬
    const { data: logs, error } = await supabase
      .from('habit_logs')
      .select('date, status')
      .eq('habit_id', habitId)
      .order('date', { ascending: false });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const completedLogs = logs
      .filter((log: any) => log.status === 'completed')
      .map((log: any) => new Date(log.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < logs.length; i++) {
      const logDate = new Date(logs[i].date);
      logDate.setHours(0, 0, 0, 0);

      if (logs[i].status === 'completed') {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);

        // 현재 스트릭 확인 (오늘 또는 어제부터 연속)
        if (i === 0) {
          const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 1) {
            currentStreak = tempStreak;
          }
        }
      } else {
        tempStreak = 0;
      }
    }

    return {
      success: true,
      streak: {
        habitId,
        currentStreak,
        longestStreak,
        totalCompletions: logs.filter((log: any) => log.status === 'completed').length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}
