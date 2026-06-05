// Eiken Practice App — main application logic
'use strict';

const BADGE_BG={VOCAB:"#E8F5E9",GRAMMAR:"#E3F2FD",CONVERSATION:"#FFF3E0",ORDER:"#F3E5F5"};
const BADGE_FG={VOCAB:"#2E7D32",GRAMMAR:"#1565C0",CONVERSATION:"#E65100",ORDER:"#6A1B9A"};
const CAT_LABEL={VOCAB:"語い",GRAMMAR:"文法",CONVERSATION:"会話",ORDER:"語順"};
const CAT_ICON={VOCAB:"📖",GRAMMAR:"✏️",CONVERSATION:"💬",ORDER:"🔤"};
const CAT_COLOR={VOCAB:"#2E7D32",GRAMMAR:"#1565C0",CONVERSATION:"#E65100",ORDER:"#6A1B9A"};
const CATS=["VOCAB","GRAMMAR","CONVERSATION","ORDER"];
const MENU_ITEMS=[
  {key:"ALL",label:"すべての問題",icon:"📝"},
  {key:"VOCAB",label:"語い",icon:"📖"},
  {key:"GRAMMAR",label:"文法",icon:"✏️"},
  {key:"CONVERSATION",label:"会話",icon:"💬"},
  {key:"ORDER",label:"語順",icon:"🔤"},
];

let currentLevel="5", currentSet="1", questions=[];
let pool=[],idx=0,selected=null,answered=false,results=[];
let darkMode = localStorage.getItem("eiken_dark")==="1";

