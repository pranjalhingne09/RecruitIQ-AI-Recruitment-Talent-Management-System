import { Interview } from '../models/Interview.js';
import { Application, APPLICATION_STATUS } from '../models/Application.js';
import { createNotification } from '../services/notificationService.js';
import { sendSuccess, sendCreated, sendError } from '../utils/apiResponse.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Schedule an Interview
// @route   POST /api/interviews
// @access  Private (Recruiter)
export const scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      title,
      scheduledDate,
      startTime,
      endTime,
      type = 'online',
      meetingLink,
      location,
      recruiterNotes,
    } = req.body;

    const application = await Application.findById(applicationId).populate('job candidate');
    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized. You can only schedule interviews for your own job applicants.', 403);
    }

    const interviewDate = new Date(scheduledDate);

    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      candidate: application.candidate._id,
      recruiter: req.user.id,
      title: title || `Interview for ${application.job.title}`,
      scheduledDate: interviewDate,
      startTime,
      endTime,
      type,
      meetingLink: meetingLink || '',
      location: location || '',
      recruiterNotes: recruiterNotes || '',
      status: 'scheduled',
    });

    // Update application status to INTERVIEW_SCHEDULED
    application.status = APPLICATION_STATUS.INTERVIEW_SCHEDULED;
    application.statusHistory.push({
      status: APPLICATION_STATUS.INTERVIEW_SCHEDULED,
      updatedBy: req.user.id,
      note: `Interview scheduled for ${interviewDate.toLocaleDateString()} from ${startTime} to ${endTime} (${type}).`,
      timestamp: new Date(),
    });
    await application.save();

    // Create Notification for candidate
    await createNotification({
      recipientId: application.candidate._id,
      title: 'Interview Scheduled',
      message: `An interview has been scheduled for "${application.job.title}" on ${interviewDate.toLocaleDateString()} at ${startTime}.`,
      type: 'interview_scheduled',
      link: '/candidate/interviews',
    });

    await logAudit({
      userId: req.user.id,
      action: 'INTERVIEW_SCHEDULED',
      resource: 'Interview',
      resourceId: interview._id,
      details: {
        applicationId: application._id,
        scheduledDate: interviewDate,
      },
      req,
    });

    return sendCreated(res, 'Interview scheduled successfully', interview);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recruiter's Interviews
// @route   GET /api/interviews/recruiter
// @access  Private (Recruiter)
export const getRecruiterInterviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { recruiter: req.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const interviews = await Interview.find(query)
      .populate('job', 'title location company')
      .populate('candidate', 'name email phone avatar')
      .sort({ scheduledDate: 1, startTime: 1 });

    return sendSuccess(res, 'Recruiter interviews retrieved', interviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Candidate's Interviews
// @route   GET /api/interviews/candidate
// @access  Private (Candidate)
export const getCandidateInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ candidate: req.user.id })
      .populate({
        path: 'job',
        select: 'title location company',
        populate: { path: 'company', select: 'name logo' },
      })
      .populate('recruiter', 'name email phone avatar')
      .sort({ scheduledDate: 1, startTime: 1 });

    return sendSuccess(res, 'Candidate interviews retrieved', interviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Update / Reschedule / Cancel an Interview
// @route   PATCH /api/interviews/:id
// @access  Private (Recruiter)
export const updateInterview = async (req, res, next) => {
  try {
    const { status, scheduledDate, startTime, endTime, type, meetingLink, location, recruiterNotes, cancellationReason } = req.body;

    const interview = await Interview.findById(req.params.id).populate('job candidate');
    if (!interview) {
      return sendError(res, 'Interview record not found', 404);
    }

    if (interview.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized to modify this interview.', 403);
    }

    if (status) interview.status = status;
    if (scheduledDate) interview.scheduledDate = new Date(scheduledDate);
    if (startTime) interview.startTime = startTime;
    if (endTime) interview.endTime = endTime;
    if (type) interview.type = type;
    if (meetingLink !== undefined) interview.meetingLink = meetingLink;
    if (location !== undefined) interview.location = location;
    if (recruiterNotes !== undefined) interview.recruiterNotes = recruiterNotes;
    if (cancellationReason !== undefined) interview.cancellationReason = cancellationReason;

    await interview.save();

    // Notify candidate
    let notifMessage = `Your interview for "${interview.job.title}" has been updated.`;
    if (status === 'cancelled') {
      notifMessage = `Your interview for "${interview.job.title}" was cancelled. Reason: ${cancellationReason || 'Scheduling adjustment'}.`;
    } else if (scheduledDate || startTime) {
      notifMessage = `Your interview for "${interview.job.title}" was rescheduled to ${new Date(interview.scheduledDate).toLocaleDateString()} at ${interview.startTime}.`;
    }

    await createNotification({
      recipientId: interview.candidate._id,
      title: `Interview ${status ? status.toUpperCase() : 'Updated'}`,
      message: notifMessage,
      type: 'interview_scheduled',
      link: '/candidate/interviews',
    });

    await logAudit({
      userId: req.user.id,
      action: 'INTERVIEW_UPDATED',
      resource: 'Interview',
      resourceId: interview._id,
      details: { status: interview.status },
      req,
    });

    return sendSuccess(res, 'Interview updated successfully', interview);
  } catch (error) {
    next(error);
  }
};
