'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Building2, Briefcase, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getShelterRecommendations, getJobRecommendations } from '@/lib/api'

interface AIRecommendationsProps {
  profileId: number
}

export function AIRecommendations({ profileId }: AIRecommendationsProps) {
  const [loading, setLoading] = useState(false)
  const [shelterRecs, setShelterRecs] = useState<any[]>([])
  const [jobRecs, setJobRecs] = useState<any[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const [shelters, jobs] = await Promise.all([
        getShelterRecommendations(profileId, 5),
        getJobRecommendations(profileId, 5),
      ])
      
      setShelterRecs(shelters.recommendations || [])
      setJobRecs(jobs.recommendations || [])
      setHasLoaded(true)
      toast.success('AI recommendations loaded!')
    } catch (error) {
      console.error('Error loading recommendations:', error)
      toast.error('Failed to load AI recommendations')
    } finally {
      setLoading(false)
    }
  }

  if (!hasLoaded) {
    return (
      <div className="card text-center">
        <Sparkles className="w-12 h-12 text-amber mx-auto mb-4" />
        <h3 className="text-xl font-bold text-deepbrown dark:text-dark-text mb-2">
          AI-Powered Recommendations
        </h3>
        <p className="text-brown dark:text-dark-muted mb-6">
          Get personalized shelter and job recommendations using our GPU-accelerated AI
        </p>
        <button
          onClick={loadRecommendations}
          disabled={loading}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Get AI Recommendations
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Shelter Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-xl font-bold text-deepbrown dark:text-dark-text mb-4 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-amber" />
          Recommended Shelters
        </h3>
        
        {shelterRecs.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-brown dark:text-dark-muted mx-auto mb-2" />
            <p className="text-brown dark:text-dark-muted">No shelter recommendations available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shelterRecs.map((rec, index) => (
              <div
                key={rec.resource_id}
                className="p-4 bg-tan dark:bg-dark-surface rounded-xl border border-beige dark:border-dark-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-deepbrown dark:text-dark-text">
                    {index + 1}. {rec.resource_name}
                  </h4>
                  <span className="px-3 py-1 bg-amber/20 text-amber rounded-full text-sm font-bold">
                    {Math.round(rec.score * 100)}% Match
                  </span>
                </div>
                <div className="text-sm text-brown dark:text-dark-muted space-y-1">
                  <p>📍 Location Score: {Math.round(rec.explanation.location_score * 100)}%</p>
                  <p>🛏️ Availability: {Math.round(rec.explanation.availability_score * 100)}%</p>
                  {rec.resource_details && (
                    <p className="mt-2 text-xs">
                      {rec.resource_details.address}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Job Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-xl font-bold text-deepbrown dark:text-dark-text mb-4 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-amber" />
          Recommended Jobs
        </h3>
        
        {jobRecs.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-brown dark:text-dark-muted mx-auto mb-2" />
            <p className="text-brown dark:text-dark-muted">No job recommendations available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobRecs.map((rec, index) => (
              <div
                key={rec.resource_id}
                className="p-4 bg-tan dark:bg-dark-surface rounded-xl border border-beige dark:border-dark-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-deepbrown dark:text-dark-text">
                    {index + 1}. {rec.resource_name}
                  </h4>
                  <span className="px-3 py-1 bg-amber/20 text-amber rounded-full text-sm font-bold">
                    {Math.round(rec.score * 100)}% Match
                  </span>
                </div>
                <div className="text-sm text-brown dark:text-dark-muted space-y-1">
                  <p>🎯 Skills Match: {Math.round(rec.explanation.skill_match_score * 100)}%</p>
                  <p>📍 Location Score: {Math.round(rec.explanation.location_score * 100)}%</p>
                  {rec.resource_details && (
                    <p className="mt-2 text-xs">
                      {rec.resource_details.organization} • {rec.resource_details.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <button
        onClick={loadRecommendations}
        disabled={loading}
        className="btn-secondary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Refreshing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Refresh Recommendations
          </>
        )}
      </button>
    </div>
  )
}
