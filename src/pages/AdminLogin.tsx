import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/Button';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .rpc('has_role', { _user_id: authData.user.id, _role: 'admin' });

      if (roleError) throw roleError;

      if (!roleData) {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in as admin.",
      });

      navigate('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-fredoka text-3xl font-bold text-white mb-2">
            Admin Portal
          </h1>
          <p className="font-nunito text-slate-400">
            Sign in to access the dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-nunito font-semibold text-slate-300">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none transition-colors font-nunito"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-nunito font-semibold text-slate-300">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none transition-colors font-nunito"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center mt-6 text-slate-500 text-sm font-nunito">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
