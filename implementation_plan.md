# Habit Tracker App MVP 구현 계획 (Next.js + Supabase)

사용자가 습관을 포기하지 않고 지속할 수 있도록 돕는 "Recovery-friendly" 습관 추적 앱의 MVP 개발 계획입니다. Next.js와 Supabase를 활용하여 확장성과 SEO를 모두 갖춘 애플리케이션을 구축합니다.

## User Review Required

> [!IMPORTANT]
> **Supabase 설정 요구사항**: 실제 배포 및 프로젝트 작동을 위해 Supabase 프로젝트 URL(`NEXT_PUBLIC_SUPABASE_URL`)과 Anon Key(`NEXT_PUBLIC_SUPABASE_ANON_KEY`)가 필요합니다. `opencode`가 작업을 시작하기 전에 프로젝트 생성이 완료되었는지 확인 부탁드립니다.

---

## Proposed Changes

### 1. 프로젝트 초기화 및 기술 스택 설정

#### [NEW] Next.js 템플릿 프로젝트 생성 및 Git 설정
- `npx create-next-app@latest ./ --tailwind --eslint --app --src-dir`
- **Git 설정**:
  - `git init`
  - `git remote add origin https://github.com/leeahakwoo/habbit_tracker.git`
- **폴더 구조**:
  - `/src/app`: 라우팅 및 페이지 컴포넌트
  - `/src/components`: 재사용 가능한 UI 컴포넌트
  - `/src/lib/supabase`: Supabase 클라이언트 설정 (Client/Server/Middleware)
  - `/src/types`: TypeScript 인터페이스 정의

#### [NEW] [tailwind.config.ts](file:///c:/Users/cherr/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/habbit/tailwind.config.ts)
- PRD의 프리미엄 룩을 위한 커스텀 컬러 팔레트 정의 (Primary, Secondary, Accent)
- 다크 모드(dark mode) 설정 (`class` 전략)

---

### 2. 백엔드 설계 (Supabase DB & Auth)

#### [NEW] 데이터베이스 스키마 정의 (SQL)
- `profiles`: 사용자 프로필 (id PK, username, avatar_url)
- `habits`: 습관 정의 (id PK, user_id FK, name, frequency, goal_value)
- `habit_logs`: 일별 기록 (id PK, habit_id FK, user_id FK, date, status['none', 'partial', 'completed'])

#### [NEW] 인증 시스템 (Authentication)
- Supabase Auth를 사용한 이메일/비밀번호 로그인 구현
- Next.js Middleware를 활용한 보호된 라우트(Protected Routes) 설정

---

### 3. 기능별 구현 단계 (Features)

#### 페이즈 1: 인증 및 초기 UI
- 로그인/회원가입 페이지 구현
- 메인 레이아웃 및 내비게이션 바 구축

#### 페이즈 2: 습관 관리 (CRUD)
- 습관 생성 모달 및 목록 조회
- 서버 액션(Server Actions)을 활용한 Supabase 데이터 연동

#### 페이즈 3: 습관 기록 및 통계
- 일별 습관 완료 체크 (부분 성공 포함) 구현
- 스트릭(Streak) 및 달성률 시각화 (Tailwind 활용)

---

## Open Questions

- (없음) 사용자의 요청에 따라 추가 기능(소셜 로그인, 이메일 알림 등) 없이 현재 계획된 MVP 핵심 기능에 집중합니다.

---

## Verification Plan

### Automated Tests
- `npm run dev` 실행 확인
- Supabase Dashboard를 통한 실제 데이터 저장 및 인증 로그 확인

### Manual Verification
1. 회원가입 후 자동 로그인이 되는지 확인
2. 새로운 습관을 만들고 새로고침 후에도 목록에 유지되는지 확인
3. 습관 체크 후 대시보드의 스트릭 카운트가 정상적으로 변경되는지 확인
