// eiken-auth.js — auth widget for EikenApp
// Adds a login/logout button to the menu and syncs quiz/interview results to Supabase.
// Requires: supabase-client.js loaded before this file.
// All existing localStorage behaviour is preserved — Supabase is purely additive.

'use strict';

// ── Inject CSS ────────────────────────────────────────────────────────────────
(function injectAuthStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #hk-auth-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 13px; border-radius: 8px; border: 1.5px solid var(--border);
      background: var(--surface); cursor: pointer; font-size: 13px;
      font-weight: 600; color: var(--text2); font-family: inherit;
      transition: all .15s; white-space: nowrap;
    }
    #hk-auth-btn:hover { border-color: #1565C0; color: #1565C0; }
    #hk-auth-btn.signed-in { border-color: #2E7D32; color: #2E7D32; }
    #hk-auth-modal {
      position: fixed; inset: 0; background: rgba(0,0,0,.45);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px;
    }
    #hk-auth-modal.hidden { display: none; }
    #hk-auth-box {
      background: var(--surface); border-radius: 16px; padding: 28px 24px;
      width: 100%; max-width: 360px; box-shadow: 0 8px 32px rgba(0,0,0,.18);
      position: relative;
    }
    #hk-auth-box h2 { font-size: 20px; font-weight: 800; margin-bottom: 4px; color: var(--text); }
    #hk-auth-box .hk-auth-sub { font-size: 13px; color: var(--text3); margin-bottom: 20px; }
    .hk-field { margin-bottom: 13px; }
    .hk-field label { display: block; font-size: 12px; font-weight: 700; color: var(--text2); margin-bottom: 5px; }
    .hk-field input {
      width: 100%; padding: 10px 12px; border-radius: 8px;
      border: 1.5px solid var(--border); background: var(--surface2);
      color: var(--text); font-size: 14px; font-family: inherit;
      outline: none; transition: border-color .15s;
    }
    .hk-field input:focus { border-color: #1565C0; }
    .hk-auth-primary {
      width: 100%; padding: 11px; border-radius: 8px; border: none;
      background: #1565C0; color: #fff; font-size: 15px; font-weight: 700;
      cursor: pointer; font-family: inherit; transition: background .15s; margin-top: 4px;
    }
    .hk-auth-primary:hover { background: #0D47A1; }
    .hk-auth-primary:disabled { background: #90A4AE; cursor: default; }
    .hk-auth-toggle { text-align: center; margin-top: 14px; font-size: 13px; color: var(--text3); }
    .hk-auth-toggle button {
      background: none; border: none; color: #1565C0; font-weight: 700;
      cursor: pointer; font-size: 13px; font-family: inherit; padding: 0;
    }
    .hk-auth-error {
      background: #FFEBEE; border: 1px solid #EF9A9A; border-radius: 8px;
      padding: 9px 12px; font-size: 13px; color: #C62828; margin-bottom: 12px; display: none;
    }
    .hk-auth-success {
      background: #E8F5E9; border: 1px solid #A5D6A7; border-radius: 8px;
      padding: 9px 12px; font-size: 13px; color: #2E7D32; margin-bottom: 12px; display: none;
    }
    .hk-auth-close {
      position: absolute; top: 14px; right: 16px; background: none;
      border: none; font-size: 20px; cursor: pointer; color: var(--text3); line-height: 1; padding: 0;
    }
    .hk-auth-close:hover { color: var(--text); }
    .hk-forgot {
      background: none; border: none; color: var(--text3); font-size: 12px;
      cursor: pointer; font-family: inherit; padding: 0; margin-top: 6px;
      display: block; text-align: right; width: 100%;
    }
    .hk-forgot:hover { color: #1565C0; }
    #hk-sync-badge {
      position: fixed; bottom: 16px; right: 16px; background: #1565C0;
      color: #fff; border-radius: 20px; padding: 6px 14px; font-size: 12px;
      font-weight: 700; z-index: 500; opacity: 0; transition: opacity .3s; pointer-events: none;
    }
    #hk-sync-badge.show { opacity: 1; }
  `;
  document.head.appendChild(style);
})();

// ── Build DOM ─────────────────────────────────────────────────────────────────
(function buildAuthDOM() {
  const btn = document.createElement('button');
  btn.id = 'hk-auth-btn';
  btn.textContent = 'ログイン';
  btn.onclick = openAuthModal;

  const controls = document.querySelector('.top-controls');
  if (controls) controls.appendChild(btn);

  const badge = document.createElement('div');
  badge.id = 'hk-sync-badge';
  badge.textContent = '✓ 成績を保存しました';
  document.body.appendChild(badge);

  const modal = document.createElement('div');
  modal.id = 'hk-auth-modal';
  modal.className = 'hidden';
  modal.innerHTML = `
    <div id="hk-auth-box">
      <button class="hk-auth-close" id="hk-auth-close">×</button>
      <h2 id="hk-auth-title">ログイン</h2>
      <p class="hk-auth-sub" id="hk-auth-sub">成績をクラウドに保存します</p>
      <div class="hk-auth-error" id="hk-auth-error"></div>
      <div class="hk-auth-success" id="hk-auth-success"></div>

      <div id="hk-form-login">
        <div class="hk-field">
          <label>メールアドレス</label>
          <input type="email" id="hk-login-email" placeholder="example@school.ed.jp" autocomplete="email">
        </div>
        <div class="hk-field">
          <label>パスワード</label>
          <input type="password" id="hk-login-pass" placeholder="••••••••" autocomplete="current-password">
        </div>
        <button class="hk-forgot" id="hk-forgot-btn">パスワードを忘れた場合</button>
        <button class="hk-auth-primary" id="hk-login-btn">ログイン</button>
        <div class="hk-auth-toggle">
          アカウントをお持ちでない方は
          <button id="hk-goto-signup">新規登録</button>
        </div>
      </div>

      <div id="hk-form-signup" style="display:none">
        <div class="hk-field">
          <label>お名前（表示名）</label>
          <input type="text" id="hk-signup-name" placeholder="例：山田 太郎">
        </div>
        <div class="hk-field">
          <label>メールアドレス</label>
          <input type="email" id="hk-signup-email" placeholder="example@school.ed.jp" autocomplete="email">
        </div>
        <div class="hk-field">
          <label>パスワード（8文字以上）</label>
          <input type="password" id="hk-signup-pass" placeholder="••••••••" autocomplete="new-password">
        </div>
        <button class="hk-auth-primary" id="hk-signup-btn">アカウントを作成</button>
        <div class="hk-auth-toggle">
          すでにアカウントをお持ちの方は
          <button id="hk-goto-login">ログイン</button>
        </div>
      </div>

      <div id="hk-form-loggedin" style="display:none">
        <p id="hk-loggedin-name" style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:6px"></p>
        <p id="hk-loggedin-email" style="font-size:13px;color:var(--text3);margin-bottom:20px"></p>
        <p style="font-size:13px;color:var(--text2);margin-bottom:16px">
          英検アプリでの成績はアカウントに自動保存されます。<br>
          <a href="https://hakuicity.github.io/site/account/"
             style="color:#1565C0;font-weight:700"
             target="_blank">ダッシュボードで確認 →</a>
        </p>
        <button class="hk-auth-primary" id="hk-logout-btn" style="background:#455A64">ログアウト</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('hk-auth-close').onclick = closeAuthModal;
  modal.addEventListener('click', e => { if (e.target === modal) closeAuthModal(); });
  document.getElementById('hk-goto-signup').onclick = () => showAuthForm('signup');
  document.getElementById('hk-goto-login').onclick  = () => showAuthForm('login');
  document.getElementById('hk-login-btn').onclick   = handleLogin;
  document.getElementById('hk-signup-btn').onclick  = handleSignup;
  document.getElementById('hk-logout-btn').onclick  = handleLogout;
  document.getElementById('hk-forgot-btn').onclick  = handleForgot;
  document.getElementById('hk-login-pass').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
  document.getElementById('hk-signup-pass').addEventListener('keydown', e => { if (e.key === 'Enter') handleSignup(); });
})();

// ── Modal helpers ─────────────────────────────────────────────────────────────
async function openAuthModal() {
  document.getElementById('hk-auth-modal').classList.remove('hidden');
  clearAuthMessages();
  const user = await window.hk.getUser();
  if (user) {
    const profile = await window.hk.getProfile(user.id);
    const name = (profile && profile.display_name) ? profile.display_name : user.email;
    document.getElementById('hk-loggedin-name').textContent = name;
    document.getElementById('hk-loggedin-email').textContent = user.email;
    showAuthForm('loggedin');
  } else {
    showAuthForm('login');
  }
}

function closeAuthModal() {
  document.getElementById('hk-auth-modal').classList.add('hidden');
}

function showAuthForm(form) {
  clearAuthMessages();
  document.getElementById('hk-form-login').style.display    = form === 'login'    ? '' : 'none';
  document.getElementById('hk-form-signup').style.display   = form === 'signup'   ? '' : 'none';
  document.getElementById('hk-form-loggedin').style.display = form === 'loggedin' ? '' : 'none';
  const titles = { login: 'ログイン', signup: '新規登録', loggedin: 'アカウント' };
  const subs   = { login: '成績をクラウドに保存します', signup: '無料アカウントを作成します', loggedin: 'ログイン済み' };
  document.getElementById('hk-auth-title').textContent = titles[form];
  document.getElementById('hk-auth-sub').textContent   = subs[form];
}

function showAuthError(msg) {
  const el = document.getElementById('hk-auth-error');
  el.textContent = msg; el.style.display = 'block';
  document.getElementById('hk-auth-success').style.display = 'none';
}

function showAuthSuccess(msg) {
  const el = document.getElementById('hk-auth-success');
  el.textContent = msg; el.style.display = 'block';
  document.getElementById('hk-auth-error').style.display = 'none';
}

function clearAuthMessages() {
  document.getElementById('hk-auth-error').style.display = 'none';
  document.getElementById('hk-auth-success').style.display = 'none';
}

function setAuthBtnLoading(id, loading) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled = loading;
  if (id === 'hk-login-btn')  btn.textContent = loading ? '処理中...' : 'ログイン';
  if (id === 'hk-signup-btn') btn.textContent = loading ? '処理中...' : 'アカウントを作成';
  if (id === 'hk-logout-btn') btn.textContent = loading ? '処理中...' : 'ログアウト';
}

