import React, { useState, useEffect } from 'react';
import { resumeService } from '../../services/resumeService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ResumeManagementPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getMyResumes();
      if (res.success && res.data) {
        setResumes(res.data);
      }
    } catch (err) {
      toast.error('Failed to load uploaded resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file extension
      const validExts = ['.pdf', '.docx', '.doc'];
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!validExts.includes(ext)) {
        toast.error('Only PDF and DOCX files are supported.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a resume file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      setUploading(true);
      const res = await resumeService.uploadResume(formData);
      if (res.success) {
        toast.success('Resume parsed and skills extracted successfully!');
        setSelectedFile(null);
        fetchResumes();
      }
    } catch (err) {
      toast.error(err.message || 'Resume upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume from your vault?')) return;
    try {
      await resumeService.deleteResume(id);
      toast.success('Resume removed.');
      fetchResumes();
    } catch (err) {
      toast.error(err.message || 'Failed to delete resume.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
          Candidate Resume Vault
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF or DOCX resumes for automated skill extraction, profiling, and explainable job matching
        </p>
      </div>

      {/* Upload Box */}
      <Card className="p-8 border-dashed border-2 border-slate-800 hover:border-indigo-500/50 transition-colors">
        <form onSubmit={handleUpload} className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              Upload Your Latest Resume Document
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Supports PDF (.pdf) and Microsoft Word (.docx). Max file size 5MB. Our algorithm automatically extracts verified competencies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all">
                <FileText className="w-4 h-4 text-indigo-400" />
                {selectedFile ? selectedFile.name : 'Choose File from Computer'}
              </span>
            </label>

            {selectedFile && (
              <Button variant="primary" type="submit" size="md" isLoading={uploading} icon={Sparkles}>
                Parse & Extract Skills
              </Button>
            )}
          </div>

          {selectedFile && (
            <p className="text-[11px] text-cyan-400">
              Ready to upload: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </form>
      </Card>

      {/* Resumes List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
          Uploaded Resumes in Vault ({resumes.length})
        </h2>

        {loading ? (
          <LoadingSkeleton count={2} height="h-32" />
        ) : resumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No resumes in vault"
            description="Upload your resume above to unlock automated skill extraction and transparent job match scoring."
          />
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <Card key={resume._id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {resume.originalName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{(resume.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>Uploaded {new Date(resume.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <Badge variant="cyan" size="xs">
                          {resume.parseStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Extracted Skills Chips */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Verified Extracted Skills ({resume.extractedSkills?.length || 0}):
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {resume.extractedSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
