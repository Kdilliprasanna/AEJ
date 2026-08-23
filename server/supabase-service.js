import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('✅ Supabase client initialized cleanly.');
  } catch (err) {
    console.error('⚠️ Supabase client initialization failed:', err.message);
  }
}

export function isSupabaseActive() {
  return Boolean(supabaseClient && supabaseUrl && supabaseKey);
}

export function getSupabaseClient() {
  return supabaseClient;
}

export async function verifySupabaseConnection() {
  if (!isSupabaseActive()) {
    return { ok: false, error: 'Supabase client credentials not configured' };
  }
  try {
    const { count, error } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error && error.code !== 'PGRST116') {
      return { ok: false, error: error.message };
    }
    return { ok: true, active: true, count: count || 0 };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Reads all domain entities from Supabase PostgreSQL for persistent operation
 */
export async function readFromSupabase() {
  if (!isSupabaseActive()) return null;
  const client = getSupabaseClient();

  try {
    const [
      { data: profiles },
      { data: resumes },
      { data: atsReports },
      { data: applications },
      { data: mockTestResults },
      { data: streaks },
      { data: notifications },
      { data: chatMessages },
      { data: savedJobs },
      { data: analyticsEvents },
      { data: copilotSessions }
    ] = await Promise.all([
      client.from('profiles').select('*').catch(() => ({ data: [] })),
      client.from('resumes').select('*').catch(() => ({ data: [] })),
      client.from('ats_reports').select('*').catch(() => ({ data: [] })),
      client.from('applications').select('*').catch(() => ({ data: [] })),
      client.from('mock_test_results').select('*').catch(() => ({ data: [] })),
      client.from('streaks').select('*').catch(() => ({ data: [] })),
      client.from('notifications').select('*').catch(() => ({ data: [] })),
      client.from('chat_messages').select('*').catch(() => ({ data: [] })),
      client.from('saved_jobs').select('*').catch(() => ({ data: [] })),
      client.from('analytics_events').select('*').catch(() => ({ data: [] })),
      client.from('copilot_sessions').select('*').catch(() => ({ data: [] })),
    ]);

    return {
      profiles: (profiles || []).map(p => ({
        id: p.id,
        userId: p.user_id,
        user_id: p.user_id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        degree: p.degree,
        percentage: p.percentage,
        summary: p.summary,
        skills: p.skills || [],
        targetRole: p.target_role,
        experience: p.experience_level,
        preferredJobTypes: p.preferred_job_types || [],
        preferredLocations: p.preferred_locations || [],
        links: p.links || {}
      })),
      resumes: (resumes || []).map(r => ({
        id: r.id,
        userId: r.user_id,
        user_id: r.user_id,
        fileName: r.file_name,
        fileType: r.file_type,
        text: r.resume_text,
        createdAt: r.created_at
      })),
      atsReports: (atsReports || []).map(a => ({
        id: a.id,
        userId: a.user_id,
        user_id: a.user_id,
        score: Number(a.score || 0),
        sectionScores: a.section_scores || {},
        missingKeywords: a.missing_keywords || [],
        recommendations: a.recommendations || [],
        createdAt: a.created_at
      })),
      appliedJobs: (applications || []).map(app => ({
        id: app.id,
        userId: app.user_id,
        user_id: app.user_id,
        jobId: app.job_id,
        title: app.title,
        company: app.company,
        platform: app.platform,
        status: app.status,
        matchScore: app.match_score,
        appliedAt: app.applied_at
      })),
      mockTestResults: (mockTestResults || []).map(m => ({
        id: m.id,
        userId: m.user_id,
        user_id: m.user_id,
        category: m.category,
        score: m.score,
        totalQuestions: m.total_questions,
        answers: m.answers || {},
        createdAt: m.created_at
      })),
      streaks: (streaks || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        user_id: s.user_id,
        current: s.current_streak,
        best: s.best_streak,
        lastPracticeDate: s.last_practice_date
      })),
      notifications: (notifications || []).map(n => ({
        id: n.id,
        userId: n.user_id,
        user_id: n.user_id,
        title: n.title,
        description: n.description,
        type: n.type,
        isRead: n.is_read,
        createdAt: n.created_at
      })),
      chatMessages: (chatMessages || []).map(c => ({
        id: c.id,
        userId: c.user_id,
        user_id: c.user_id,
        role: c.role,
        message: c.message,
        createdAt: c.created_at
      })),
      savedJobs: (savedJobs || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        user_id: s.user_id,
        jobId: s.job_id,
        title: s.title,
        company: s.company,
        jobData: s.job_data || {},
        createdAt: s.created_at
      })),
      analyticsEvents: (analyticsEvents || []).map(e => ({
        id: e.id,
        userId: e.user_id,
        user_id: e.user_id,
        eventName: e.event_name,
        metadata: e.metadata || {},
        createdAt: e.created_at
      })),
      copilotSessions: (copilotSessions || []).map(c => ({
        id: c.id,
        userId: c.user_id,
        user_id: c.user_id,
        jobTitle: c.job_title,
        company: c.company,
        jobDescription: c.job_description,
        matchScore: c.match_score,
        analysis: c.analysis || {},
        createdAt: c.created_at
      }))
    };
  } catch (err) {
    console.warn('⚠️ Supabase read warning:', err.message);
    return null;
  }
}

