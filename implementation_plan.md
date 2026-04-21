# Habit Tracker App MVP 구현 계획 (Next.js + Supabase)

사용자가 습관을 포기하지 않고 지속할 수 있도록 돕는 "Recovery-friendly" 습관 추적 앱의 MVP 개발 계획입니다. Next.js와 Supabase를 활용하여 확장성과 SEO를 모두 갖춘 애플리케이션을 구축합니다.

## User Review Required

> [!IMPORTANT]
> **Supabase 설정 요구사항**: 실제 배포 및 프로젝트 작동을 위해 Supabase 프로젝트 URL(`NEXT_PUBLIC_SUPABASE_URL`)과 Anon Key(`NEXT_PUBLIC_SUPABASE_ANON_KEY`)가 필요합니다. `opencode`가 작업을 시작하기 전에 프로젝트 생성이 완료되었는지 확인 부탁드립니다.

---

## Proposed Changes

### 1. 프로젝트 초기화 및 기술 스택 설정 [DONE]

#### [DONE] Next.js 템플릿 프로젝트 생성 및 Git 설정
- `npx create-next-app@latest ./ --tailwind --eslint --app --src-dir`
- **Git 설정**: 완료 (Origin 연결 및 Initial Push 완료)
- **폴더 구조**: 실제 구현된 구조 반영
  - `/src/app/auth`: 인증 관련 페이지 (로그인, 가입, 콜백)
  - `/src/app/dashboard`: 메인 대시보드 및 습관 관리 레이아웃
  - `/src/app/actions`: 서버 액션 처리 (auth, habits)
  - `/src/lib/supabase`: Supabase 클라이언트 설정 및 미들웨어
  - `/src/types`: `database.ts` 타입 정의 및 인터페이스

#### [NEW] [tailwind.config.ts](file:///c:/Users/cherr/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/habbit/tailwind.config.ts)
- PRD의 프리미엄 룩을 위한 커스텀 컬러 팔레트 정의 (Primary, Secondary, Accent)
- 다크 모드(dark mode) 설정 (`class` 전략)

---

### 2. 백엔드 설계 및 인증 [DONE]

#### [NEW] 데이터베이스 스키마 정의 (SQL)

**테이블 구조:**
- **user_profiles**: `id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY` (1:1 관계)
  - `avatar_url TEXT` - 프로필 이미지
  - `bio TEXT` - 자기소개 (향후 소셜 기능 대비)
  - `theme TEXT DEFAULT 'light'` - 다크모드 선택 저장
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- **habits**: `user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL` (1:N 관계)
  - `id UUID PRIMARY KEY`
  - `name TEXT NOT NULL` - 습관 이름
  - `frequency TEXT NOT NULL` - 'daily' | 'weekly' (향후 확장 가능)
  - `goal_value INTEGER DEFAULT 1` - 목표 횟수
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

- **habit_logs**: 습관별 일일 기록 데이터 (명시적 user_id 저장으로 쿼리 최적화)
  - `id UUID PRIMARY KEY`
  - `habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL`
  - `user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL`
  - `date DATE NOT NULL`
  - `status TEXT DEFAULT 'none'` - 'none' | 'partial' | 'completed'
  - `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  - `UNIQUE(habit_id, date)` - 하루에 한 습관 1개 기록만 가능

**보안:**
- **RLS (Row Level Security)**: 모든 테이블에 본인 데이터만 접근 가능한 보안 정책 적용
- 각 테이블별로 `auth.uid() == user_id` 조건으로 필터링

#### [DONE] 인증 시스템 (Authentication)
- Supabase Auth를 사용한 이메일/비밀번호 로그인 구현 완료
- Next.js Middleware를 활용한 보호된 라우트(Protected Routes) 설정 완료

---

### 3. 기능별 구현 상태 (Features)

#### 페이즈 1 & 2: 인증 및 초기 UI [DONE]
- 로그인/회원가입/로그아웃 서버 액션 및 UI 페이지 완벽 구현
- 대시보드 레이아웃 및 내비게이션 바 구축 완료

#### 페이즈 3: 습관 관리 및 기록 [DONE]
- 습관 생성, 조회, 수정, 삭제(CRUD) 서버 액션 구현 완료
- 대시보드 내 습관 목록 렌더링 및 일별 기록 토글(none/partial/completed) 기능 구현 완료
- 스트릭(Streak) 계산 로직 완료

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
