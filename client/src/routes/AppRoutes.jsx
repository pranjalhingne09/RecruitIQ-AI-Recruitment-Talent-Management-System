import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { AboutPage } from '../pages/public/AboutPage';
import { JobSearchPage } from '../pages/public/JobSearchPage';
import { JobDetailPage } from '../pages/public/JobDetailPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { CandidateRegisterPage } from '../pages/auth/CandidateRegisterPage';
import { RecruiterRegisterPage } from '../pages/auth/RecruiterRegisterPage';

// Candidate Pages
import { CandidateDashboard } from '../pages/candidate/CandidateDashboard';
import { CandidateProfilePage } from '../pages/candidate/CandidateProfilePage';
import { ResumeManagementPage } from '../pages/candidate/ResumeManagementPage';
import { RecommendedJobsPage } from '../pages/candidate/RecommendedJobsPage';
import { MyApplicationsPage } from '../pages/candidate/MyApplicationsPage';
import { ApplicationDetailPage } from '../pages/candidate/ApplicationDetailPage';
import { CandidateInterviewsPage } from '../pages/candidate/CandidateInterviewsPage';

// Recruiter Pages
import { RecruiterDashboard } from '../pages/recruiter/RecruiterDashboard';
import { ManageJobsPage } from '../pages/recruiter/ManageJobsPage';
import { CreateJobPage } from '../pages/recruiter/CreateJobPage';
import { EditJobPage } from '../pages/recruiter/EditJobPage';
import { RecruiterApplicationsPage } from '../pages/recruiter/RecruiterApplicationsPage';
import { RecruiterInterviewsPage } from '../pages/recruiter/RecruiterInterviewsPage';
import { CompanyProfilePage } from '../pages/recruiter/CompanyProfilePage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { JobManagementPage } from '../pages/admin/JobManagementPage';
import { CategoryManagementPage } from '../pages/admin/CategoryManagementPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/candidate" element={<CandidateRegisterPage />} />
        <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
      </Route>

      {/* Candidate Dashboard Routes */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CandidateDashboard />} />
        <Route path="profile" element={<CandidateProfilePage />} />
        <Route path="resumes" element={<ResumeManagementPage />} />
        <Route path="recommendations" element={<RecommendedJobsPage />} />
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="interviews" element={<CandidateInterviewsPage />} />
      </Route>

      {/* Recruiter Dashboard Routes */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RecruiterDashboard />} />
        <Route path="jobs" element={<ManageJobsPage />} />
        <Route path="jobs/create" element={<CreateJobPage />} />
        <Route path="jobs/edit/:id" element={<EditJobPage />} />
        <Route path="applications" element={<RecruiterApplicationsPage />} />
        <Route path="interviews" element={<RecruiterInterviewsPage />} />
        <Route path="company" element={<CompanyProfilePage />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="jobs" element={<JobManagementPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
