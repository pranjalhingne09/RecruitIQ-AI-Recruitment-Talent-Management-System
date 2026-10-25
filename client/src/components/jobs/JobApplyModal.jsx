import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { resumeService } from '../../services/resumeService';
import { applicationService } from '../../services/applicationService';
import { matchingService } from '../../services/matchingService';
import { FileText, Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const JobApplyModal = ({ isOpen, onClose, job, onApplied }) => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [matchPreview, setMatchPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadResumes();
      if (job?._id) {
        loadMatchPreview();
      }
    }
  }, [isOpen, job]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getMyResumes();
      if (res.success && res.data) {
        setResumes(res.data);
        if (res.data.length > 0) {
          setSelectedResumeId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.warn('Failed to load candidate resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMatchPreview = async () => {
    try {
      const res = await matchingService.getJobMatch(job._id);
      if (res.success && res.data) {
        setMatchPreview(res.data);
      }
    } catch (err) {
      // Ignored if user has no skills yet
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error('Please select or upload a resume to submit your application.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await applicationService.apply({
        jobId: job._id,
        resumeId: selectedResumeId,
        coverLetter,
      });

      if (res.success) {
        toast.success('Application submitted successfully!');
        if (onApplied) onApplied(res.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${job?.title || 'Job'}`}
      subtitle={`${job?.company?.name || 'Company'} • ${job?.location || 'Location'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Match Preview Card */}
        {matchPreview && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-cyan-950/30 border border-indigo-500/30 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                AI Skill Match Alignment
              </span>
              <span className="text-sm font-bold text-cyan-400">
                {matchPreview.matchScore}% Match
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {matchPreview.explanation}
            </p>
            {matchPreview.matchedSkills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {matchPreview.matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resume Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Resume
          </label>
          {loading ? (
            <div className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />
          ) : resumes.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30 text-center">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-300 font-medium">No resumes found in your vault</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Please upload your resume in the Resume Vault before applying.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {resumes.map((resume) => (
                <label
                  key={resume._id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedResumeId === resume._id
                      ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-950/20'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="resumeSelection"
                      value={resume._id}
                      checked={selectedResumeId === resume._id}
                      onChange={() => setSelectedResumeId(resume._id)}
                      className="text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {resume.originalName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Uploaded {new Date(resume.createdAt).toLocaleDateString()} • {resume.extractedSkills?.length || 0} skills detected
                      </p>
                    </div>
                  </div>
                  {selectedResumeId === resume._id && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Cover Letter / Message to Recruiter (Optional)
          </label>
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Introduce yourself, highlight your key projects, and express why you are excited about this role..."
            className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={resumes.length === 0}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
