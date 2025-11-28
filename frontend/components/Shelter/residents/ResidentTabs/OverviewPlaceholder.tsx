'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export function OverviewPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      role="tabpanel"
      id="overview-panel"
      className="bg-beige dark:bg-dark-surface rounded-2xl p-12 text-center shadow-lg"
    >
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-tan dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-brown dark:text-dark-muted" />
        </div>
        <h3 className="text-2xl font-bold text-deepbrown dark:text-dark-text mb-2">
          Overview Coming Soon
        </h3>
        <p className="text-brown dark:text-dark-muted">
          This tab will display detailed resident profile information, contact details, notes,
          and quick actions.
        </p>
      </div>
    </motion.div>
  )
}