const $=id=>document.getElementById(id);
const show=id=>{$(id).classList.remove("hidden");};
const hide=id=>{$(id).classList.add("hidden");};
function hideAll(){["menu-screen","quiz-screen","review-screen","stats-screen"].forEach(hide);}
function escHtml(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function cfg(){return LEVEL_CFG[currentLevel];}

// ── Dark mode ─────────────────────────────────────────────────
function applyDark(){
  document.body.classList.toggle("dark", darkMode);
  $("theme-btn").textContent = darkMode ? "☀️" : "🌙";
}
$("theme-btn").onclick=function(){
  darkMode=!darkMode;
  localStorage.setItem("eiken_dark", darkMode?"1":"0");
  applyDark();
};

// ── Theme (accent colours) ────────────────────────────────────
function applyTheme(){
  const c=cfg();
  document.querySelectorAll(".level-tab").forEach(t=>{
    const active=t.getAttribute("data-level")===currentLevel;
    t.classList.toggle("active",active);
    t.style.background=active?c.accent:"";
    t.style.borderColor=active?c.accent:"";
  });
  document.querySelectorAll(".set-tab").forEach(t=>{
    const active=t.getAttribute("data-set")===currentSet;
    t.classList.toggle("active",active);
    t.style.background=active?c.accent:"";
    t.style.borderColor=active?c.accent:"";
  });
  $("hdr-icon").style.background=c.accent;
  $("hdr-title").textContent="英検"+c.label+" Practice";
  $("next-btn").style.background=c.accent;
  $("prog-bar").style.background="linear-gradient(90deg,"+c.accent+","+c.accentMid+")";
  $("modal-confirm").style.background=c.accent;
}

// ── Side panel tracker ────────────────────────────────────────
function buildTracker(){
  const grid=$("tracker-grid");
  grid.innerHTML="";
  // Set CSS custom property for current accent colour
  $("side-panel").style.setProperty("--accent-color", cfg().accent);
  // Row per question: num + 4 option cells (A B C D)
  pool.forEach(function(q,i){
    // row number
    const num=document.createElement("div");
    num.className="tracker-row-num";
    num.textContent=String(i+1).padStart(2,"0");
    grid.appendChild(num);
    // 4 option cells
    q.opts.forEach(function(opt,oi){
      const cell=document.createElement("div");
      cell.className="tracker-cell";
      cell.id="tc-"+i+"-"+oi;
      cell.textContent=oi+1;
      cell.title=opt;
      grid.appendChild(cell);
    });
  });
  $("panel-title").textContent=cfg().label+" 進捗";
  $("side-panel").classList.add("visible");
  document.body.classList.add("has-panel");
}

function updateTracker(){
  pool.forEach(function(q,i){
    q.opts.forEach(function(opt,oi){
      const cell=$("tc-"+i+"-"+oi);
      if(!cell) return;
      // reset
      cell.className="tracker-cell";
      // current row highlight
      if(i===idx) cell.classList.add("current-row");
      // answered
      if(results[i]){
        const chosen=results[i].chosen;
        const correct=results[i].correct;
        if(oi===chosen && chosen===correct) cell.classList.add("chosen-correct");
        else if(oi===chosen && chosen!==correct) cell.classList.add("chosen-wrong");
      }
    });
  });
  // scroll current row into view
  const cur=$("tc-"+idx+"-0");
  if(cur) cur.scrollIntoView({block:"nearest",behavior:"smooth"});
}

function hideTracker(){
  $("side-panel").classList.remove("visible");
  $("tracker-grid").innerHTML="";
  document.body.classList.remove("has-panel");
}

// ── Modal ─────────────────────────────────────────────────────
let modalResolveFn=null;
function openModal(title,msg,confirmLabel){
  $("modal-title").textContent=title;$("modal-msg").textContent=msg;
  $("modal-confirm").textContent=confirmLabel||"確認";
  show("modal");
  return new Promise(resolve=>{modalResolveFn=resolve;});
}
$("modal-cancel").onclick=()=>{hide("modal");if(modalResolveFn)modalResolveFn(false);};
$("modal-confirm").onclick=()=>{hide("modal");if(modalResolveFn)modalResolveFn(true);};

// ── Stats ─────────────────────────────────────────────────────
function defaultStats(){const s={totalRight:0,totalWrong:0,sessions:0};CATS.forEach(c=>{s[c]={right:0,wrong:0};});return s;}
function loadStats(){try{return JSON.parse(localStorage.getItem(cfg().statsKey))||defaultStats();}catch(e){return defaultStats();}}
function saveStats(s){try{localStorage.setItem(cfg().statsKey,JSON.stringify(s));}catch(e){}}
function recordSession(res){
  const s=loadStats();s.sessions++;
  res.forEach(r=>{const q=questions.find(x=>x.id===r.qId);const ok=r.chosen===r.correct;
    if(ok){s.totalRight++;s[q.cat].right++;}else{s.totalWrong++;s[q.cat].wrong++;}});
  saveStats(s);
}

// ── Menu ──────────────────────────────────────────────────────
function switchLevel(lv){currentLevel=lv;questions=[...ALL_SETS[lv][currentSet]];buildMenu();applyTheme();}
function switchSet(st){currentSet=st;questions=[...ALL_SETS[currentLevel][st]];buildMenu();applyTheme();}

function buildMenu(){
  const c=cfg(),g=$("menu-grid");g.innerHTML="";
  MENU_ITEMS.forEach(item=>{
    const count=item.key==="ALL"?questions.length:questions.filter(q=>q.cat===item.key).length;
    if(count===0)return;
    const color=item.key==="ALL"?"#37474F":CAT_COLOR[item.key];
    const btn=document.createElement("button");btn.className="menu-card";
    btn.style.borderLeft="4px solid "+color;
    btn.innerHTML='<span class="menu-icon">'+item.icon+'</span><div>'
      +'<div class="menu-label" style="color:'+color+'">'+item.label+'</div>'
      +'<div class="menu-desc">'+count+' 問</div></div>';
    btn.onclick=()=>startQuiz(item.key);
    g.appendChild(btn);
  });
  const sb=document.createElement("button");sb.className="menu-card";
  sb.style.borderLeft="4px solid #FF8F00";
  sb.innerHTML='<span class="menu-icon">📊</span><div>'
    +'<div class="menu-label" style="color:#FF8F00">成績 ('+c.label+')</div>'
    +'<div class="menu-desc">あなたの成績履歴</div></div>';
  sb.onclick=showStats;g.appendChild(sb);

  // Interview button — only for levels 3 and P
  if(currentLevel==='3'||currentLevel==='P'){
    const ib=document.createElement("button");ib.className="menu-card";
    ib.style.borderLeft="4px solid #FF6F00";
    ib.innerHTML='<span class="menu-icon">🎤</span><div>'
      +'<div class="menu-label" style="color:#FF6F00">面接練習</div>'
      +'<div class="menu-desc">スピーキング / 10セッション</div></div>';
    ib.onclick=()=>{ if(typeof openInterviewMenu==='function') openInterviewMenu(); else console.error('[EikenApp] interview.js not loaded - openInterviewMenu undefined'); };
    g.appendChild(ib);
  }
}

function goMenu(){hideAll();hideTracker();show("menu-screen");}

// ── Quiz ──────────────────────────────────────────────────────
function startQuiz(cat){
  const filtered=cat==="ALL"?[...questions]:questions.filter(q=>q.cat===cat);
  if(filtered.length===0){alert("このセットにこのカテゴリーの問題はありません。");return;}
  pool=shuffle(filtered);idx=0;selected=null;answered=false;results=[];
  hideAll();show("quiz-screen");
  buildTracker();
  renderQuestion();
}

// Shuffled option order per question (rebuilt each render)
let _optOrder = [];

function renderQuestion(){
  const q=pool[idx];
  $("prog-bar").style.width=(((idx+1)/pool.length)*100)+"%";
  $("prog-text").textContent="問題 "+(idx+1)+" / "+pool.length;
  $("q-badge").textContent=CAT_LABEL[q.cat];
  $("q-badge").style.background=BADGE_BG[q.cat];
  $("q-badge").style.color=BADGE_FG[q.cat];
  $("q-text").textContent=q.q;

  // Shuffle option display order, keeping track of where correct ans ends up
  _optOrder = [0,1,2,3];
  for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[_optOrder[i],_optOrder[j]]=[_optOrder[j],_optOrder[i]];}

  const opts=$("opts");opts.innerHTML="";
  _optOrder.forEach(function(origIdx,displayPos){
    const btn=document.createElement("button");btn.className="opt-btn";
    btn.innerHTML='<span class="opt-letter">'+String.fromCharCode(65+displayPos)+'</span>'+escHtml(q.opts[origIdx]);
    btn.onclick=function(){handleSelect(displayPos);};
    opts.appendChild(btn);
  });
  _pendingOi=null;
  hide("feedback");hide("explanation");updateRunScore();
  updateTracker();
}

