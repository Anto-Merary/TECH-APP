import { supabase } from '@/integrations/client';
import type { TablesInsert } from '@/integrations/types';
import type { CareerType } from '@/data/quizData';

export interface UserData {
  name: string;
  age: number;
  phone: string;
  email: string;
}

export interface QuizResultData {
  personalityAnswers: Record<string, string>;
  logicalAnswers: Record<string, string>;
  logicalScore: number;
  careerType: CareerType;
}

/**
 * Save user details to the database
 * @param userData User information (name, age, phone, email)
 * @returns User ID if successful, null if error
 */
export async function saveUserData(userData: UserData): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        age: userData.age,
        phone: userData.phone,
        email: userData.email,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving user data:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Exception saving user data:', error);
    return null;
  }
}

/**
 * Save quiz results to the database
 * @param userId User ID from the users table
 * @param quizData Quiz answers and scores
 * @returns Quiz result ID if successful, null if error
 */
export async function saveQuizResults(
  userId: string,
  quizData: QuizResultData
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        personality_answers: quizData.personalityAnswers,
        logical_answers: quizData.logicalAnswers,
        logical_score: quizData.logicalScore,
        career_type: quizData.careerType,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving quiz results:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Exception saving quiz results:', error);
    return null;
  }
}

/**
 * Save user data and quiz results in a single transaction
 * @param userData User information
 * @param quizData Quiz answers and scores
 * @returns Object with userId and quizResultId if successful, null if error
 */
export async function saveUserAndQuizResults(
  userData: UserData,
  quizData: QuizResultData
): Promise<{ userId: string; quizResultId: string } | null> {
  // First save user data
  const userId = await saveUserData(userData);
  
  if (!userId) {
    return null;
  }

  // Then save quiz results
  const quizResultId = await saveQuizResults(userId, quizData);
  
  if (!quizResultId) {
    return null;
  }

  return { userId, quizResultId };
}

/**
 * Get user by email
 * @param email User email
 * @returns User data if found, null otherwise
 */
export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching user:', error);
    return null;
  }
}

/**
 * Get quiz results for a user
 * @param userId User ID
 * @returns Array of quiz results
 */
export async function getUserQuizResults(userId: string) {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching quiz results:', error);
    return [];
  }
}