/**
 * Maps local DB JSON structure into Supabase PostgreSQL tables
 */
export async function syncToSupabase(dbData) {
  if (!isSupabaseActive()) return false;
  const client = getSupabaseClient();
  try {
    // Upsert profiles
    if (Array.isArray(dbData.profiles)) {
      for (const p of dbData.profiles) {
        if (!p.userId && !p.user_id) continue;
        await client.from('profiles').upsert({
          user_id: p.userId || p.user_id,
          name: p.name || '',
          email: p.email || '',
          phone: p.phone || '',
          degree: p.degree || '',
          percentage: p.percentage || '',
          summary: p.summary || '',
          skills: p.skills || [],
          target_role: p.targetRole || '',
          experience_level: p.experience || '',
          preferred_job_types: p.preferredJobTypes || [],
          preferred_locations: p.preferredLocations || [],
          links: p.links || {},
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' }).catch(() => {});
      }
    }

    // Upsert applications
    if (Array.isArray(dbData.appliedJobs)) {
      for (const app of dbData.appliedJobs) {
        if (!app.userId && !app.user_id) continue;
        await client.from('applications').upsert({
          user_id: app.userId || app.user_id,
          job_id: app.jobId || app.id,
          title: app.title || 'Role',
          company: app.company || 'Company',
          platform: app.platform || 'Platform',
          status: app.status || 'Applied',
          match_score: app.matchScore || 0,
          updated_at: new Date().toISOString()
        }).catch(() => {});
      }
    }

    // Upsert copilot sessions
    if (Array.isArray(dbData.copilotSessions)) {
      for (const c of dbData.copilotSessions) {
        if (!c.userId && !c.user_id) continue;
        await client.from('copilot_sessions').upsert({
          user_id: c.userId || c.user_id,
          job_title: c.jobTitle || 'Role',
          company: c.company || 'Company',
          job_description: c.jobDescription || '',
          match_score: c.matchScore || 0,
          analysis: c.analysis || {}
        }).catch(() => {});
      }
    }

    // Upsert analytics events
    if (Array.isArray(dbData.analyticsEvents)) {
      for (const e of dbData.analyticsEvents) {
        if (!e.userId && !e.user_id) continue;
        await client.from('analytics_events').upsert({
          user_id: e.userId || e.user_id,
          event_name: e.eventName || 'event',
          metadata: e.metadata || {}
        }).catch(() => {});
      }
    }

    return true;
  } catch (err) {
    console.error('⚠️ Supabase sync error:', err.message);
    return false;
  }
}
