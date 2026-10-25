import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { matchingService } from '../../services/matchingService';
import { Sparkles, Brain, CheckCircle, AlertTriangle, HelpCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AiInsightsModal = ({ isOpen, onClose, applicationId, candidateName }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && applicationId) {
      loadInsights();
    }
  }, [isOpen, applicationId]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const res = await matchingService.getAiApplicationInsights(applicationId);
      if (res.success && res.data) {
        setInsights(res.data);
      }
    } catch (err) {
      console.warn('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Resume Screening Intelligence"
      subtitle={`Candidate: ${candidateName || 'Applicant'}`}
      maxWidth="max-w-3xl"
    >
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400">Synthesizing resume skills and qualifications...</p>
        </div>
      ) : !insights ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Unable to generate insights at this time.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Engine Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">
                Engine: <span className="text-cyan-400 capitalize">{insights.engine}</span>
              </span>
            </div>
            <Badge variant={insights.isExternalAiActive ? 'primary' : 'cyan'} size="xs">
              {insights.isExternalAiActive ? 'External LLM Active' : 'Deterministic Rule Engine'}
            </Badge>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Executive Synthesis
            </h4>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              {insights.summary}
            </div>
          </div>

          {/* Strengths & Development Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Strengths */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" /> Key Strengths
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {insights.keyStrengths?.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Development Areas */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4" /> Focus Areas / Missing Skills
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {insights.developmentAreas?.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested Interview Questions */}
          {insights.suggestedInterviewQuestions?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-400" /> Suggested Interview Questions
              </h4>
              <div className="space-y-2">
                {insights.suggestedInterviewQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="font-bold text-indigo-400 mr-2">Q{idx + 1}:</span>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ethical Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{insights.disclaimer}</span>
          </div>
        </div>
      )}
    </Modal>
  );
};
