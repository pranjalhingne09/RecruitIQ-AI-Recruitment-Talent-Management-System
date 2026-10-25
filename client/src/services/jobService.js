import api from './api';

export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getRecruiterJobs: () => api.get('/jobs/recruiter/my-jobs'),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  toggleStatus: (id) => api.patch(`/jobs/${id}/status`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};
