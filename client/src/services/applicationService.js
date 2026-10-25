import api from './api';

export const applicationService = {
  apply: (data) => api.post('/applications/apply', data),
  getJobApplications: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  getRecruiterAllApplications: (params) => api.get('/applications/recruiter/all', { params }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  withdraw: (id) => api.post(`/applications/${id}/withdraw`),
};