// Pending selection before confirm
let _pendingOi = null;

function handleSelect(oi){
  if(answered)return;
  const btns=$("opts").querySelectorAll(".opt-btn");
  // Second click on same option confirms it
  if(_pendingOi===oi){ commitAnswer(oi); return; }
  // First click — highlight, wait for second click
  _pendingOi=oi;
  btns.forEach(function(b,i){
    b.classList.remove("pending");
    b.style.borderColor=""; b.style.background="";
  });
  btns[oi].classList.add("pending");
  btns[oi].style.borderColor=cfg().accent;
  btns[oi].style.background=cfg().accentLight;
}

function commitAnswer(oi){
  if(answered)return;
  _pendingOi=null;
  selected=oi; answered=true;
  const q=pool[idx];
  const chosenOrigIdx=_optOrder[oi];
  const isCorrect=chosenOrigIdx===q.ans;
  const correctDisplayPos=_optOrder.indexOf(q.ans);
  results[idx]={qId:q.id,chosen:oi,correct:correctDisplayPos,origChosen:chosenOrigIdx,origCorrect:q.ans};
  $("opts").querySelectorAll(".opt-btn").forEach(function(b,i){
    b.classList.remove("pending"); b.style.borderColor=""; b.style.background="";
    b.classList.add("locked");
    if(i===correctDisplayPos)b.classList.add("correct");
    else if(i===oi&&!isCorrect)b.classList.add("wrong");
  });
  $("fb-text").textContent=isCorrect?"✅ 正解！":"❌ 正解は："+q.opts[q.ans];
  $("exp-text").textContent=q.exp;
  show("explanation");
  $("next-btn").textContent=idx+1>=pool.length?"結果を見る →":"次へ →";
  show("feedback"); updateRunScore(); updateTracker();
}