// ── Auth actions ──────────────────────────────────────────────────────────────
async function handleLogin() {
  const email = document.getElementById('hk-login-email').value.trim();
  const pass  = document.getElementById('hk-login-pass').value;
  if (!email || !pass) { showAuthError('メールアドレスとパスワードを入力してください。'); return; }
  setAuthBtnLoading('hk-login-btn', true);
  clearAuthMessages();
  try {
    await window.hk.signIn(email, pass);
    closeAuthModal();
  } catch (e) {
    showAuthError('ログインに失敗しました：' + (e.message || '入力内容を確認してください。'));
  } finally {
    setAuthBtnLoading('hk-login-btn', false);
  }
}

async function handleSignup() {
  const name  = document.getElementById('hk-signup-name').value.trim();
  const email = document.getElementById('hk-signup-email').value.trim();
  const pass  = document.getElementById('hk-signup-pass').value;
  if (!email || !pass) { showAuthError('メールアドレスとパスワードを入力してください。'); return; }
  if (pass.length < 8)  { showAuthError('パスワードは8文字以上で設定してください。'); return; }
  setAuthBtnLoading('hk-signup-btn', true);
  clearAuthMessages();
  try {
    await window.hk.signUp(email, pass, name);
    showAuthSuccess('登録が完了しました！確認メールをご確認ください。');
    setTimeout(() => { clearAuthMessages(); showAuthForm('login'); }, 3000);
  } catch (e) {
    showAuthError('登録に失敗しました：' + (e.message || '入力内容を確認してください。'));
  } finally {
    setAuthBtnLoading('hk-signup-btn', false);
  }
}

