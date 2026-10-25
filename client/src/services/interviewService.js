import api from './api';

export const interviewService = {
  schedule: (data) => api.post('/interviews', data),
  getRecruiterInterviews: (params) => api.get('/interviews/recruiter', { params }),
  getCandidateInterviews: () => api.get('/interviews/candidate'),
  updateInterview: (id, data) => api.patch(`/interviews/${id}`, data),
};
