import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Briefcase, Zap, Award, X } from 'lucide-react';
import '../../index.css';
import { apiFetch } from '../../api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/notifications/live?limit=50');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    if (filter === 'job-match') return n.type === 'job-match';
    if (filter === 'resume') return n.type === 'resume-upload';
    if (filter === 'achievement') return n.type === 'achievement';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'job-match':
        return <Briefcase size={20} />;
      case 'resume-upload':
        return <CheckCircle size={20} />;
      case 'achievement':
        return <Award size={20} />;
      case 'streak':
        return <Zap size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'job-match':
        return { bg: '#EBF8FF', border: '#3B82F6', text: '#1D4ED8' };
      case 'resume-upload':
        return { bg: '#ECFDF5', border: '#10B981', text: '#059669' };
      case 'achievement':
        return { bg: '#FEF3C7', border: '#F59E0B', text: '#D97706' };
      case 'streak':
        return { bg: '#FCE7F3', border: '#EC4899', text: '#BE185D' };
      default:
        return { bg: '#F3F4F6', border: '#9CA3AF', text: '#4B5563' };
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <section style={{ padding: '20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Bell size={32} style={{ color: 'var(--accent)' }} />
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{
                display: 'inline-block',
                background: '#EF4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginTop: '8px'
              }}>
                {unreadCount} Unread
              </span>
            )}
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Stay updated with job matches, resume insights, and career milestones</p>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: '🔔 Unread' },
          { id: 'job-match', label: '💼 Job Matches' },
          { id: 'resume', label: '✅ Resume' },
          { id: 'achievement', label: '🏆 Achievements' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 200ms',
              background: filter === f.id ? 'var(--accent)' : 'var(--surface)',
              color: filter === f.id ? 'white' : 'var(--text)',
              boxShadow: filter === f.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <Bell size={32} style={{ color: 'var(--accent)', animation: 'spin 2s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading notifications...</p>
          </div>
        )}

        {!loading && filteredNotifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--surface)', borderRadius: '12px' }}>
            <Bell size={48} style={{ color: 'var(--border)', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', color: 'var(--text)', fontWeight: '500', margin: 0 }}>No notifications yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
              {filter !== 'all' ? 'Try changing filters' : 'Upload a resume to get started with job matches'}
            </p>
          </div>
        )}

        {filteredNotifications.map(notification => {
          const colors = getColor(notification.type);
          return (
            <div
              key={notification.id}
              style={{
                background: colors.bg,
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                transition: 'all 200ms',
                opacity: notification.unread ? 1 : 0.8,
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ color: colors.text, flexShrink: 0, marginTop: '2px' }}>
                {getIcon(notification.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '4px', fontWeight: '600', color: colors.text, fontSize: '15px' }}>
                      {notification.title || 'Notification'}
                    </h3>
                    <p style={{ margin: 0, marginBottom: '8px', fontSize: '14px', color: 'var(--text)', lineHeight: '1.4' }}>
                      {notification.description || notification.message}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {formatDate(notification.date || notification.createdAt)}
                      </span>
                      {notification.unread && (
                        <span style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          background: colors.text,
                          borderRadius: '50%'
                        }} />
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 200ms'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <X size={18} />
                  </button>
                </div>

                {notification.unread && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    style={{
                      background: colors.text,
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '8px',
                      transition: 'all 200ms'
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotifications.length > 0 && (
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>{unreadCount}</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Unread</p>
          </div>
          <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>{notifications.length}</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Total</p>
          </div>
        </div>
      )}
    </section>
  );
}