function nextQuestion(){
  if(idx+1>=pool.length){finishQuiz();return;}
  idx++;selected=null;answered=false;renderQuestion();
}
function updateRunScore(){
  var cor=Object.values(results).filter(r=>r.chosen===r.correct).length;
  var tot=Object.keys(results).length;
  var p=tot>0?Math.round(cor/tot*100):0;
  $("run-score").textContent="得点："+cor+" / "+tot+(tot>0?" ("+p+"%)":"");
}
async function quitQuiz(){
  if(Object.keys(results).length>0){
    var ok=await openModal("クイズを終了しますか？","現在の回答は成績に保存されますが、結果画面は表示されません。","終了する");
    if(!ok)return;recordSession(Object.values(results));
  }
  goMenu();
}
function finishQuiz(){recordSession(Object.values(results));showReview();}

// ── Review ────────────────────────────────────────────────────
function showReview(){
  hideAll();hideTracker();show("review-screen");
  const c=cfg();
  const res=Object.values(results);
  var cor=res.filter(r=>r.chosen===r.correct).length,tot=res.length,p=Math.round(cor/tot*100);
  $("rv-pct").textContent=p+"%";$("rv-pct").style.color=c.accent;
  $("rv-label").textContent=cor+" / "+tot;
  $("rv-circle").style.borderColor=c.accent;
  $("rv-grade").textContent=p>=80?"🎉 素晴らしい！":p>=60?"👍 よくできました！":"📚 もっと頑張りましょう！";
  var catData={};
  res.forEach(r=>{var q=questions.find(x=>x.id===r.qId);if(!catData[q.cat])catData[q.cat]={right:0,wrong:0};
    if(r.chosen===r.correct)catData[q.cat].right++;else catData[q.cat].wrong++;});
  var bd=$("rv-stats-breakdown");bd.innerHTML="";
  if(Object.keys(catData).length>1){
    var h='<div style="margin:0 0 12px"><h3 style="font-size:14px;font-weight:700;color:var(--text2);margin-bottom:8px">カテゴリー別の成績</h3>';
    CATS.forEach(cat=>{if(!catData[cat])return;var d=catData[cat],tot=d.right+d.wrong,pct=Math.round(d.right/tot*100);
      h+='<div class="stats-cat-card"><div class="stats-cat-row"><span class="stats-cat-name" style="color:'+CAT_COLOR[cat]+'">'+CAT_ICON[cat]+' '+CAT_LABEL[cat]+'</span>'
        +'<span class="stats-cat-nums">'+d.right+' / '+tot+' ('+pct+'%)</span></div>'
        +'<div class="stats-bar-track"><div class="stats-bar-correct" style="width:'+pct+'%;background:'+CAT_COLOR[cat]+';opacity:.7"></div></div></div>';});
    h+='</div>';bd.innerHTML=h;
  }
  var wrong=res.filter(r=>r.chosen!==r.correct);
  var sec=$("wrong-section");sec.innerHTML="";
  if(wrong.length>0){
    sec.innerHTML='<h3 class="wrong-title" style="color:'+c.accent+'">間違えた問題 ('+wrong.length+')</h3>';
    wrong.forEach(r=>{
      var q=questions.find(x=>x.id===r.qId);
      var card=document.createElement("div");card.className="wrong-card";
      card.innerHTML='<span class="badge" style="background:'+BADGE_BG[q.cat]+';color:'+BADGE_FG[q.cat]+'">'+CAT_LABEL[q.cat]+'</span>'
        +'<p class="wrong-q">'+escHtml(q.q)+'</p>'
        +'<p style="font-size:13px;color:var(--text2)">あなたの回答：<span style="color:'+c.accent+'">'+escHtml(q.opts[r.origChosen])+'</span></p>'
        +'<p style="font-size:13px;color:var(--text2);margin-top:2px">正解：<span style="color:'+c.accent+';font-weight:700">'+escHtml(q.opts[r.origCorrect])+'</span></p>'
        +'<p class="wrong-exp">解説：'+escHtml(q.exp)+'</p>';
      sec.appendChild(card);
    });
  }
}

