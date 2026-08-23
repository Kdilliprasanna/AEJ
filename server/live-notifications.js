// Live Notification & Admin Panel System
// Real-time job updates and notifications

const liveNotificationSystem = {
  notifications: {},
  adminPanel: {
    settings: {
      updateFrequency: 'real-time', // real-time, hourly, daily
      enableNotifications: true,
      notificationChannels: ['in-app', 'email', 'browser'],
      autoFetchPlatforms: ['linkedin', 'indeed', 'naukri', 'internshala', 'angel']
    },

    // Add new job from external platform
    addJobFromPlatform: (platform, jobData) => {
      const normalized = {
        id: `${platform}-${Date.now()}`,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location || 'Remote',
        type: jobData.type || 'full-time',
        salary: jobData.salary || 'Not disclosed',
        posted: new Date(),
        source: platform,
        url: jobData.url,
        requiredSkills: jobData.skills || [],
        description: jobData.description,
        education: jobData.education || ['B.Tech'],
        minExperience: jobData.experience || 0,
        targetRoles: jobData.roles || []
      };

      // Broadcast to all active users
      liveNotificationSystem.broadcastNotification({
        type: 'new_job',
        title: `New ${jobData.title} at ${jobData.company}`,
        description: `New job posted on ${platform}`,
        job: normalized,
        timestamp: new Date()
      });

      return normalized;
    },

    // Create bulk upload for multiple jobs
    bulkAddJobs: (jobs, platform) => {
      return jobs.map(job => liveNotificationSystem.adminPanel.addJobFromPlatform(platform, job));
    },

    // Remove expired jobs
    removeExpiredJobs: (daysSincePosted = 90) => {
      const cutoffDate = new Date(Date.now() - daysSincePosted * 24 * 60 * 60 * 1000);
      // Implementation would go here
      return { removed: 0 };
    }
  },

  // Send notification to user
  sendNotification: (userId, notification) => {
    if (!liveNotificationSystem.notifications[userId]) {
      liveNotificationSystem.notifications[userId] = [];
    }

    const fullNotification = {
      id: `notif-${Date.now()}`,
      read: false,
      ...notification,
      timestamp: new Date()
    };

    liveNotificationSystem.notifications[userId].unshift(fullNotification);
    
    // Keep only last 100 notifications
    if (liveNotificationSystem.notifications[userId].length > 100) {
      liveNotificationSystem.notifications[userId].pop();
    }

    return fullNotification;
  },

  // Broadcast to all users
  broadcastNotification: (notification) => {
    // In production, this would use WebSockets
    // For now, we'll store it for retrieval
    liveNotificationSystem.lastBroadcast = {
      notification,
      timestamp: new Date()
    };
  },

  // Get notifications for user
  getNotifications: (userId, filters = {}) => {
    const userNotifs = liveNotificationSystem.notifications[userId] || [];
    
    let filtered = userNotifs;

    if (filters.unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    if (filters.type) {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  },

  // Mark as read
  markAsRead: (userId, notificationId) => {
    if (!liveNotificationSystem.notifications[userId]) return false;

    const notif = liveNotificationSystem.notifications[userId].find(
      n => n.id === notificationId
    );

    if (notif) {
      notif.read = true;
      return true;
    }

    return false;
  },

  // Get unread count
  getUnreadCount: (userId) => {
    return (liveNotificationSystem.notifications[userId] || []).filter(
      n => !n.read
    ).length;
  },

  // Stream notifications (for real-time updates)
  createNotificationStream: () => {
    return {
      subscribe: (userId, callback) => {
        // In production, use WebSocket
        const unread = liveNotificationSystem.getNotifications(userId, { unreadOnly: true });
        callback(unread);
      },
      unsubscribe: (userId) => {
        // Cleanup
      }
    };
  }
};

export { liveNotificationSystem };
