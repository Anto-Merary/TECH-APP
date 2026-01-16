import { Users, Trophy, Clock, TrendingUp } from 'lucide-react';

interface QuizResult {
  id: string;
  child_name: string;
  logical_score: number;
  completion_time_seconds: number | null;
  career_prediction: string;
}

interface StatsCardsProps {
  results: QuizResult[];
  isLoading: boolean;
}

export function StatsCards({ results, isLoading }: StatsCardsProps) {
  const totalParticipants = results.length;
  
  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.logical_score, 0) / results.length)
    : 0;

  const validTimes = results.filter(r => r.completion_time_seconds);
  const averageTime = validTimes.length > 0
    ? Math.round(validTimes.reduce((sum, r) => sum + (r.completion_time_seconds || 0), 0) / validTimes.length)
    : 0;

  const topScore = results.length > 0 
    ? Math.max(...results.map(r => r.logical_score))
    : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      title: 'Average Time',
      value: isLoading ? '-' : formatTime(averageTime),
      icon: Clock,
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      title: 'Top Score',
      value: isLoading ? '-' : `${topScore}/90`,
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-500',
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
