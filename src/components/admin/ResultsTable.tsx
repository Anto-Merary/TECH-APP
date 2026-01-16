import { useState } from 'react';
import { Search, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/Button';

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

interface ResultsTableProps {
  results: QuizResult[];
  isLoading: boolean;
}

type SortField = 'child_name' | 'logical_score' | 'completion_time_seconds' | 'created_at';
type SortDirection = 'asc' | 'desc';

const careerLabels: Record<string, string> = {
  scientist: '🔬 Scientist',
  engineer: '⚙️ Engineer',
  tech_hero: '🤖 Tech Hero',
  artist: '🎨 Artist',
  doctor: '🏥 Doctor',
  sportsperson: '⚽ Sportsperson',
  environment_hero: '🌿 Environment Hero',
};

export function ResultsTable({ results, isLoading }: ResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatTime = (seconds: number | null): string => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredResults = results
    .filter((r) =>
      r.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.parent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.school_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === null) aVal = sortDirection === 'asc' ? Infinity : -Infinity;
      if (bVal === null) bVal = sortDirection === 'asc' ? Infinity : -Infinity;

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const exportToCSV = () => {
    const headers = [
      'Child Name',
      'Age',
      'Parent Name',
      'Parent Email',
      'Parent Phone',
      'School',
      'Career Prediction',
      'Score',
      'Time (seconds)',
      'Date',
    ];

    const rows = results.map((r) => [
      r.child_name,
      r.age || '',
      r.parent_name || '',
      r.parent_email || '',
      r.parent_phone || '',
      r.school_name || '',
      r.career_prediction,
      r.logical_score,
      r.completion_time_seconds || '',
      r.created_at,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1 inline" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 inline" />
    );
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none transition-colors font-nunito"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th
                className="text-left p-4 font-nunito font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('child_name')}
              >
                Child Name <SortIcon field="child_name" />
              </th>
              <th className="text-left p-4 font-nunito font-semibold text-slate-300">
                Age
              </th>
              <th className="text-left p-4 font-nunito font-semibold text-slate-300">
                Parent
              </th>
              <th className="text-left p-4 font-nunito font-semibold text-slate-300">
                School
              </th>
              <th className="text-left p-4 font-nunito font-semibold text-slate-300">
                Career
              </th>
              <th
                className="text-left p-4 font-nunito font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('logical_score')}
              >
                Score <SortIcon field="logical_score" />
              </th>
              <th
                className="text-left p-4 font-nunito font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('completion_time_seconds')}
              >
                Time <SortIcon field="completion_time_seconds" />
              </th>
              <th
                className="text-left p-4 font-nunito font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('created_at')}
              >
                Date <SortIcon field="created_at" />
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </td>
              </tr>
            ) : filteredResults.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400 font-nunito">
                  No results found
                </td>
              </tr>
            ) : (
              filteredResults.map((result) => (
                <tr
                  key={result.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4 font-nunito font-semibold text-white">
                    {result.child_name}
                  </td>
                  <td className="p-4 font-nunito text-slate-300">
                    {result.age || '-'}
                  </td>
                  <td className="p-4 font-nunito text-slate-300">
                    <div>{result.parent_name || '-'}</div>
                    {result.parent_email && (
                      <div className="text-sm text-slate-500">{result.parent_email}</div>
                    )}
                  </td>
                  <td className="p-4 font-nunito text-slate-300">
                    {result.school_name || '-'}
                  </td>
                  <td className="p-4 font-nunito">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-slate-700 text-slate-200">
                      {careerLabels[result.career_prediction] || result.career_prediction}
                    </span>
                  </td>
                  <td className="p-4 font-fredoka font-bold text-lg">
                    <span className={
                      result.logical_score >= 70 
                        ? 'text-green-400' 
                        : result.logical_score >= 40 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                    }>
                      {result.logical_score}/90
                    </span>
                  </td>
                  <td className="p-4 font-nunito text-slate-300">
                    {formatTime(result.completion_time_seconds)}
                  </td>
                  <td className="p-4 font-nunito text-slate-400 text-sm">
                    {formatDate(result.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-center">
        <p className="font-nunito text-sm text-slate-400">
          Showing {filteredResults.length} of {results.length} results
        </p>
      </div>
    </div>
  );
}
