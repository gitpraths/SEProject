/**
 * AI Routes - GPU-accelerated AI features
 */

import express from 'express';
import {
  getShelterRecommendations,
  getJobRecommendations,
  analyzeVolunteerNotes,
  getRiskAssessment,
  optimizeVolunteerRoutes,
  provideFeedback,
  getAIStatistics,
  aiHealthCheck,
} from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Health check (public)
router.get('/health', aiHealthCheck);

// Statistics (protected)
router.get('/statistics', protect, getAIStatistics);

// Shelter recommendations
router.get('/recommendations/shelters/:profile_id', protect, getShelterRecommendations);

// Job recommendations
router.get('/recommendations/jobs/:profile_id', protect, getJobRecommendations);

// NLP analysis of volunteer notes
router.post('/analyze/notes/:profile_id', protect, analyzeVolunteerNotes);

// Risk assessment
router.get('/risk/assess/:profile_id', protect, getRiskAssessment);

// Route optimization
router.post('/routes/optimize', protect, optimizeVolunteerRoutes);

// Feedback
router.post('/feedback', protect, provideFeedback);

export default router;
