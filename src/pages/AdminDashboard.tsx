import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StatsCards } from '@/components/admin/StatsCards';
import { ResultsTable } from '@/components/admin/ResultsTable';
import { Button } from '@/components/Button';
import { LogOut, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizResult {
  id: string;
  child_name: string;
  age: number | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  school_name: string | null;
  career_prediction: string;
  logical_score: number;
  completion_time_seconds: number | null;
  created_at: string;
}

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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin');
        return;
      }

      const { data: hasAdminRole } = await supabase.rpc('has_role', { 
        _user_id: user.id, 
        _role: 'admin' 
      });

      if (!hasAdminRole) {
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
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
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
        <StatsCards results={results} isLoading={isLoading} />

        {/* Results Table */}
        <div className="mt-8">
          <ResultsTable results={results} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