async function handleLogout() {
  setAuthBtnLoading('hk-logout-btn', true);
  try {
    await window.hk.signOut();
    closeAuthModal();
  } catch (e) {
    showAuthError('ログアウトに失敗しました。');
  } finally {
    setAuthBtnLoading('hk-logout-btn', false);
  }
}

async function handleForgot() {
  const email = document.getElementById('hk-login-email').value.trim();
  if (!email) { showAuthError('メールアドレスを入力してください。'); return; }
  try {
    await window.hk.resetPassword(email);
    showAuthSuccess('パスワードリセットメールを送信しました。');
  } catch (e) {
    showAuthError('送信に失敗しました：' + (e.message || ''));
  }
}

// ── Sync badge ────────────────────────────────────────────────────────────────
let _syncTimer = null;
function showSyncBadge(msg) {
  const badge = document.getElementById('hk-sync-badge');
  if (!badge) return;
  badge.textContent = msg || '✓ 成績を保存しました';
  badge.classList.add('show');
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => badge.classList.remove('show'), 2800);
}

// ── Auth state → update button ────────────────────────────────────────────────
window.hk.onAuthChange(async function(user) {
  const btn = document.getElementById('hk-auth-btn');
  if (!btn) return;
  if (user) {
    const profile = await window.hk.getProfile(user.id);
    const name = (profile && profile.display_name) ? profile.display_name : user.email;
    btn.textContent = '👤 ' + name;
    btn.className = 'signed-in';
    btn.title = 'アカウント設定';
    if (!document.getElementById('hk-auth-modal').classList.contains('hidden')) {
      document.getElementById('hk-loggedin-name').textContent = name;
      document.getElementById('hk-loggedin-email').textContent = user.email;
      showAuthForm('loggedin');
    }
  } else {
    btn.textContent = 'ログイン';
    btn.className = '';
    btn.title = '';
  }
});

