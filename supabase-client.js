// supabase-client.js — shared auth + sync client for Hakui City Education platform
// Include AFTER the Supabase CDN script:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="supabase-client.js"></script>

'use strict';

const HAKUI_SUPABASE_URL = 'https://rfntsrcguhldybddfgcl.supabase.co';
const HAKUI_SUPABASE_KEY = 'sb_publishable_vQ8vM7AD8UpaF_9KeNcnhQ_2Outm7Ya';

const hkClient = window.supabase.createClient(HAKUI_SUPABASE_URL, HAKUI_SUPABASE_KEY);

// ── Auth helpers ──────────────────────────────────────────────────────────────

async function hkGetSession() {
  const { data: { session } } = await hkClient.auth.getSession();
  return session;
}

async function hkGetUser() {
  const session = await hkGetSession();
  return session ? session.user : null;
}

async function hkSignUp(email, password, displayName) {
  const { data, error } = await hkClient.auth.signUp({ email, password });
  if (error) throw error;
  // Create profile row immediately
  if (data.user) {
    await hkClient.from('profiles').upsert({
      id: data.user.id,
      display_name: displayName || email.split('@')[0],
      role: 'student'
    });
  }
  return data;
}

async function hkSignIn(email, password) {
  const { data, error } = await hkClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function hkSignOut() {
  const { error } = await hkClient.auth.signOut();
  if (error) throw error;
}

async function hkResetPassword(email) {
  const { error } = await hkClient.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://hakuicity.github.io/site/account/'
  });
  if (error) throw error;
}

async function hkGetProfile(userId) {
  const { data, error } = await hkClient.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data;
}

async function hkUpdateProfile(userId, updates) {
  const { error } = await hkClient.from('profiles').upsert({ id: userId, ...updates });
  if (error) throw error;
}

// ── EikenApp stat sync ────────────────────────────────────────────────────────

// Call this after a quiz session ends (mirrors recordSession in app.js)
async function hkSyncQuizResult({ level, setId, category, correct, total }) {
  const user = await hkGetUser();
  if (!user) return; // not logged in — silently skip
  const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const { error } = await hkClient.from('quiz_results').insert({
    user_id: user.id,
    app_id: 'eiken',
    level,
    set_id: setId,
    category,
    correct,
    total,
    score_pct: scorePct
  });
  if (error) console.warn('[HakuiSync] quiz_results insert failed:', error.message);

  // Also upsert running category_stats aggregate
  await hkUpsertCategoryStats(user.id, level, category, correct, total - correct);
}

async function hkUpsertCategoryStats(userId, level, category, rightDelta, wrongDelta) {
  // Fetch existing row
  const { data: existing } = await hkClient
    .from('category_stats')
    .select('id, right_count, wrong_count')
    .eq('user_id', userId)
    .eq('level', level)
    .eq('category', category)
    .single();

  if (existing) {
    await hkClient.from('category_stats').update({
      right_count: existing.right_count + rightDelta,
      wrong_count: existing.wrong_count + wrongDelta,
      updated_at: new Date().toISOString()
    }).eq('id', existing.id);
  } else {
    await hkClient.from('category_stats').insert({
      user_id: userId,
      level,
      category,
      right_count: rightDelta,
      wrong_count: wrongDelta
    });
  }
}

// Call this after an interview session ends
async function hkSyncInterviewResult({ level, sessionId, topic, avgScore }) {
  const user = await hkGetUser();
  if (!user) return;
  const { error } = await hkClient.from('interview_scores').insert({
    user_id: user.id,
    level,
    session_id: sessionId,
    topic,
    avg_score: avgScore
  });
  if (error) console.warn('[HakuiSync] interview_scores insert failed:', error.message);
}

// ── Dashboard data fetchers ───────────────────────────────────────────────────

// Fetch all quiz results for the current user
async function hkFetchMyQuizResults() {
  const user = await hkGetUser();
  if (!user) return [];
  const { data, error } = await hkClient
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

// Fetch category stats aggregate for the current user
async function hkFetchMyCategoryStats() {
  const user = await hkGetUser();
  if (!user) return [];
  const { data, error } = await hkClient
    .from('category_stats')
    .select('*')
    .eq('user_id', user.id);
  if (error) return [];
  return data;
}

// Fetch interview scores for current user
async function hkFetchMyInterviewScores() {
  const user = await hkGetUser();
  if (!user) return [];
  const { data, error } = await hkClient
    .from('interview_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

// ── Admin/teacher fetchers ────────────────────────────────────────────────────

// Fetch all profiles (admin only — RLS will block non-admins once policy is added)
async function hkAdminFetchAllProfiles() {
  const { data, error } = await hkClient
    .from('profiles')
    .select('id, display_name, role, class_name, school, created_at')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

// Fetch all quiz results for a specific user (admin use)
async function hkAdminFetchUserQuizResults(userId) {
  const { data, error } = await hkClient
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

// Fetch all category stats for a specific user (admin use)
async function hkAdminFetchUserCategoryStats(userId) {
  const { data, error } = await hkClient
    .from('category_stats')
    .select('*')
    .eq('user_id', userId);
  if (error) return [];
  return data;
}

// Fetch all quiz results across all users (admin use — for class reports)
async function hkAdminFetchAllQuizResults() {
  const { data, error } = await hkClient
    .from('quiz_results')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

async function hkAdminFetchAllInterviewScores() {
  const { data, error } = await hkClient
    .from('interview_scores')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

// ── Auth state listener helper ────────────────────────────────────────────────
// Pass a callback; it fires immediately with current session, then on every change.
function hkOnAuthChange(callback) {
  hkClient.auth.onAuthStateChange((_event, session) => {
    callback(session ? session.user : null);
  });
  // Also fire immediately
  hkGetUser().then(callback);
}

// Export to window for use in non-module scripts
window.hk = {
  client: hkClient,
  getSession: hkGetSession,
  getUser: hkGetUser,
  signUp: hkSignUp,
  signIn: hkSignIn,
  signOut: hkSignOut,
  resetPassword: hkResetPassword,
  getProfile: hkGetProfile,
  updateProfile: hkUpdateProfile,
  syncQuizResult: hkSyncQuizResult,
  syncInterviewResult: hkSyncInterviewResult,
  fetchMyQuizResults: hkFetchMyQuizResults,
  fetchMyCategoryStats: hkFetchMyCategoryStats,
  fetchMyInterviewScores: hkFetchMyInterviewScores,
  adminFetchAllProfiles: hkAdminFetchAllProfiles,
  adminFetchUserQuizResults: hkAdminFetchUserQuizResults,
  adminFetchUserCategoryStats: hkAdminFetchUserCategoryStats,
  adminFetchAllQuizResults: hkAdminFetchAllQuizResults,
  adminFetchAllInterviewScores: hkAdminFetchAllInterviewScores,
  onAuthChange: hkOnAuthChange
};
