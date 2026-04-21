# Supabase SQL 스키마 설정 가이드

## 📋 스키마 생성 방법

### 방법 1: Supabase Dashboard (권장)

1. **Supabase 대시보드 접속**
   - https://app.supabase.com → 프로젝트 선택

2. **SQL Editor 열기**
   - 좌측 메뉴: **SQL Editor** 선택

3. **새 쿼리 생성**
   - **New Query** 버튼 클릭

4. **SQL 스크립트 복사 및 실행**
   - `database_schema.sql` 파일의 전체 내용 복사
   - SQL Editor에 붙여넣기
   - **Run** 버튼 클릭 (또는 `Ctrl+Enter`)

5. **결과 확인**
   - 성공 메시지 확인
   - **Table Editor**에서 테이블 생성 확인
   - 테이블: `user_profiles`, `habits`, `habit_logs`

---

## ✅ 스키마 검증 체크리스트

실행 후 다음을 확인하세요:

- [ ] `user_profiles` 테이블 생성됨
- [ ] `habits` 테이블 생성됨
- [ ] `habit_logs` 테이블 생성됨
- [ ] RLS 정책이 모든 테이블에 적용됨
- [ ] 인덱스가 생성됨 (`idx_habits_user_id`, `idx_habit_logs_*`)
- [ ] 트리거 함수가 작동함 (`update_user_profiles_updated_at`, `update_habits_updated_at`, `create_user_profile`)

---

## 🔧 스키마 상세 설명

### user_profiles (사용자 프로필)
- `id`: auth.users의 ID와 1:1 매핑 (자동 생성)
- `avatar_url`: 프로필 이미지 URL
- `bio`: 자기소개 (향후 소셜 기능 대비)
- `theme`: 사용자 테마 선택 ('light' | 'dark')
- **RLS**: 자신의 프로필만 조회/수정 가능

### habits (습관 정의)
- `id`: UUID (자동 생성)
- `user_id`: 습관 소유자
- `name`: 습관 이름 (예: "아침 운동", "책 읽기")
- `frequency`: 'daily' | 'weekly' (향후 확장 가능)
- `goal_value`: 목표 횟수 (예: 1, 2, ...)
- **Index**: user_id로 빠른 검색
- **RLS**: 자신의 습관만 CRUD 가능

### habit_logs (일별 기록)
- `id`: UUID (자동 생성)
- `habit_id`: 어떤 습관인지
- `user_id`: 누가 기록했는지 (쿼리 최적화)
- `date`: 기록 날짜
- `status`: 'none' | 'partial' | 'completed'
- **Unique Constraint**: 하루에 같은 습관 1번만 기록 가능
- **Indexes**: 빠른 조회를 위한 인덱스
- **RLS**: 자신의 기록만 CRUD 가능

---

## 📌 중요 사항

1. **auth.users 테이블**
   - Supabase가 자동 관리 (직접 수정 금지)
   - user_profiles는 ON DELETE CASCADE로 연동

2. **RLS 정책**
   - `auth.uid()` 함수로 현재 로그인 유저 확인
   - 모든 테이블에 자동으로 적용됨

3. **트리거 함수**
   - `updated_at` 자동 업데이트
   - 회원가입 시 자동으로 user_profiles 생성

---

## 🚀 다음 단계

SQL 스키마 생성 완료 후:
1. **TypeScript 타입 정의** (`/src/types/database.ts`)
2. **Server Actions** (CRUD 함수)
3. **인증 UI** (로그인/회원가입 페이지)
