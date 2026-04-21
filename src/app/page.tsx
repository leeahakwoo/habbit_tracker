import Link from 'next/link';
import { getCurrentUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();

  // 로그인된 사용자는 대시보드로 리다이렉트
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habbit</h1>
        <nav className="flex gap-4">
          <Link href="/auth/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">
            로그인
          </Link>
          <Link href="/auth/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg">
            회원가입
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 text-center max-w-2xl">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            습관을 포기하지 않고
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              지속하세요
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            대부분의 사람들은 습관을 시작하는 것이 아니라 <strong>유지하는 것에 실패합니다.</strong>
            <br />
            Habbit은 당신의 습관을 포기하지 않도록 도와줍니다.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/auth/signup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            지금 시작하기
          </Link>
          <Link
            href="/auth/login"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            로그인
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 w-full">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              빠른 기록
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              1~2초 안에 습관을 체크합니다
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              진도 추적
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              스트릭과 달성률로 진행도를 보세요
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="text-4xl mb-3">💪</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              포기 방지
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              실패 후에도 다시 시작할 수 있어요
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

