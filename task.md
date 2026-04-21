# Habit Tracker App 개발 작업 목록

- `[x]` **Phase 1: Project Setup & Environment**
    - `[x]` Next.js (App Router) 프로젝트 초기화 (`npx create-next-app@latest`)
    - `[x]` Git 초기화 및 GitHub 원격 저장소(`leeahakwoo/habbit_tracker`) 연결
    - `[x]` Tailwind CSS 테마 및 전역 스타일 설정
    - `[x]` Supabase 클라이언트 라이브러리 설치 및 초기화
    - `[x]` `.env.local` 환경 변수 구성 가이드 작성

- `[x]` **Phase 2: Database Schema & Authentication**
    - `[x]` Supabase SQL Editor용 테이블 스키마 작성 (`profiles`, `habits`, `habit_logs`)
    - `[x]` 회원가입 및 로그인 페이지 UI 구현
    - `[x]` Supabase Auth 연동 (Session 관리 및 Middleware 설정)

- `[x]` **Phase 3: Core Features (習慣 관리)**
    - `[x]` 습관 생성 및 목록 조회 UI (Main Dashboard)
    - `[x]` 습관 추가/수정/삭제 기능 구현 (Server Actions 사용)
    - `[x]` 습관별 일일 완료 체크 및 부분 성공 기록 기능

- `[ ]` **Phase 4: Progress Visualization & Polish**
    - `[ ]` 스트릭(Streak) 및 주간 완료율 그래프 구현
    - `[ ]` PRD 기반의 미세 애니메이션 및 인터랙션 강화 (Framer Motion 등 고려)
    - `[ ]` 반응형 디자인 최종 점검 및 다크 모드 완성

- `[ ]` **Phase 5: Deployment & Verification**
    - `[ ]` 전체 기능 수동 테스트 및 버그 수정
    - `[ ]` 배포 준비 (Vercel 등 가이드)
