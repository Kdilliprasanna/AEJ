import initSqlJs from 'sql.js';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqliteDbPath = path.join(__dirname, 'data', 'career_ai.sqlite');

let SQL = null;
let db = null;
let isInitialized = false;

export async function initSqlite() {
  if (isInitialized && db) return db;

  try {
    SQL = await initSqlJs();
    if (existsSync(sqliteDbPath)) {
      const fileBuffer = await fs.readFile(sqliteDbPath);
      db = new SQL.Database(fileBuffer);
      console.log('✅ SQLite Database loaded successfully from career_ai.sqlite');
    } else {
      db = new SQL.Database();
      console.log('⚡ Initializing new SQLite Database at career_ai.sqlite');
    }

    createSchema(db);
    saveSqliteFile();
    isInitialized = true;
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize SQLite database:', error.message);
    throw error;
  }
}

function createSchema(dbInstance) {
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      degree TEXT,
      percentage TEXT,
      summary TEXT,
      skills TEXT,
      target_role TEXT,
      experience_level TEXT,
      preferred_job_types TEXT,
      preferred_locations TEXT,
      links TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      file_name TEXT,
      file_type TEXT,
      resume_text TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS ats_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      resume_id TEXT,
      score REAL,
      section_scores TEXT,
      missing_keywords TEXT,
      recommendations TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      job_id TEXT,
      title TEXT,
      company TEXT,
      platform TEXT,
      status TEXT,
      match_score REAL,
      applied_at TEXT
    );

    CREATE TABLE IF NOT EXISTS mock_test_results (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      category TEXT,
      score REAL,
      total_questions INTEGER,
      answers TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      current_streak INTEGER DEFAULT 0,
      best_streak INTEGER DEFAULT 0,
      last_practice_date TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      description TEXT,
      type TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      role TEXT,
      message TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS saved_jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      job_id TEXT,
      title TEXT,
      company TEXT,
      job_data TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      event_name TEXT,
      metadata TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS copilot_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      job_title TEXT,
      company TEXT,
      job_description TEXT,
      match_score REAL,
      analysis TEXT,
      created_at TEXT
    );
  `;
  dbInstance.run(schemaSql);
}

export function saveSqliteFile() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFile(sqliteDbPath, buffer).catch((err) => {
      console.warn('⚠️ SQLite save file notice:', err.message);
    });
  } catch (err) {
    console.warn('⚠️ SQLite export notice:', err.message);
  }
}

export function isSqliteActive() {
  return Boolean(db && isInitialized);
}

export function getSqliteDb() {
  return db;
}

export async function readFromSqlite() {
  if (!db) await initSqlite();
  
  try {
    const safeExec = (sql) => {
      try {
        const res = db.exec(sql);
        if (!res || !res.length) return [];
        const { columns, values } = res[0];
        return values.map((row) => {
          const obj = {};
          columns.forEach((col, i) => {
            obj[col] = row[i];
          });
          return obj;
        });
      } catch (err) {
        return [];
      }
    };

    const users = safeExec('SELECT * FROM users').map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.password_hash,
      createdAt: u.created_at,
    }));

    const profiles = safeExec('SELECT * FROM profiles').map((p) => ({
      id: p.id,
      userId: p.user_id,
      user_id: p.user_id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      degree: p.degree,
      percentage: p.percentage,
      summary: p.summary,
      skills: p.skills ? JSON.parse(p.skills) : [],
      targetRole: p.target_role,
      experience: p.experience_level,
      preferredJobTypes: p.preferred_job_types ? JSON.parse(p.preferred_job_types) : [],
      preferredLocations: p.preferred_locations ? JSON.parse(p.preferred_locations) : [],
      links: p.links ? JSON.parse(p.links) : {},
      updatedAt: p.updated_at,
    }));

    const resumes = safeExec('SELECT * FROM resumes').map((r) => ({
      id: r.id,
      userId: r.user_id,
      user_id: r.user_id,
      fileName: r.file_name,
      fileType: r.file_type,
      text: r.resume_text,
      createdAt: r.created_at,
    }));

    const atsReports = safeExec('SELECT * FROM ats_reports').map((a) => ({
      id: a.id,
      userId: a.user_id,
      user_id: a.user_id,
      score: Number(a.score || 0),
      sectionScores: a.section_scores ? JSON.parse(a.section_scores) : {},
      missingKeywords: a.missing_keywords ? JSON.parse(a.missing_keywords) : [],
      recommendations: a.recommendations ? JSON.parse(a.recommendations) : [],
      createdAt: a.created_at,
    }));

    const appliedJobs = safeExec('SELECT * FROM applications').map((app) => ({
      id: app.id,
      userId: app.user_id,
      user_id: app.user_id,
      jobId: app.job_id,
      title: app.title,
      company: app.company,
      platform: app.platform,
      status: app.status,
      matchScore: app.match_score,
      appliedAt: app.applied_at,
    }));

    const mockTestResults = safeExec('SELECT * FROM mock_test_results').map((m) => ({
      id: m.id,
      userId: m.user_id,
      user_id: m.user_id,
      category: m.category,
      score: m.score,
      totalQuestions: m.total_questions,
      answers: m.answers ? JSON.parse(m.answers) : {},
      createdAt: m.created_at,
    }));

    const streaks = safeExec('SELECT * FROM streaks').map((s) => ({
      id: s.id,
      userId: s.user_id,
      user_id: s.user_id,
      current: s.current_streak,
      best: s.best_streak,
      lastPracticeDate: s.last_practice_date,
    }));

    const notifications = safeExec('SELECT * FROM notifications').map((n) => ({
      id: n.id,
      userId: n.user_id,
      user_id: n.user_id,
      title: n.title,
      description: n.description,
      type: n.type,
      isRead: Boolean(n.is_read),
      createdAt: n.created_at,
    }));

    const chatMessages = safeExec('SELECT * FROM chat_messages').map((c) => ({
      id: c.id,
      userId: c.user_id,
      user_id: c.user_id,
      role: c.role,
      message: c.message,
      createdAt: c.created_at,
    }));

    const savedJobs = safeExec('SELECT * FROM saved_jobs').map((s) => ({
      id: s.id,
      userId: s.user_id,
      user_id: s.user_id,
      jobId: s.job_id,
      title: s.title,
      company: s.company,
      jobData: s.job_data ? JSON.parse(s.job_data) : {},
      createdAt: s.created_at,
    }));

    const analyticsEvents = safeExec('SELECT * FROM analytics_events').map((e) => ({
      id: e.id,
      userId: e.user_id,
      user_id: e.user_id,
      eventName: e.event_name,
      metadata: e.metadata ? JSON.parse(e.metadata) : {},
      createdAt: e.created_at,
    }));

    const copilotSessions = safeExec('SELECT * FROM copilot_sessions').map((c) => ({
      id: c.id,
      userId: c.user_id,
      user_id: c.user_id,
      jobTitle: c.job_title,
      company: c.company,
      jobDescription: c.job_description,
      matchScore: c.match_score,
      analysis: c.analysis ? JSON.parse(c.analysis) : {},
      createdAt: c.created_at,
    }));

    return {
      users,
      profiles,
      resumes,
      atsReports,
      appliedJobs,
      mockTestResults,
      streaks,
      notifications,
      chatMessages,
      savedJobs,
      analyticsEvents,
      copilotSessions,
    };
  } catch (err) {
    console.warn('⚠️ SQLite read warning:', err.message);
    return null;
  }
}

export async function syncToSqlite(dbData) {
  if (!db) await initSqlite();

  try {
    // Sync Users
    if (Array.isArray(dbData.users)) {
      const stmt = db.prepare(`
        INSERT INTO users (id, name, email, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name, email=excluded.email, password_hash=excluded.password_hash;
      `);
      for (const u of dbData.users) {
        if (!u.id) continue;
        stmt.run([u.id, u.name || '', u.email || '', u.passwordHash || '', u.createdAt || new Date().toISOString()]);
      }
      stmt.free();
    }

    // Sync Profiles
    if (Array.isArray(dbData.profiles)) {
      const stmt = db.prepare(`
        INSERT INTO profiles (id, user_id, name, email, phone, degree, percentage, summary, skills, target_role, experience_level, preferred_job_types, preferred_locations, links, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name, email=excluded.email, phone=excluded.phone, degree=excluded.degree,
          percentage=excluded.percentage, summary=excluded.summary, skills=excluded.skills,
          target_role=excluded.target_role, experience_level=excluded.experience_level,
          preferred_job_types=excluded.preferred_job_types, preferred_locations=excluded.preferred_locations,
          links=excluded.links, updated_at=excluded.updated_at;
      `);
      for (const p of dbData.profiles) {
        if (!p.id) continue;
        stmt.run([
          p.id,
          p.userId || p.user_id || '',
          p.name || '',
          p.email || '',
          p.phone || '',
          p.degree || '',
          p.percentage || '',
          p.summary || '',
          JSON.stringify(p.skills || []),
          p.targetRole || '',
          p.experience || '',
          JSON.stringify(p.preferredJobTypes || []),
          JSON.stringify(p.preferredLocations || []),
          JSON.stringify(p.links || {}),
          p.updatedAt || new Date().toISOString(),
        ]);
      }
      stmt.free();
    }

    // Sync Applications
    if (Array.isArray(dbData.appliedJobs)) {
      const stmt = db.prepare(`
        INSERT INTO applications (id, user_id, job_id, title, company, platform, status, match_score, applied_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          status=excluded.status, match_score=excluded.match_score;
      `);
      for (const app of dbData.appliedJobs) {
        if (!app.id) continue;
        stmt.run([
          app.id,
          app.userId || app.user_id || '',
          app.jobId || '',
          app.title || '',
          app.company || '',
          app.platform || '',
          app.status || 'Applied',
          app.matchScore || 0,
          app.appliedAt || new Date().toISOString(),
        ]);
      }
      stmt.free();
    }

    // Save SQLite binary to disk
    saveSqliteFile();
    return true;
  } catch (err) {
    console.error('⚠️ SQLite sync error:', err.message);
    return false;
  }
}