// ── Stats screen ──────────────────────────────────────────────
function showStats(){
  hideAll();hideTracker();show("stats-screen");
  const c=cfg();
  $("stats-sub").textContent=c.label+" の通算成績";
  var s=loadStats(),tot=s.totalRight+s.totalWrong,pct=tot>0?Math.round(s.totalRight/tot*100):0;
  $("stats-overall").innerHTML=
    '<div class="stats-big"><div class="stats-big-num" style="color:'+c.accent+'">'+s.sessions+'</div><div class="stats-big-label">セッション数</div></div>'
    +'<div class="stats-big"><div class="stats-big-num" style="color:'+c.accent+'">'+tot+'</div><div class="stats-big-label">回答数</div></div>'
    +'<div class="stats-big"><div class="stats-big-num" style="color:'+c.accent+'">'+pct+'%</div><div class="stats-big-label">正答率</div></div>';
  var cc=$("stats-cats");cc.innerHTML="";
  if(tot===0){cc.innerHTML='<p style="text-align:center;color:var(--text3);padding:18px 0">まだデータがありません。</p>';return;}
  CATS.forEach(cat=>{
    var d=s[cat],t=d.right+d.wrong;if(t===0)return;
    var p=Math.round(d.right/t*100),wp=100-p;
    var card=document.createElement("div");card.className="stats-cat-card";
    card.innerHTML='<div class="stats-cat-row"><span class="stats-cat-name" style="color:'+CAT_COLOR[cat]+'">'+CAT_ICON[cat]+' '+CAT_LABEL[cat]+'</span>'
      +'<span class="stats-cat-nums">正解 '+d.right+' · 不正解 '+d.wrong+'</span></div>'
      +'<div class="stats-bar-track"><div class="stats-bar-correct" style="width:'+p+'%;background:'+CAT_COLOR[cat]+';opacity:.75"></div>'
      +'<div class="stats-bar-wrong" style="width:'+wp+'%;background:'+c.barWrong+'"></div></div>'
      +'<div class="stats-detail"><span>'+p+'% 正解</span><span>計 '+t+'問</span></div>';
    cc.appendChild(card);
  });
}
async function resetStatsConfirm(){
  var ok=await openModal("成績をリセットしますか？","「"+cfg().label+"」のすべての成績データが削除されます。","リセット");
  if(!ok)return;saveStats(defaultStats());showStats();
}

// ── Event wiring ──────────────────────────────────────────────
document.querySelectorAll(".level-tab").forEach(tab=>{
  tab.addEventListener("click",function(){switchLevel(this.getAttribute("data-level"));});
});
document.querySelectorAll(".set-tab").forEach(tab=>{
  tab.addEventListener("click",function(){switchSet(this.getAttribute("data-set"));});
});
$("next-btn").onclick=nextQuestion;
$("back-btn").onclick=goMenu;
$("quit-btn").onclick=quitQuiz;
$("stats-back-btn").onclick=goMenu;
$("stats-reset-btn").onclick=resetStatsConfirm;

// ── Init ──────────────────────────────────────────────────────
applyDark();
// Support ?level= URL shortcut (from manifest shortcuts)
const _urlLevel = new URLSearchParams(window.location.search).get('level');
const _validLevels = ['5','4','3','P'];
switchLevel(_validLevels.includes(_urlLevel) ? _urlLevel : '5');
