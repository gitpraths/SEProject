import { setupWorker } from 'msw/browser'
import { authHandlers } from './handlers/authHandlers'
import { profileHandlers } from './handlers/profileHandlers'
import { recommendationsHandlers } from './handlers/recommendationsHandler'
import { followupHandlers } from './handlers/followupHandlers'
import { resourceHandlers } from './handlers/resourceHandlers'
import { matchesHandlers } from './handlers/matchesHandler'
import { analyticsHandlers } from './handlers/analyticsHandler'

export const worker = setupWorker(
  ...authHandlers,
  ...profileHandlers,
  ...recommendationsHandlers,
  ...followupHandlers,
  ...resourceHandlers,
  ...matchesHandlers,
  ...analyticsHandlers
)
