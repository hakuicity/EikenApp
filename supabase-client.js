// supabase-client.js — self-loading Supabase client for Hakui City Education platform
// Loads the Supabase SDK on its own, no external script tag required.
'use strict';

(function () {
  const SUPABASE_URL = 'https://rfntsrcguhldybddfgcl.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_vQ8vM7AD8UpaF_9KeNcnhQ_2Outm7Ya';
  const SDK_URL      = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';

  function initHk() {
    const sb = window.supabase;
    if (!sb || !sb.createClient) {
      console.error('[HakuiClient] window.supabase not available after SDK load');
      return;
    }

    const hkClient = sb.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[HakuiClient] Supabase client initialised');

    // ── Auth helpers ────────────────────────────────────────────────────────
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
      const { data } = await hkClient.from('profiles').select('*').eq('id', userId).single();
      return data || null;
    }
    async function hkUpdateProfile(userId, updates) {
      const { error } = await hkClient.from('profiles').upsert({ id: userId, ...updates });
      if (error) throw error;
    }

    // ── EikenApp sync ───────────────────────────────────────────────────────
    async function hkSyncQuizResult({ level, setId, category, correct, total }) {
      const user = await hkGetUser();
      if (!user) return;
      const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;
      const { error } = await hkClient.from('quiz_results').insert({
        user_id: user.id, app_id: 'eiken', level, set_id: setId,
        category, correct, total, score_pct: scorePct
      });
      if (error) console.warn('[HakuiSync] quiz_results error:', error.message);

      const { data: existing } = await hkClient.from('category_stats')
        .select('id, right_count, wrong_count')
        .eq('user_id', user.id).eq('level', level).eq('category', category).single();
      const wrong = total - correct;
      if (existing) {
        await hkClient.from('category_stats').update({
          right_count: existing.right_count + correct,
          wrong_count: existing.wrong_count + wrong,
          updated_at: new Date().toISOString()
        }).eq('id', existing.id);
      } else {
        await hkClient.from('category_stats').insert({
          user_id: user.id, level, category, right_count: correct, wrong_count: wrong
        });
      }
    }
    async function hkSyncInterviewResult({ level, sessionId, topic, avgScore }) {
      const user = await hkGetUser();
      if (!user) return;
      const { error } = await hkClient.from('interview_scores').insert({
        user_id: user.id, level, session_id: sessionId, topic, avg_score: avgScore
      });
      if (error) console.warn('[HakuiSync] interview_scores error:', error.message);
    }

    // ── Dashboard fetchers ──────────────────────────────────────────────────
    async function hkFetchMyQuizResults() {
      const user = await hkGetUser(); if (!user) return [];
      const { data } = await hkClient.from('quiz_results').select('*')
        .eq('user_id', user.id).order('created_at', { ascending: false });
      return data || [];
    }
    async function hkFetchMyCategoryStats() {
      const user = await hkGetUser(); if (!user) return [];
      const { data } = await hkClient.from('category_stats').select('*').eq('user_id', user.id);
      return data || [];
    }
    async function hkFetchMyInterviewScores() {
      const user = await hkGetUser(); if (!user) return [];
      const { data } = await hkClient.from('interview_scores').select('*')
        .eq('user_id', user.id).order('created_at', { ascending: false });
      return data || [];
    }

    // ── Admin fetchers ──────────────────────────────────────────────────────
    async function hkAdminFetchAllProfiles() {
      const { data } = await hkClient.from('profiles').select('*').order('created_at', { ascending: false });
      return data || [];
    }
    async function hkAdminFetchUserQuizResults(userId) {
      const { data } = await hkClient.from('quiz_results').select('*')
        .eq('user_id', userId).order('created_at', { ascending: false });
      return data || [];
    }
    async function hkAdminFetchUserCategoryStats(userId) {
      const { data } = await hkClient.from('category_stats').select('*').eq('user_id', userId);
      return data || [];
    }
    async function hkAdminFetchAllQuizResults() {
      const { data } = await hkClient.from('quiz_results').select('*')
        .order('created_at', { ascending: false });
      return data || [];
    }
    async function hkAdminFetchAllInterviewScores() {
      const { data } = await hkClient.from('interview_scores').select('*')
        .order('created_at', { ascending: false });
      return data || [];
    }

    // ── Auth state listener ─────────────────────────────────────────────────
    function hkOnAuthChange(callback) {
      hkClient.auth.onAuthStateChange((_event, session) => {
        callback(session ? session.user : null);
      });
      hkGetUser().then(callback);
    }

    // ── Expose on window ────────────────────────────────────────────────────
    window.hk = {
      client:                      hkClient,
      getSession:                  hkGetSession,
      getUser:                     hkGetUser,
      signUp:                      hkSignUp,
      signIn:                      hkSignIn,
      signOut:                     hkSignOut,
      resetPassword:               hkResetPassword,
      getProfile:                  hkGetProfile,
      updateProfile:               hkUpdateProfile,
      syncQuizResult:              hkSyncQuizResult,
      syncInterviewResult:         hkSyncInterviewResult,
      fetchMyQuizResults:          hkFetchMyQuizResults,
      fetchMyCategoryStats:        hkFetchMyCategoryStats,
      fetchMyInterviewScores:      hkFetchMyInterviewScores,
      adminFetchAllProfiles:       hkAdminFetchAllProfiles,
      adminFetchUserQuizResults:   hkAdminFetchUserQuizResults,
      adminFetchUserCategoryStats: hkAdminFetchUserCategoryStats,
      adminFetchAllQuizResults:    hkAdminFetchAllQuizResults,
      adminFetchAllInterviewScores:hkAdminFetchAllInterviewScores,
      onAuthChange:                hkOnAuthChange
    };
    console.log('[HakuiClient] window.hk ready');
  }

  // ── Load SDK then init ────────────────────────────────────────────────────
  if (window.supabase && window.supabase.createClient) {
    // Already loaded (e.g. EikenApp includes it before this file)
    initHk();
  } else {
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.onload = function () { initHk(); };
    script.onerror = function () { console.error('[HakuiClient] Failed to load Supabase SDK from CDN'); };
    document.head.appendChild(script);
  }
})();