// ── Sync on session end ───────────────────────────────────────────────────────
(function() {
  // Patch recordSession — wraps the original app.js function to also sync to Supabase
  const _origRecord = window.recordSession;
  console.log('[HakuiSync] patching recordSession, found:', typeof _origRecord);

  window.recordSession = function(res) {
    console.log('[HakuiSync] recordSession called, results:', res.length);

    // Always call the original first
    if (typeof _origRecord === 'function') _origRecord(res);

    // Sync to Supabase asynchronously
    (async function() {
      const user = await window.hk.getUser();
      if (!user) { console.log('[HakuiSync] no user logged in, skipping sync'); return; }

      console.log('[HakuiSync] syncing for user:', user.id.slice(0, 8));

      const catMap = {};
      res.forEach(r => {
        const q = (window.questions || []).find(x => x.id === r.qId);
        const cat = q ? q.cat : 'VOCAB';
        if (!catMap[cat]) catMap[cat] = { correct: 0, total: 0 };
        catMap[cat].total++;
        if (r.chosen === r.correct) catMap[cat].correct++;
      });

      const totalCorrect = res.filter(r => r.chosen === r.correct).length;

      await window.hk.syncQuizResult({
        level:    window.currentLevel || '5',
        setId:    window.currentSet   || '1',
        category: 'ALL',
        correct:  totalCorrect,
        total:    res.length
      });
      console.log('[HakuiSync] overall result synced');

      for (const [cat, data] of Object.entries(catMap)) {
        await window.hk.syncQuizResult({
          level:    window.currentLevel || '5',
          setId:    window.currentSet   || '1',
          category: cat,
          correct:  data.correct,
          total:    data.total
        });
      }
      console.log('[HakuiSync] category results synced');

      showSyncBadge('✓ 成績を保存しました');
    })();
  };

  // Patch interview results sync
  const _origShowIvResults = window.showIvResults;
  if (typeof _origShowIvResults === 'function') {
    window.showIvResults = function(level, sessionId, topic, scores) {
      _origShowIvResults.apply(this, arguments);
      (async function() {
        const user = await window.hk.getUser();
        if (!user || !scores || scores.length === 0) return;
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        await window.hk.syncInterviewResult({ level, sessionId, topic, avgScore: avg });
        showSyncBadge('✓ 面接スコアを保存しました');
      })();
    };
  }
})();
