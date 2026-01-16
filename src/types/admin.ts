export interface QuizResult {
  id: string;
  user_id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  career_type: string | null;
  logical_score: number;
  personality_answers: Record<string, any>;
  logical_answers: Record<string, any>;
  completed_at: string | null;
  created_at: string | null;
}
