import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import mongoose from 'mongoose';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('DNS setServers warning:', err.message);
}
import User from './models/User.js';
import Profile from './models/Profile.js';
import Resume from './models/Resume.js';
import AtsReport from './models/AtsReport.js';
import Application from './models/Application.js';
import MockTestResult from './models/MockTestResult.js';
import Streak from './models/Streak.js';
import Notification from './models/Notification.js';
import SavedJob from './models/SavedJob.js';
import ChatMessage from './models/ChatMessage.js';
import Question from './models/Question.js';
import Job from './models/Job.js';
import ResumeTemplate from './models/ResumeTemplate.js';
import { isSupabaseActive, syncToSupabase, readFromSupabase } from './supabase-service.js';
import { initSqlite, readFromSqlite, syncToSqlite, isSqliteActive } from './sqlite-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'dev-db.json');

const emptyDb = () => ({
  users: [],
  profiles: [],
  resumes: [],
  atsReports: [],
  chatMessages: [],
  recommendedRoles: [],
  savedJobs: [],
  appliedJobs: [],
  mockTests: [],
  mockTestResults: [],
  resumeTemplates: [],
  recommendations: [],
  streaks: [],
  resetTokens: [],
  notifications: [],
  jobCache: { jobs: [], lastUpdated: null, keywords: '' },
});

let dbLock = Promise.resolve();

export async function readJsonDb() {
  return new Promise((resolve) => {
    dbLock = dbLock.then(async () => {
      try {
        if (!existsSync(dbPath)) {
          await writeJsonDbInternal(emptyDb());
        }
        const raw = await fs.readFile(dbPath, 'utf8');
        resolve({ ...emptyDb(), ...JSON.parse(raw) });
      } catch (error) {
        console.error('Failed to read JSON database, attempting recovery:', error);
        try {
          const bakPath = dbPath + '.bak';
          if (existsSync(bakPath)) {
            const rawBak = await fs.readFile(bakPath, 'utf8');
            resolve({ ...emptyDb(), ...JSON.parse(rawBak) });
            return;
          }
        } catch (bakError) {
          console.error('Failed to restore from backup:', bakError);
        }
        resolve(emptyDb());
      }
    });
  });
}

