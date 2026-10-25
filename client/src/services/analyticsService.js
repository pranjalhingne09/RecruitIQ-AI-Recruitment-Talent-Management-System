import api from './api';

export const analyticsService = {
  getAdminAnalytics: () => api.get('/analytics/admin'),
  getRecruiterAnalytics: () => api.get('/analytics/recruiter'),
  getCandidateAnalytics: () => api.get('/analytics/candidate'),
};
