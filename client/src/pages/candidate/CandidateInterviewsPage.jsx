import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Building,
  User,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CandidateInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await api.get('/candidates/interviews');
        if (res.success && res.data) {
          setInterviews(res.data);
        }
      } catch (err) {
        toast.error('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
          Scheduled Interviews & Screenings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review upcoming technical rounds, onsite meetings, and interviewer contact details
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={2} height="h-36" />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews currently scheduled"
          description="When a recruiter moves your application to the interview stage, dates and meeting links will appear here."
        />
      ) : (
        <div className="space-y-4">
          {interviews.map((iv) => (
            <Card key={iv._id} className="p-6 space-y-4 border-indigo-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="cyan" size="xs">
                      {iv.type.toUpperCase()}
                    </Badge>
                    <Badge variant={iv.status === 'scheduled' ? 'primary' : 'default'} size="xs">
                      {iv.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {iv.title || `Interview for ${iv.job?.title}`}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="text-slate-300 font-semibold">{iv.job?.company?.name}</span>
                    <span>•</span>
                    <span>{iv.job?.location}</span>
                  </div>
                </div>

                {iv.meetingLink && (
                  <a
                    href={iv.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all shrink-0"
                  >
                    <Video className="w-4 h-4" /> Join Video Meeting
                  </a>
                )}
              </div>

              {/* Schedule time card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{new Date(iv.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{iv.startTime} - {iv.endTime}</span>
                </div>
                {iv.location ? (
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{iv.location}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>Recruiter: {iv.recruiter?.name || 'Talent Team'}</span>
                  </div>
                )}
              </div>

              {iv.recruiterNotes && (
                <div className="text-xs text-slate-400 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-800/60">
                  <strong className="text-slate-300">Preparation Notes:</strong> {iv.recruiterNotes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
