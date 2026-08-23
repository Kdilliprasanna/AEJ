// Application Management System
// Track, update, and manage job applications

const applicationManager = {
  // Store user applications in memory (or database in production)
  applications: {},

  // Add application
  applyForJob: (userId, jobId, jobData) => {
    if (!applicationManager.applications[userId]) {
      applicationManager.applications[userId] = [];
    }

    const application = {
      id: `app-${Date.now()}`,
      jobId,
      appliedDate: new Date(),
      status: 'applied', // applied, interview_scheduled, rejected, offer
      jobTitle: jobData.title,
      company: jobData.company,
      location: jobData.location,
      salary: jobData.salary,
      applicationNotes: '',
      interviewDate: null,
      companyFeedback: '',
      rejectionReason: null,
      offerDetails: null
    };

    applicationManager.applications[userId].push(application);
    return application;
  },

  // Delete application
  deleteApplication: (userId, applicationId) => {
    if (!applicationManager.applications[userId]) {
      return { success: false, message: 'User not found' };
    }

    const index = applicationManager.applications[userId].findIndex(
      app => app.id === applicationId
    );

    if (index > -1) {
      const deleted = applicationManager.applications[userId].splice(index, 1);
      return { success: true, deleted: deleted[0] };
    }

    return { success: false, message: 'Application not found' };
  },

  // Update application status
  updateApplicationStatus: (userId, applicationId, newStatus, details = {}) => {
    if (!applicationManager.applications[userId]) {
      return { success: false, message: 'User not found' };
    }

    const application = applicationManager.applications[userId].find(
      app => app.id === applicationId
    );

    if (!application) {
      return { success: false, message: 'Application not found' };
    }

    application.status = newStatus;
    application.lastUpdated = new Date();
    
    if (details.interviewDate) application.interviewDate = details.interviewDate;
    if (details.feedback) application.companyFeedback = details.feedback;
    if (details.rejectionReason) application.rejectionReason = details.rejectionReason;
    if (details.offerDetails) application.offerDetails = details.offerDetails;
    if (details.notes) application.applicationNotes = details.notes;

    return { success: true, application };
  },

  // Get all applications
  getApplications: (userId, filters = {}) => {
    if (!applicationManager.applications[userId]) {
      return [];
    }

    let apps = applicationManager.applications[userId];

    // Apply filters
    if (filters.status) {
      apps = apps.filter(app => app.status === filters.status);
    }

    if (filters.company) {
      apps = apps.filter(app =>
        app.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      apps = apps.filter(app => app.appliedDate >= filters.dateFrom);
    }

    // Sort by applied date (newest first)
    return apps.sort((a, b) => b.appliedDate - a.appliedDate);
  },

  // Get application stats
  getApplicationStats: (userId) => {
    if (!applicationManager.applications[userId]) {
      return {
        total: 0,
        applied: 0,
        interview_scheduled: 0,
        rejected: 0,
        offer: 0,
        successRate: 0
      };
    }

    const apps = applicationManager.applications[userId];
    const total = apps.length;
    const applied = apps.filter(a => a.status === 'applied').length;
    const interviewScheduled = apps.filter(a => a.status === 'interview_scheduled').length;
    const rejected = apps.filter(a => a.status === 'rejected').length;
    const offer = apps.filter(a => a.status === 'offer').length;

    return {
      total,
      applied,
      interview_scheduled: interviewScheduled,
      rejected,
      offer,
      successRate: total > 0 ? Math.round((offer / total) * 100) : 0,
      conversion: total > 0 ? Math.round(((interviewScheduled + offer) / total) * 100) : 0
    };
  },

  // Track application timeline
  getApplicationTimeline: (userId, applicationId) => {
    if (!applicationManager.applications[userId]) {
      return null;
    }

    const application = applicationManager.applications[userId].find(
      app => app.id === applicationId
    );

    if (!application) return null;

    return {
      jobTitle: application.jobTitle,
      company: application.company,
      timeline: [
        { 
          status: 'applied', 
          date: application.appliedDate,
          label: 'Applied'
        },
        ...(application.interviewDate ? [{
          status: 'interview_scheduled',
          date: application.interviewDate,
          label: 'Interview Scheduled'
        }] : []),
        ...(application.status === 'rejected' ? [{
          status: 'rejected',
          date: application.lastUpdated,
          label: 'Rejected'
        }] : []),
        ...(application.status === 'offer' ? [{
          status: 'offer',
          date: application.lastUpdated,
          label: 'Offer Received'
        }] : [])
      ]
    };
  }
};

export { applicationManager };
