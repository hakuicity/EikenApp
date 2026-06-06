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

    // signUp: optionally accepts studentNumber to link to a pre-enrolled roster entry
    async function hkSignUp(email, password, displayName, studentNumber) {
      const { data, error } = await hkClient.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        let profileData = {
          id:           data.user.id,
          display_name: displayName || email.split('@')[0],
          role:         'student'
        };

        if (studentNumber) {
          profileData.student_number = studentNumber;
          // Check roster for matching entry
          const { data: entry } = await hkClient
            .from('student_roster')
            .select('*')
            .eq('student_number', studentNumber)
            .single();

          if (entry) {
            // Fill in class and school from roster if not overridden
            if (!displayName && entry.display_name) profileData.display_name = entry.display_name;
            if (entry.class_name) profileData.class_name = entry.class_name;
            if (entry.school)     profileData.school      = entry.school;
            // Link roster entry to this auth account
            await hkClient
              .from('student_roster')
              .update({ linked_user_id: data.user.id })
              .eq('student_number', studentNumber);
          }
        }

        await hkClient.from('profiles').upsert(profileData);
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
          updated_at:  new Date().toISOString()
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

    // ── Student dashboard fetchers ──────────────────────────────────────────
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

    // ── Admin: student data fetchers ────────────────────────────────────────
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

    // ── Admin: roster management ────────────────────────────────────────────
    async function hkAdminFetchRoster() {
      const { data, error } = await hkClient
        .from('student_roster')
        .select('*')
        .order('class_name', { ascending: true })
        .order('student_number', { ascending: true });
      if (error) console.warn('[HakuiAdmin] fetchRoster error:', error.message);
      return data || [];
    }

    // Batch upsert roster entries. Returns { imported, updated, failed }.
    async function hkAdminImportRoster(rows) {
      const user = await hkGetUser();
      const toUpsert = rows.map(r => ({
        student_number: String(r.student_number).trim(),
        display_name:   String(r.display_name || r.name || '').trim(),
        class_name:     r.class_name ? String(r.class_name).trim() : null,
        school:         r.school     ? String(r.school).trim()     : null,
        enrolled_by:    user ? user.id : null
      })).filter(r => r.student_number && r.display_name);

      if (toUpsert.length === 0) return { imported: 0, updated: 0, failed: rows.length };

      // Check which student numbers already exist
      const nums = toUpsert.map(r => r.student_number);
      const { data: existing } = await hkClient
        .from('student_roster')
        .select('student_number')
        .in('student_number', nums);
      const existingNums = new Set((existing || []).map(r => r.student_number));

      const { error } = await hkClient
        .from('student_roster')
        .upsert(toUpsert, { onConflict: 'student_number' });

      if (error) {
        console.warn('[HakuiAdmin] importRoster error:', error.message);
        return { imported: 0, updated: 0, failed: toUpsert.length };
      }

      const updated  = toUpsert.filter(r => existingNums.has(r.student_number)).length;
      const imported = toUpsert.length - updated;
      return { imported, updated, failed: 0 };
    }

    async function hkAdminUpdateRosterEntry(id, updates) {
      const { error } = await hkClient
        .from('student_roster')
        .update(updates)
        .eq('id', id);
      if (error) console.warn('[HakuiAdmin] updateRosterEntry error:', error.message);
    }

    async function hkAdminDeleteRosterEntry(id) {
      const { error } = await hkClient
        .from('student_roster')
        .delete()
        .eq('id', id);
      if (error) console.warn('[HakuiAdmin] deleteRosterEntry error:', error.message);
    }


    // ── Student-ID auth ─────────────────────────────────────────────────────
    // Derives a consistent system email from a student number.
    // e.g. "S001" → "st.s001@hakuicity.ed.jp"
    function hkStudentEmail(studentNumber) {
      const safe = String(studentNumber).toLowerCase().replace(/[^a-z0-9-]/g, '');
      return 'st.' + safe + '@hakuicity.ed.jp';
    }

    // Sign in using student number + password (no email needed)
    async function hkSignInWithStudentId(studentNumber, password) {
      const email = hkStudentEmail(studentNumber);
      return await hkSignIn(email, password);
    }

    // Create a Supabase auth account for a student (called by teacher from
    // enrollment panel). Uses a temporary isolated client so the teacher's
    // own session is never disturbed.
    async function hkCreateStudentAccount(studentNumber, password) {
      const email = hkStudentEmail(studentNumber);

      // Isolated client — no localStorage writes, won't touch teacher session
      const tmp = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession:     false,
          autoRefreshToken:   false,
          detectSessionInUrl: false,
          storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
        }
      });

      const { data, error } = await tmp.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user && data.session) {
        // Look up roster entry for class/school info
        const { data: entry } = await hkClient
          .from('student_roster')
          .select('*')
          .eq('student_number', studentNumber)
          .single();

        const profileData = {
          id:             data.user.id,
          student_number: studentNumber,
          role:           'student',
          display_name:   (entry && entry.display_name) || studentNumber,
          ...(entry && entry.class_name ? { class_name: entry.class_name } : {}),
          ...(entry && entry.school     ? { school:     entry.school }     : {})
        };

        // Student's own session creates their profile (satisfies RLS)
        await tmp.from('profiles').upsert(profileData);

        // Teacher's session links the roster entry
        if (entry) {
          await hkClient
            .from('student_roster')
            .update({ linked_user_id: data.user.id })
            .eq('student_number', studentNumber);
        }
      }
      return data;
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
      client:                       hkClient,
      getSession:                   hkGetSession,
      getUser:                      hkGetUser,
      signUp:                       hkSignUp,
      signIn:                       hkSignIn,
      signOut:                      hkSignOut,
      resetPassword:                hkResetPassword,
      getProfile:                   hkGetProfile,
      updateProfile:                hkUpdateProfile,
      syncQuizResult:               hkSyncQuizResult,
      syncInterviewResult:          hkSyncInterviewResult,
      fetchMyQuizResults:           hkFetchMyQuizResults,
      fetchMyCategoryStats:         hkFetchMyCategoryStats,
      fetchMyInterviewScores:       hkFetchMyInterviewScores,
      adminFetchAllProfiles:        hkAdminFetchAllProfiles,
      adminFetchUserQuizResults:    hkAdminFetchUserQuizResults,
      adminFetchUserCategoryStats:  hkAdminFetchUserCategoryStats,
      adminFetchAllQuizResults:     hkAdminFetchAllQuizResults,
      adminFetchAllInterviewScores: hkAdminFetchAllInterviewScores,
      adminFetchRoster:             hkAdminFetchRoster,
      adminImportRoster:            hkAdminImportRoster,
      adminUpdateRosterEntry:       hkAdminUpdateRosterEntry,
      adminDeleteRosterEntry:       hkAdminDeleteRosterEntry,
      onAuthChange:                 hkOnAuthChange,
      studentEmail:                 hkStudentEmail,
      signInWithStudentId:          hkSignInWithStudentId,
      createStudentAccount:         hkCreateStudentAccount
    };
    console.log('[HakuiClient] window.hk ready');
  }

  // ── Load SDK then init ────────────────────────────────────────────────────
  if (window.supabase && window.supabase.createClient) {
    initHk();
  } else {
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.onload  = function () { initHk(); };
    script.onerror = function () { console.error('[HakuiClient] Failed to load Supabase SDK from CDN'); };
    document.head.appendChild(script);
  }
})();
