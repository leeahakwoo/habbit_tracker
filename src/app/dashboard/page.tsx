'use client';

import { useState, useEffect } from 'react';
import { getHabits, getHabitLogsByDate, upsertHabitLog } from '@/app/actions/habits';
import { Habit, HabitLog } from '@/types/database';
import Link from 'next/link';

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 습관 목록 조회
        const habitsResult = await getHabits();
        if (habitsResult.success) {
          setHabits(habitsResult.habits);
        } else if (habitsResult.message) {
          setError(habitsResult.message);
        }

        // 오늘의 기록 조회
        const logsResult = await getHabitLogsByDate(today);
        if (logsResult.success) {
          setLogs(logsResult.logs);
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [today]);

  async function handleToggleHabit(habitId: string, currentStatus: string) {
    try {
      // 상태 토글: 완료 → 부분 → 미완료 → 완료
      let newStatus: 'none' | 'partial' | 'completed' = 'none';
      if (currentStatus === 'none') newStatus = 'completed';
      else if (currentStatus === 'completed') newStatus = 'partial';

      const result = await upsertHabitLog(habitId, today, newStatus);

      if (result.success) {
        // 로컬 상태 업데이트
        setLogs((prevLogs) => {
          const existingLog = prevLogs.find((log) => log.habit_id === habitId);
          if (existingLog) {
            return prevLogs.map((log) =>
              log.habit_id === habitId ? { ...log, status: newStatus } : log
            );
          } else {
            return [...prevLogs, { ...result.log, status: newStatus }];
          }
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('습관을 업데이트하는 중 오류가 발생했습니다.');
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'partial':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400';
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'completed':
        return '✓ 완료';
      case 'partial':
        return '◐ 부분';
      default:
        return '○ 미완료';
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <svg className="w-12 h-12 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            오늘의 습관
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {new Date(today).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 분의 목표를 달성해보세요!
          </p>
        </div>
        <Link
          href="/dashboard/habits"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + 새 습관
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            아직 습관이 없어요
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            첫 번째 습관을 추가하여 시작해보세요!
          </p>
          <Link
            href="/dashboard/habits"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            습관 추가하기
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const log = logs.find((l) => l.habit_id === habit.id);
            const status = log?.status || 'none';

            return (
              <div
                key={habit.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {habit.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {habit.frequency === 'daily' ? '매일' : '매주'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleHabit(habit.id, status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getStatusColor(status)}`}
                  >
                    {getStatusLabel(status)}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span>목표: {habit.goal_value}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        status === 'completed'
                          ? 'bg-green-500 w-full'
                          : status === 'partial'
                          ? 'bg-yellow-500 w-1/2'
                          : 'bg-gray-400 w-0'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/habits/${habit.id}`}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 rounded-lg transition-colors text-center text-sm"
                  >
                    상세보기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {habits.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {habits.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              등록된 습관
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {logs.filter((l) => l.status === 'completed').length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              오늘 완료한 습관
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {habits.length > 0
                ? Math.round(
                    (logs.filter((l) => l.status === 'completed').length / habits.length) *
                      100
                  )
                : 0}
              %
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              완료율
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
