'use client'

import { motion } from 'framer-motion'
import { User, Calendar, AlertCircle } from 'lucide-react'
import type { AssignmentRequest } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

interface RequestCardProps {
  request: AssignmentRequest
  onViewDetails: () => void
}

const priorityColors = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300',
  Medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300',
  Low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300',
}

export function RequestCard({ request, onViewDetails }: RequestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-beige dark:bg-dark-surface rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-tan dark:border-dark-border"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brown rounded-full flex items-center justify-center text-white font-bold text-lg">
            {request.residentName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-deepbrown dark:text-dark-text">
              {request.residentName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-brown dark:text-dark-muted">
              <User className="w-4 h-4" />
              <span>
                {request.gender}, {request.age} years
              </span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            priorityColors[request.priority]
          }`}
        >
          {request.priority}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-brown dark:text-dark-muted mt-0.5 flex-shrink-0" />
          <p className="text-sm text-deepbrown dark:text-dark-text line-clamp-2">
            {request.reason}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brown dark:text-dark-muted">
          <Calendar className="w-4 h-4" />
          <span>
            Requested {request.createdAt ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }) : 'recently'}
          </span>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="w-full px-4 py-2 bg-brown hover:bg-deepbrown text-white rounded-lg transition-colors text-sm font-medium"
      >
        View Details
      </button>
    </motion.div>
  )
}
