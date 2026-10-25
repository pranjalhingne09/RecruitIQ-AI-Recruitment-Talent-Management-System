import api from './api';

export const matchingService = {
  getJobMatch: (jobId) => api.get(`/matching/job/${jobId}`),
  getRecommendedJobs: () => api.get('/matching/recommendations'),
  getAiApplicationInsights: (applicationId) =>
    api.get(`/matching/application/${applicationId}/ai-insights`),
};
