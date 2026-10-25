import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/interviewService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  Edit,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const RecruiterInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Cancel/Reschedule Modal
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [actionType, setActionType] = useState('complete'); // 'complete' or 'cancel'
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getRecruiterInterviews({
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });
      if (res.success && res.data) {
        setInterviews(res.data);
      }
    } catch (err) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [filterStatus]);

  const handleAction = async (e) => {
    e.preventDefault();
    if (!selectedInterview) return;

    try {
      setSubmitting(true);
      const updateData = {
        status: actionType === 'complete' ? 'completed' : 'cancelled',
        cancellationReason: actionType === 'cancel' ? cancellationReason : undefined,
      };

      const res = await interviewService.updateInterview(selectedInterview._id, updateData);
      if (res.success) {
        toast.success(`Interview marked as ${updateData.status}`);
        setModalOpen(false);
        fetchInterviews();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update interview.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Interview Management Calendar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct scheduled technical screenings, record feedback, and track round outcomes
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="h-36" />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interview sessions found"
          description="Schedule candidate interviews directly from the Applicant Review Pool."
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((iv) => (
            <Card key={iv._id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={iv.status === 'scheduled' ? 'cyan' : 'default'} size="xs">
                      {iv.status.toUpperCase()}
                    </Badge>
                    <Badge variant="purple" size="xs">
                      {iv.type}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {iv.title || `Interview with ${iv.candidate?.name}`}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="text-slate-300 font-semibold">{iv.candidate?.name}</span>
                    <span>({iv.candidate?.email})</span>
                    <span>•</span>
                    <span>Role: {iv.job?.title}</span>
                  </div>
                </div>

                {/* Actions */}
                {iv.status === 'scheduled' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedInterview(iv);
                        setActionType('complete');
                        setModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-semibold text-xs border border-emerald-500/20 transition-colors inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInterview(iv);
                        setActionType('cancel');
                        setModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs border border-rose-500/20 transition-colors inline-flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Session
                    </button>
                  </div>
                )}
              </div>

              {/* Timing details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{new Date(iv.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{iv.startTime} - {iv.endTime}</span>
                </div>
                {iv.meetingLink ? (
                  <a
                    href={iv.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-cyan-400 hover:underline font-medium"
                  >
                    <Video className="w-4 h-4" /> Open Meeting Link
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{iv.location || 'Onsite'}</span>
                  </div>
                )}
              </div>

              {iv.recruiterNotes && (
                <div className="text-xs text-slate-400 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-800/60">
                  <strong className="text-slate-300">Recruiter Notes:</strong> {iv.recruiterNotes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation / Cancellation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={actionType === 'complete' ? 'Mark Interview Completed' : 'Cancel Interview Session'}
        subtitle={`Candidate: ${selectedInterview?.candidate?.name || 'Applicant'}`}
      >
        <form onSubmit={handleAction} className="space-y-4">
          {actionType === 'cancel' ? (
            <div>
              <label className="block text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1.5">
                Cancellation Reason
              </label>
              <textarea
                rows={3}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g. Candidate withdrew; role requirements changed; rescheduled by interviewer."
                className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          ) : (
            <p className="text-xs text-slate-300">
              Confirm that this interview round with {selectedInterview?.candidate?.name} has been concluded. You can transition the application to "Offered" or "Under Review" next.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Back
            </Button>
            <Button
              variant={actionType === 'complete' ? 'success' : 'danger'}
              type="submit"
              isLoading={submitting}
            >
              {actionType === 'complete' ? 'Confirm Completion' : 'Cancel Interview'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
