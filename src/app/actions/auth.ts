'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * 회원가입 서버 액션
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @returns 성공/실패 메시지
 */
export async function signUp(email: string, password: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: '사용자 생성에 실패했습니다.',
      };
    }

    // user_profiles는 데이터베이스 트리거에 의해 자동으로 생성됨
    return {
      success: true,
      message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 로그인 서버 액션
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @returns 성공/실패 메시지
 */
export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: '로그인에 실패했습니다.',
      };
    }

    // 로그인 성공 후 대시보드로 리다이렉트
    redirect('/dashboard');
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 로그아웃 서버 액션
 */
export async function signOut() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    // 로그아웃 성공 후 로그인 페이지로 리다이렉트
    redirect('/auth/login');
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 현재 사용자 정보 조회
 * @returns 사용자 정보
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    return null;
  }
}

/**
 * 사용자 프로필 정보 조회
 * @returns 사용자 프로필
 */
export async function getUserProfile() {
  const supabase = await createClient();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

/**
 * 사용자 프로필 업데이트
 * @param avatar_url - 프로필 이미지 URL
 * @param bio - 자기소개
 * @param theme - 테마 선택
 * @returns 성공/실패 메시지
 */
export async function updateUserProfile(
  avatar_url?: string | null,
  bio?: string | null,
  theme?: 'light' | 'dark'
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

    const updateData: any = {};
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (bio !== undefined) updateData.bio = bio;
    if (theme !== undefined) updateData.theme = theme;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', user.id)
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
      message: '프로필이 업데이트되었습니다.',
      profile: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}
