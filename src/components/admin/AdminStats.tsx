import { Users, Trophy, TrendingUp } from 'lucide-react';

interface QuizResult {
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

export interface AdminStatsProps {
  results: QuizResult[];
  isLoading: boolean;
}

export function AdminStats({ results, isLoading }: AdminStatsProps) {
  const totalParticipants = results.length;
  
  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.logical_score, 0) / results.length)
    : 0;

  const topScore = results.length > 0 
    ? Math.max(...results.map(r => r.logical_score))
    : 0;

  const careerDistribution: Record<string, number> = {};
  results.forEach(r => {
    if (r.career_type) {
      careerDistribution[r.career_type] = (careerDistribution[r.career_type] || 0) + 1;
    }
  });
  
  const topCareer = Object.entries(careerDistribution).reduce(
    (max, [career, count]) => count > max[1] ? [career, count] : max,
    ['N/A', 0] as [string, number]
  )[0];

  const stats = [
    {
      title: 'Total Participants',
      value: isLoading ? '-' : totalParticipants.toString(),
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Average Score',
      value: isLoading ? '-' : `${averageScore}/90`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Top Score',
      value: isLoading ? '-' : `${topScore}/90`,
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Top Career',
      value: isLoading ? '-' : topCareer,
      icon: Trophy,
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-nunito text-sm text-slate-400">{stat.title}</p>
              <p className="font-fredoka text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
