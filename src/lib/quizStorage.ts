import { supabase } from '@/integrations/client';
import type { TablesInsert } from '@/integrations/types';
import type { CareerType } from '@/data/quizData';

export interface UserData {
  name: string;
  age: number;
  phone: string;
  email: string;
  gender?: string | null;
  grade?: string | null;
  school_name?: string | null;
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
    if (!supabase) {
      console.error('Supabase client is not initialized. Check environment variables.');
      throw new Error('Supabase client is not initialized');
    }

    console.log('Saving user data:', {
      name: userData.name,
      email: userData.email,
      age: userData.age,
    });

    // First, try to get existing user by email
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single();

    // If user exists, update their information (especially grade and school_name) and return their ID
    if (existingUser && !fetchError) {
      console.log('User already exists, updating information:', existingUser.id);
      
      // Update user data, especially grade and school_name if provided
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: userData.name,
          age: userData.age,
          phone: userData.phone,
          gender: userData.gender || null,
          grade: userData.grade || null,
          school_name: userData.school_name || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id);
      
      if (updateError) {
        console.error('Error updating existing user:', updateError);
        // Still return the ID even if update fails
      } else {
        console.log('Existing user data updated successfully');
      }
      
      return existingUser.id;
    }

    // If user doesn't exist, create new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        age: userData.age,
        phone: userData.phone,
        email: userData.email,
        gender: userData.gender || null,
        grade: userData.grade || null,
        school_name: userData.school_name || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving user data:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // If it's a unique constraint error, try to get the existing user
      if (error.code === '23505') { // PostgreSQL unique violation
        console.log('Email already exists, fetching existing user...');
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('email', userData.email)
          .single();
        
        if (existing) {
          return existing.id;
        }
      }
      
      return null;
    }

    if (!data) {
      console.error('No data returned from insert');
      return null;
    }

    console.log('User data saved successfully:', data.id);
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
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return null;
    }

    console.log('Saving quiz results:', {
      userId,
      logicalScore: quizData.logicalScore,
      careerType: quizData.careerType,
      personalityAnswersCount: Object.keys(quizData.personalityAnswers).length,
      logicalAnswersCount: Object.keys(quizData.logicalAnswers).length,
    });

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
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    if (!data) {
      console.error('No data returned from quiz results insert');
      return null;
    }

    console.log('Quiz results saved successfully:', data.id);
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
  console.log('Starting saveUserAndQuizResults:', {
    userName: userData.name,
    userEmail: userData.email,
    logicalScore: quizData.logicalScore,
    careerType: quizData.careerType,
  });

  // First save user data
  const userId = await saveUserData(userData);
  
  if (!userId) {
    console.error('Failed to save user data');
    return null;
  }

  console.log('User data saved, userId:', userId);

  // Then save quiz results
  const quizResultId = await saveQuizResults(userId, quizData);
  
  if (!quizResultId) {
    console.error('Failed to save quiz results for userId:', userId);
    return null;
  }

  console.log('Both user and quiz results saved successfully');
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
