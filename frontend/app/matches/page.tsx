'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MatchCard } from '@/components/MatchCard';
import { Match } from '@/lib/types';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Shelter' | 'Job' | 'Medical' | 'Training'>('all');
  const [minScore, setMinScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    totalRecommendations: 0,
    avgScore: 0,
    highPriority: 0
  });

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const user = JSON.parse(session);
    if (user.role !== 'ngo' && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadMatches();
  }, [router]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      
      // INTEGRATION: Fetch profiles and AI recommendations from backend
      const { getProfiles, getShelterRecommendations, getJobRecommendations } = await import('@/lib/api');
      
      // Get all profiles from PostgreSQL
      const profiles = await getProfiles();
      
      // Get AI recommendations for each profile (GPU-accelerated!)
      const matchesData = await Promise.all(
        profiles.map(async (profile) => {
          try {
            // Get shelter and job recommendations in parallel
            const [shelterRecs, jobRecs] = await Promise.all([
              getShelterRecommendations(profile.profile_id, 3).catch(() => ({ recommendations: [] })),
              getJobRecommendations(profile.profile_id, 3).catch(() => ({ recommendations: [] })),
            ]);
            
            return {
              id: profile.profile_id,
              profileId: profile.profile_id,
              profileName: profile.name,
              priority: profile.priority || 'Medium',
              recommendations: [
                // Map shelter recommendations
                ...shelterRecs.recommendations.map(r => ({
                  id: r.resource_id,
                  type: 'Shelter' as const,
                  name: r.resource_name,
                  score: Math.round(r.score * 100),
                  reason: `Location: ${Math.round(r.explanation.location_score * 100)}%, Availability: ${Math.round(r.explanation.availability_score * 100)}%`,
                })),
                // Map job recommendations
                ...jobRecs.recommendations.map(r => ({
                  id: r.resource_id,
                  type: 'Job' as const,
                  name: r.resource_name,
                  score: Math.round(r.score * 100),
                  reason: `Skills: ${Math.round(r.explanation.skill_match_score * 100)}%, Location: ${Math.round(r.explanation.location_score * 100)}%`,
                })),
              ],
            };
          } catch (error) {
            console.error(`Failed to get recommendations for profile ${profile.profile_id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out failed requests
      const validMatches = matchesData.filter(m => m !== null) as Match[];
      setMatches(validMatches);
      calculateStats(validMatches);
    } catch (error) {
      console.error('Failed to load matches:', error);
      // Fallback to empty array if backend is not available
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (matchData: Match[]) => {
    const total = matchData.length;
    const totalRecommendations = matchData.reduce((sum, m) => sum + m.recommendations.length, 0);
    const allScores = matchData.flatMap(m => m.recommendations.map(r => r.score));
    const avgScore = allScores.length > 0 
      ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length 
      : 0;
    const highPriority = matchData.filter(m => m.priority === 'Critical' || m.priority === 'High').length;

    setStats({ total, totalRecommendations, avgScore, highPriority });
  };

  const filteredMatches = matches.filter(match => {
    const matchesType = filter === 'all' || match.recommendations.some(r => r.type === filter);
    const matchesScore = match.recommendations.some(r => r.score >= minScore);
    const matchesSearch = searchQuery === '' || 
      match.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.recommendations.some(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesScore && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
          <p className="mt-4 text-brown-600 dark:text-brown-400">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brown-900 dark:text-cream-50 mb-2">
            AI-Powered Matches
          </h1>
          <p className="text-brown-600 dark:text-brown-400">
            Smart recommendations connecting individuals with resources
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-brown-200 dark:border-gray-700">
            <div className="text-sm text-brown-600 dark:text-brown-400 mb-1">Total Profiles</div>
            <div className="text-3xl font-bold text-brown-900 dark:text-cream-50">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-brown-200 dark:border-gray-700">
            <div className="text-sm text-brown-600 dark:text-brown-400 mb-1">Recommendations</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalRecommendations}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-brown-200 dark:border-gray-700">
            <div className="text-sm text-brown-600 dark:text-brown-400 mb-1">High Priority</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.highPriority}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-brown-200 dark:border-gray-700">
            <div className="text-sm text-brown-600 dark:text-brown-400 mb-1">Avg Score</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.avgScore.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-brown-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-brown-700 dark:text-brown-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search profiles or resources..."
                className="w-full px-4 py-2 border border-brown-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent bg-white dark:bg-gray-700 text-brown-900 dark:text-cream-50"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-brown-700 dark:text-brown-300 mb-2">
                Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-brown-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent bg-white dark:bg-gray-700 text-brown-900 dark:text-cream-50"
              >
                <option value="all">All Types</option>
                <option value="Shelter">Shelters</option>
                <option value="Job">Jobs</option>
                <option value="Medical">Medical</option>
                <option value="Training">Training</option>
              </select>
            </div>

            {/* Score Filter */}
            <div>
              <label className="block text-sm font-medium text-brown-700 dark:text-brown-300 mb-2">
                Min Score: {minScore}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-brown-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-brown-900 dark:text-cream-50 mb-2">
              No matches found
            </h3>
            <p className="text-brown-600 dark:text-brown-400">
              Try adjusting your filters or check back later for new recommendations
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