export async function writeJsonDb(db) {
  return new Promise((resolve, reject) => {
    dbLock = dbLock.then(async () => {
      try {
        await writeJsonDbInternal(db);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function writeJsonDbInternal(db) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  const raw = JSON.stringify(db, null, 2);
  const tempPath = dbPath + '.tmp';
  await fs.writeFile(tempPath, raw, 'utf8');
  if (existsSync(dbPath)) {
    await fs.copyFile(dbPath, dbPath + '.bak').catch(() => {});
  }
  await fs.rename(tempPath, dbPath);
}

// Database Connection & Mode Helper
let mongoConnectionStatus = {
  configured: false,
  connected: false,
  error: null,
};



export async function initDatabase() {
  const env = process.env.NODE_ENV || 'development';
  const supabaseActive = isSupabaseActive();

  // Initialize local relational SQLite database
  await initSqlite().catch((err) => console.warn('SQLite init warning:', err.message));

  if (env === 'production' && !supabaseActive && !process.env.MONGO_URI) {
    const errorMsg = '🚨 CRITICAL SECURITY ERROR: Running in NODE_ENV=production without Supabase PostgreSQL or MongoDB credentials configured! Public multi-user production deployments must not use local storage.';
    console.error(errorMsg);
    if (process.env.STRICT_PROD_DB === 'true') {
      throw new Error('[PRODUCTION DB SAFETY] Supabase PostgreSQL is required in production.');
    }
  }

  if (!process.env.MONGO_URI) {
    console.log(`Database Mode: ${supabaseActive ? '⚡ Supabase PostgreSQL Active' : '⚡ SQLite Relational Database (server/data/career_ai.sqlite)'} [Env: ${env}]`);
    mongoConnectionStatus = { configured: false, connected: false, error: null };
    return { mode: supabaseActive ? 'supabase' : 'sqlite', connected: true };
  }

  mongoConnectionStatus.configured = true;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    mongoConnectionStatus.connected = true;
    mongoConnectionStatus.error = null;
    console.log('Database Mode: 🍃 MongoDB Atlas / Mongoose Active');
    return { mode: 'mongodb', connected: true };
  } catch (error) {
    mongoConnectionStatus.connected = false;
    mongoConnectionStatus.error = error.message;
    console.warn(`⚠️ MongoDB Connection Failed (${error.message}). Falling back to SQLite local database.`);
    return { mode: supabaseActive ? 'supabase' : 'sqlite', connected: true, error: error.message };
  }
}

export function isMongoActive() {
  return mongoConnectionStatus.connected && mongoose.connection.readyState === 1;
}

export function getDatabaseStatus() {
  const env = process.env.NODE_ENV || 'development';
  const supabaseActive = isSupabaseActive();
  const mongoActive = isMongoActive();
  const sqliteActive = isSqliteActive();

  let mode = 'sqlite';
  let provider = 'SQLite Database';
  if (supabaseActive) {
    mode = 'supabase';
    provider = 'Supabase PostgreSQL';
  } else if (mongoActive) {
    mode = 'mongodb';
    provider = 'MongoDB Atlas';
  }

  const allowedForEnvironment = env !== 'production' || supabaseActive || mongoActive || sqliteActive;
  const ok = allowedForEnvironment;
  const error = !allowedForEnvironment
    ? 'CRITICAL CONFIGURATION ERROR: Production environment (NODE_ENV=production) requires database configuration.'
    : null;

  return {
    ok,
    mode,
    provider,
    environment: env,
    allowedForEnvironment,
    error,
    sqliteActive,
    supabaseActive,
    mongoConfigured: mongoConnectionStatus.configured,
    mongoConnected: mongoActive,
    mongoError: mongoConnectionStatus.error,
    jsonFilePath: dbPath,
    mongooseState: mongoose.connection.readyState,
  };
}

// ============================================================================
// DUAL MODE UNIFIED REPOSITORY IMPLEMENTATION (MONGODB + JSON FALLBACK)
// ============================================================================

export async function readDbCombined() {
  const jsonDb = await readJsonDb();
  const sqliteDb = await readFromSqlite().catch(() => null);

  if (sqliteDb && sqliteDb.users?.length) {
    Object.assign(jsonDb, {
      users: sqliteDb.users.length ? sqliteDb.users : jsonDb.users,
      profiles: sqliteDb.profiles.length ? sqliteDb.profiles : jsonDb.profiles,
      resumes: sqliteDb.resumes.length ? sqliteDb.resumes : jsonDb.resumes,
      atsReports: sqliteDb.atsReports.length ? sqliteDb.atsReports : jsonDb.atsReports,
      appliedJobs: sqliteDb.appliedJobs.length ? sqliteDb.appliedJobs : jsonDb.appliedJobs,
      mockTestResults: sqliteDb.mockTestResults.length ? sqliteDb.mockTestResults : jsonDb.mockTestResults,
      streaks: sqliteDb.streaks.length ? sqliteDb.streaks : jsonDb.streaks,
      notifications: sqliteDb.notifications.length ? sqliteDb.notifications : jsonDb.notifications,
      chatMessages: sqliteDb.chatMessages.length ? sqliteDb.chatMessages : jsonDb.chatMessages,
      savedJobs: sqliteDb.savedJobs.length ? sqliteDb.savedJobs : jsonDb.savedJobs,
    });
  }

  if (isSupabaseActive()) {
    const supaDb = await readFromSupabase();
    if (supaDb) {
      return {
        ...jsonDb,
        profiles: supaDb.profiles?.length ? supaDb.profiles : jsonDb.profiles,
        resumes: supaDb.resumes?.length ? supaDb.resumes : jsonDb.resumes,
        atsReports: supaDb.atsReports?.length ? supaDb.atsReports : jsonDb.atsReports,
        appliedJobs: supaDb.appliedJobs?.length ? supaDb.appliedJobs : jsonDb.appliedJobs,
        mockTestResults: supaDb.mockTestResults?.length ? supaDb.mockTestResults : jsonDb.mockTestResults,
        streaks: supaDb.streaks?.length ? supaDb.streaks : jsonDb.streaks,
        notifications: supaDb.notifications?.length ? supaDb.notifications : jsonDb.notifications,
        chatMessages: supaDb.chatMessages?.length ? supaDb.chatMessages : jsonDb.chatMessages,
        savedJobs: supaDb.savedJobs?.length ? supaDb.savedJobs : jsonDb.savedJobs,
        analyticsEvents: supaDb.analyticsEvents?.length ? supaDb.analyticsEvents : jsonDb.analyticsEvents,
        copilotSessions: supaDb.copilotSessions?.length ? supaDb.copilotSessions : jsonDb.copilotSessions,
      };
    }
  }

  if (!isMongoActive()) {
    return jsonDb;
  }

  try {
    const [users, profiles, resumes, atsReports, appliedJobs, mockTestResults, streaks, notifications, chatMessages, savedJobs, questions, jobs, resumeTemplates] = await Promise.all([
      User.find().lean().catch(() => []),
      Profile.find().lean().catch(() => []),
      Resume.find().lean().catch(() => []),
      AtsReport.find().lean().catch(() => []),
      Application.find().lean().catch(() => []),
      MockTestResult.find().lean().catch(() => []),
      Streak.find().lean().catch(() => []),
      Notification.find().lean().catch(() => []),
      ChatMessage.find().lean().catch(() => []),
      SavedJob.find().lean().catch(() => []),
      Question.find().lean().catch(() => []),
      Job.find().lean().catch(() => []),
      ResumeTemplate.find().lean().catch(() => []),
    ]);

    return {
      ...jsonDb,
      users: users.length ? users : jsonDb.users,
      profiles: profiles.length ? profiles : jsonDb.profiles,
      resumes: resumes.length ? resumes : jsonDb.resumes,
      atsReports: atsReports.length ? atsReports : jsonDb.atsReports,
      appliedJobs: appliedJobs.length ? appliedJobs : jsonDb.appliedJobs,
      mockTestResults: mockTestResults.length ? mockTestResults : jsonDb.mockTestResults,
      streaks: streaks.length ? streaks : jsonDb.streaks,
      notifications: notifications.length ? notifications : jsonDb.notifications,
      chatMessages: chatMessages.length ? chatMessages : jsonDb.chatMessages,
      savedJobs: savedJobs.length ? savedJobs : jsonDb.savedJobs,
      questions: questions.length ? questions : jsonDb.questions,
      jobs: jobs.length ? jobs : jsonDb.jobs,
      resumeTemplates: resumeTemplates.length ? resumeTemplates : jsonDb.resumeTemplates,
    };
  } catch (error) {
    console.warn('MongoDB read failed, returning combined database:', error.message);
    return jsonDb;
  }
}

export async function writeDbCombined(db) {
  // Always persist to local SQLite and JSON DB
  await writeJsonDb(db);
  await syncToSqlite(db).catch((err) => console.warn('SQLite sync notice:', err.message));

  if (isSupabaseActive()) {
    await syncToSupabase(db).catch((err) => console.warn('Supabase sync notice:', err.message));
  }

  if (!isMongoActive()) {
    return;
  }

  try {
    // Upsert Users
    for (const u of db.users || []) {
      await User.findOneAndUpdate({ id: u.id }, { $set: u }, { upsert: true }).catch(() => {});
    }
    // Upsert Profiles
    for (const p of db.profiles || []) {
      await Profile.findOneAndUpdate({ id: p.id || p.userId }, { $set: p }, { upsert: true }).catch(() => {});
    }
    // Upsert Resumes
    for (const r of db.resumes || []) {
      await Resume.findOneAndUpdate({ id: r.id }, { $set: r }, { upsert: true }).catch(() => {});
    }
    // Upsert ATS Reports
    for (const a of db.atsReports || []) {
      await AtsReport.findOneAndUpdate({ id: a.id }, { $set: a }, { upsert: true }).catch(() => {});
    }
    // Upsert Applications
    for (const app of db.appliedJobs || []) {
      await Application.findOneAndUpdate({ id: app.id }, { $set: app }, { upsert: true }).catch(() => {});
    }
    // Upsert Mock Test Results
    for (const m of db.mockTestResults || []) {
      await MockTestResult.findOneAndUpdate({ id: m.id }, { $set: m }, { upsert: true }).catch(() => {});
    }
    // Upsert Streaks
    for (const s of db.streaks || []) {
      await Streak.findOneAndUpdate({ id: s.id || s.userId }, { $set: s }, { upsert: true }).catch(() => {});
    }
    // Upsert Questions
    for (const q of db.questions || []) {
      await Question.findOneAndUpdate({ id: q.id }, { $set: q }, { upsert: true }).catch(() => {});
    }
    // Upsert Jobs
    for (const j of db.jobs || []) {
      await Job.findOneAndUpdate({ id: j.id }, { $set: j }, { upsert: true }).catch(() => {});
    }
    // Upsert Resume Templates
    for (const t of db.resumeTemplates || []) {
      await ResumeTemplate.findOneAndUpdate({ id: t.id }, { $set: t }, { upsert: true }).catch(() => {});
    }
  } catch (error) {
    console.warn('MongoDB sync warning:', error.message);
  }
}
