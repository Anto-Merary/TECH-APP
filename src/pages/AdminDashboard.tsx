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
      // Check if admin is logged in via localStorage
      const adminEmail = localStorage.getItem('adminEmail');
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      
      if (!adminEmail || adminLoggedIn !== 'true') {
        navigate('/admin');
        return;
      }

      // Verify the email exists in admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('email')
        .eq('email', adminEmail)
        .single();

      if (adminError || !adminData) {
        // Clear invalid session
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminLoggedIn');
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
      console.log('Fetching quiz results...');
      
      // Fetch quiz results with user data
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .order('completed_at', { ascending: false });

      if (quizError) {
        console.error('Quiz results error:', quizError);
        throw quizError;
      }

      console.log('Quiz results fetched:', quizData?.length || 0);

      if (!quizData || quizData.length === 0) {
        console.log('No quiz results found');
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Get all unique user IDs
      const userIds = [...new Set(quizData.map((q: any) => q.user_id).filter(Boolean))];
      console.log('User IDs to fetch:', userIds.length, userIds);

      let usersMap = new Map();

      // Only fetch users if we have user IDs
      if (userIds.length > 0) {
      // Fetch all users at once
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

        if (usersError) {
          console.error('Users error:', usersError);
          throw usersError;
        }

        console.log('Users fetched:', usersData?.length || 0);
        console.log('Users data:', usersData);

      // Create a map of users by ID for quick lookup
        usersMap = new Map((usersData || []).map((u: any) => [u.id, u]));
      }

      // Transform the data to match our interface
      const transformedData: QuizResult[] = quizData.map((item: any) => {
        const user = usersMap.get(item.user_id);
        console.log('Processing item:', item.id, 'User found:', !!user);
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

      console.log('Transformed data:', transformedData.length);
      console.log('Sample transformed data:', transformedData[0]);
      setResults(transformedData);
      
      if (transformedData.length > 0) {
        toast({
          title: "Success",
          description: `Loaded ${transformedData.length} quiz result(s)`,
        });
      }
    } catch (error: any) {
      console.error('Error fetching results:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: error.message || "Failed to load quiz results.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLoggedIn');
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

        {/* Debug Info (remove in production) */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 font-mono">
              Debug: {results.length} results loaded | Loading: {isLoading ? 'Yes' : 'No'} | Admin: {isAdmin ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
