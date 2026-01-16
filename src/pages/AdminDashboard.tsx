import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/client';
import { AdminStats, ResultsTable } from '@/components/admin';
import { Button } from '@/components/Button';
import { LogOut, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { QuizResult } from '@/types/admin';

export type { QuizResult };

export default function AdminDashboard() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      // Simple admin check - you can enhance this with proper auth later
      // For now, we'll just check if the user email exists in the admins table
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin');
        return;
      }

      // Check if user is in admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('email')
        .eq('email', user.email)
        .single();

      if (adminError || !adminData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate('/admin');
        return;
      }

      setIsAdmin(true);
      fetchResults();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/admin');
    }
  };

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      // Fetch quiz results with user data
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .order('completed_at', { ascending: false });

      if (quizError) throw quizError;

      if (!quizData || quizData.length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Get all unique user IDs
      const userIds = [...new Set(quizData.map((q: any) => q.user_id))];

      // Fetch all users at once
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

      if (usersError) throw usersError;

      // Create a map of users by ID for quick lookup
      const usersMap = new Map((usersData || []).map((u: any) => [u.id, u]));

      // Transform the data to match our interface
      const transformedData: QuizResult[] = quizData.map((item: any) => {
        const user = usersMap.get(item.user_id);
        return {
          id: item.id,
          user_id: item.user_id,
          name: user?.name || 'Unknown',
          age: user?.age || 0,
          email: user?.email || '',
          phone: user?.phone || '',
          career_type: item.career_type,
          logical_score: item.logical_score || 0,
          personality_answers: item.personality_answers || {},
          logical_answers: item.logical_answers || {},
          completed_at: item.completed_at,
          created_at: item.created_at || user?.created_at,
        };
      });

      setResults(transformedData);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz results.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-fredoka text-xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="font-nunito text-sm text-slate-400">
                Fun Thinking Challenge Results
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchResults}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <AdminStats results={results} isLoading={isLoading} />

        {/* Results Table */}
        <div className="mt-8">
          <ResultsTable results={results} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
