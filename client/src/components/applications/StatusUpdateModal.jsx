import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { applicationService } from '../../services/applicationService';
import toast from 'react-hot-toast';

export const StatusUpdateModal = ({ isOpen, onClose, application, onUpdated }) => {
  const [status, setStatus] = useState(application?.status || 'UNDER_REVIEW');
  const [note, setNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState(application?.recruiterNotes || '');
  const [submitting, setSubmitting] = useState(false);

  const statuses = [
    { value: 'APPLIED', label: 'Applied' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'SHORTLISTED', label: 'Shortlisted' },
    { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
    { value: 'OFFERED', label: 'Offer Extended' },
    { value: 'HIRED', label: 'Hired' },
    { value: 'REJECTED', label: 'Rejected / Archived' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await applicationService.updateStatus(application._id, {
        status,
        note,
        rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
        recruiterNotes,
      });

      if (res.success) {
        toast.success(`Application updated to ${status}`);
        if (onUpdated) onUpdated(res.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update application status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Recruitment Stage"
      subtitle={`Candidate: ${application?.candidate?.name || 'Applicant'} • Role: ${application?.job?.title || 'Job'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Stage
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {statuses.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {status === 'REJECTED' && (
          <div>
            <label className="block text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1.5">
              Rejection Reason (Recorded for Compliance & Quality)
            </label>
            <textarea
              rows={2}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Lacks required hands-on Kubernetes experience; position filled by internal candidate."
              className="w-full rounded-xl bg-slate-900 border border-rose-500/30 p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Stage Transition Log Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Completed initial phone screen; candidate progressed to technical deep-dive."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Internal Recruiter Notes (Private)
          </label>
          <textarea
            rows={3}
            value={recruiterNotes}
            onChange={(e) => setRecruiterNotes(e.target.value)}
            placeholder="Confidential interview notes, compensation alignment, cultural fit..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={submitting}>
            Save Status
          </Button>
        </div>
      </form>
    </Modal>
  );
};
