'use client'

import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { assignMatch } from '@/lib/api'
import { logActivity } from '@/lib/activityLog'
import { User, TrendingUp, Building2, Briefcase, Heart, GraduationCap } from 'lucide-react'

interface MatchCardProps {
  match: any
  index: number
}

export function MatchCard({ match, index }: MatchCardProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: assignMatch,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['matchStats'] })
      toast.success('Match assigned successfully!')
      logActivity(`🤝 Match assigned: ${variables.name} → ${match.profileName}`)
    },
    onError: () => {
      toast.error('Failed to assign match')
    },
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Shelter': return Building2
      case 'Job': return Briefcase
      case 'Medical': return Heart
      case 'Training': return GraduationCap
      default: return TrendingUp
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Shelter': return 'bg-amber/20 text-amber'
      case 'Job': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Medical': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'Training': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      default: return 'bg-tan text-brown'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-amber'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
      case 'Medium': return 'bg-amber/20 text-amber'
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-tan text-brown'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card space-y-4 hover:shadow-2xl transition-all duration-300"
      data-testid={`match-card-${match.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-amber" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-deepbrown dark:text-dark-text">
              {match.profileName}
            </h3>
            <p className="text-sm text-brown dark:text-dark-muted">
              Age: {match.age}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(match.priority)}`}>
          {match.priority}
        </span>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-brown dark:text-dark-muted">
          Recommended Matches:
        </p>
        {match.recommendations.map((rec: any, idx: number) => {
          const Icon = getTypeIcon(rec.type)
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + idx * 0.1 }}
              className="flex items-center justify-between bg-tan dark:bg-dark-surface rounded-xl px-4 py-3 gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon className="w-5 h-5 text-amber flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${getTypeColor(rec.type)}`}>
                      {rec.type}
                    </span>
                    <span className="font-medium text-deepbrown dark:text-dark-text truncate">
                      {rec.name}
                    </span>
                  </div>
                  {rec.reason && (
                    <p className="text-xs text-brown dark:text-dark-muted mt-1">
                      {rec.reason}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-sm font-bold ${getScoreColor(rec.score)}`}>
                  {rec.score}%
                </span>
                <button
                  onClick={() => mutation.mutate({
                    profileId: match.profileId,
                    type: rec.type,
                    name: rec.name,
                    score: rec.score,
                  })}
                  disabled={mutation.isPending}
                  className="btn-primary text-sm px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
