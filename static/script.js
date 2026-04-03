var currentUser=null;
var TK='dermai-theme';
var cur=localStorage.getItem(TK)||'light';

function applyTheme(t){
  var h=document.documentElement;
  if(t==='system'){h.setAttribute('data-theme',window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');}
  else{h.setAttribute('data-theme',t);}
  ['light','dark','system'].forEach(function(x){
    ['sb-','tb-','ln-'].forEach(function(p){var el=document.getElementById(p+x);if(el)el.classList.toggle('on',x===t);});
  });
  cur=t;localStorage.setItem(TK,t);
}
function setTheme(t){applyTheme(t);}
window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(){if(cur==='system')applyTheme('system');});
applyTheme(cur);

// Navbar scroll effect
window.addEventListener('scroll',function(){
  var nav=document.getElementById('lnav');
  if(nav)nav.classList.toggle('scrolled',window.scrollY>40);
});

function scrollTo(id){
  var el=document.querySelector(id);
  if(el)el.scrollIntoView({behavior:'smooth'});
}

// AUTH
function showAuth(tab){
  document.getElementById('authGate').classList.add('show');
  switchAuthTab(tab||'signup');
}
function closeAuth(){document.getElementById('authGate').classList.remove('show');}
function closeAuthGate(e){if(e.target===document.getElementById('authGate'))closeAuth();}

function switchAuthTab(tab){
  var si=tab==='signin';
  document.getElementById('tabSignIn').classList.toggle('on',si);
  document.getElementById('tabSignUp').classList.toggle('on',!si);
  document.getElementById('signInForm').style.display=si?'':'none';
  document.getElementById('signUpForm').style.display=si?'none':'';
  document.getElementById('forgotForm').style.display='none';
  document.getElementById('authHeadline').textContent=si?'Welcome back':'Create account';
  document.getElementById('authSubtext').textContent=si?'Sign in to access your skin analysis history.':'Join DermAI and start your skin health journey.';
}
function showForgot(){document.getElementById('signInForm').style.display='none';document.getElementById('forgotForm').style.display='block';document.getElementById('authHeadline').textContent='Reset password';document.getElementById('authSubtext').textContent='We\'ll send a reset link to your email.';}
function showSignIn(){document.getElementById('forgotForm').style.display='none';document.getElementById('signInForm').style.display='block';document.getElementById('authHeadline').textContent='Welcome back';document.getElementById('authSubtext').textContent='Sign in to access your skin analysis history.';}
function googleAuth(){currentUser={name:'Google User',email:'user@gmail.com',initials:'G',google:true};closeAuth();launchApp();document.getElementById('googleBadge').style.display='';}
function signIn(){var e=document.getElementById('siEmail').value.trim(),p=document.getElementById('siPass').value;if(!e||!p){toast('Please fill in all fields','warn');return;}currentUser={name:e.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}),email:e,initials:e[0].toUpperCase(),google:false};closeAuth();launchApp();}
function signUp(){var f=document.getElementById('suFirst').value.trim(),l=document.getElementById('suLast').value.trim(),e=document.getElementById('suEmail').value.trim(),p=document.getElementById('suPass').value;if(!f||!e||!p){toast('Please fill in all required fields','warn');return;}currentUser={name:(f+' '+l).trim(),email:e,initials:f[0].toUpperCase(),google:false};closeAuth();launchApp();}
function sendReset(){toast('Reset link sent! Check your email.','info');}

function launchApp(){
  document.getElementById('landingPage').style.display='none';
  document.getElementById('appShell').style.display='flex';
  updateUserUI();
  toast('Welcome, '+currentUser.name.split(' ')[0]+'!','ok');
}
function updateUserUI(){
  if(!currentUser)return;
  var i=currentUser.initials||'?';
  ['sbAvatar','tbAvatar','profileAv'].forEach(function(id){var el=document.getElementById(id);if(el)el.textContent=i;});
  document.getElementById('sbName').textContent=currentUser.name||'Your Account';
  document.getElementById('profileName').textContent=currentUser.name||'Your Name';
  document.getElementById('profileEmail').textContent=currentUser.email||'';
  var ep1=document.getElementById('epFirst'),ep2=document.getElementById('epLast'),ep3=document.getElementById('epEmail');
  var parts=(currentUser.name||'').split(' ');
  if(ep1)ep1.value=parts[0]||'';if(ep2)ep2.value=parts.slice(1).join(' ')||'';if(ep3)ep3.value=currentUser.email||'';
  if(currentUser.google)document.getElementById('googleBadge').style.display='';
}
function signOut(){
  closeModal('profileOverlay');currentUser=null;
  document.getElementById('appShell').style.display='none';
  document.getElementById('landingPage').style.display='block';
  toast('Signed out successfully','info');
}
function togglePw(id,btn){var inp=document.getElementById(id);inp.type=inp.type==='password'?'text':'password';}
function pwStrength(inp){var v=inp.value,s=0;if(v.length>=8)s++;if(/[A-Z]/.test(v))s++;if(/[0-9]/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;var f=document.getElementById('pwFill');f.style.width=(s/4*100)+'%';f.style.background=['#C25A2A','#C4952A','#1A7A5E','#0D4233'][Math.max(0,s-1)];}

function goTo(s){
  document.querySelectorAll('.page-content,.results-wrap,.community-wrap,.history-wrap,.settings-wrap,.loading-state').forEach(function(el){el.style.display='none';});
  document.querySelectorAll('.nav-item').forEach(function(n,i){n.classList.toggle('active',['analyze','results','community','history','settings','',''][i]===s);});
  var subs={analyze:'Upload a photo or describe your symptoms',results:'Diagnosis report ready',community:'Community-shared remedies',history:'Your past analyses',settings:'Manage your account'};
  document.getElementById('tb-sub').textContent=subs[s]||'';
  var map={analyze:'sec-analyze',results:'sec-results',community:'sec-community',history:'sec-history',settings:'sec-settings'};
  var el=document.getElementById(map[s]);
  if(el){el.style.display='block';el.classList.add('show');}
}

function handleUpload(e){
  var f=e.target.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(ev){
    var z=document.getElementById('uploadZone');
    z.style.backgroundImage='url('+ev.target.result+')';
    z.style.backgroundSize='cover';z.style.backgroundPosition='center';
    z.style.borderStyle='solid';z.style.borderColor='var(--accent)';
    document.getElementById('uplTitle').textContent=f.name;
    document.getElementById('uplSub').textContent='Photo ready — fill in details and run analysis.';
    document.getElementById('uplSub').style.color='var(--accent)';
    z.querySelector('.fmt-row').style.display='none';
  };
  r.readAsDataURL(f);
}

function runAnalysis() {
    let fileInput = document.getElementById("fileIn");
    let file = fileInput.files[0];

    if (!file) {
        alert("Please upload an image first!");
        return;
    }

    let formData = new FormData();
    formData.append("image", file);

    fetch("/predict", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ Response:", data);

        // 👉 keep YOUR original navigation
        goTo('results');

        // 👉 SAFE UI UPDATE (no crash)
        let nameEl = document.querySelector(".dx-name");
        let confEl = document.querySelector(".conf-num");
        let barEl = document.querySelector(".conf-bar-fill");

        if (nameEl) nameEl.innerText = data.disease || "Unknown";
        if (confEl) confEl.innerText = (data.confidence || 0) + "%";
        if (barEl) barEl.style.width = (data.confidence || 0) + "%";
    })
    .catch(err => {
        console.error("❌ ERROR:", err);
        alert("Error occurred! Check console.");
    });
}

function openProfile(){document.getElementById('profileOverlay').classList.add('show');}
function openNotifs(){document.getElementById('notifOverlay').classList.add('show');document.querySelector('.notif-dot').style.display='none';}
function openEditProfile(){closeModal('profileOverlay');document.getElementById('editOverlay').classList.add('show');}
function closeModal(id){document.getElementById(id).classList.remove('show');}
function markAllRead(){document.querySelectorAll('.notif-item.unread').forEach(function(el){el.classList.remove('unread');});toast('All notifications marked as read','info');}
function saveProfile(){
  var f=document.getElementById('epFirst').value.trim(),l=document.getElementById('epLast').value.trim(),e=document.getElementById('epEmail').value.trim();
  if(f&&e&&currentUser){currentUser.name=(f+' '+l).trim();currentUser.email=e;currentUser.initials=f[0].toUpperCase();updateUserUI();}
  closeModal('editOverlay');toast('Profile updated!','info');
}
function toggleForm(){var b=document.getElementById('addBody'),btn=document.getElementById('togBtn'),o=b.classList.toggle('open');btn.classList.toggle('open',o);btn.textContent=o?'× Cancel':'+ Add remedy';}
function addRemedy(){
  var n=document.getElementById('rName').value.trim(),c=document.getElementById('rCond').value,d=document.getElementById('rDesc').value.trim();
  if(!n||!d){toast('Please fill in remedy name and description','warn');return;}
  var g=document.getElementById('remedyGrid'),el=document.createElement('div');
  el.className='rc';el.dataset.cond=c.split('/')[0].trim();
  el.innerHTML='<div class="rc-head"><div><div class="rc-title">'+n+'</div><div class="rc-meta">You · just now</div></div><span class="h-pill">0</span></div><div class="rc-body">'+d+'</div><div class="rc-foot"><button class="vbtn" onclick="castVote(this)"><svg viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.5 2v7M2 5.5l3.5-3.5 3.5 3.5"/></svg>Helpful</button><button class="vbtn" onclick="markTried(this)">Tried it</button><span class="ctag">'+c+'</span></div>';
  g.prepend(el);document.getElementById('rName').value='';document.getElementById('rDesc').value='';
  toggleForm();toast('Remedy posted!','ok');
}
function castVote(btn){var b=btn.closest('.rc').querySelector('.h-pill'),v=btn.classList.toggle('voted');b.textContent=parseInt(b.textContent)+(v?1:-1);}
function markTried(btn){btn.classList.add('voted');btn.textContent='✓ Tried';}
function filterR(btn,cond){document.querySelectorAll('.fbtn').forEach(function(b){b.classList.remove('on');});btn.classList.add('on');document.querySelectorAll('.rc').forEach(function(c){c.style.display=(cond==='All'||c.dataset.cond===cond)?'':'none';});}

function toast(msg,type){
  type=type||'info';
  var wrap=document.getElementById('toastWrap'),el=document.createElement('div');
  el.className='toast';
  var dot=type==='warn'?'warn':type==='ok'?'ok':'info';
  el.innerHTML='<div class="toast-dot '+dot+'"></div>'+msg;
  wrap.appendChild(el);
  setTimeout(function(){el.classList.add('out');setTimeout(function(){el.remove();},300);},3200);
}

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    closeAuth();
    ['profileOverlay','notifOverlay','editOverlay'].forEach(function(id){closeModal(id);});
  }
});

// Intersection observer for scroll animations
if('IntersectionObserver' in window){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='none';}
    });
  },{threshold:.15});
  document.querySelectorAll('.feat-card,.step,.cond-card').forEach(function(el){obs.observe(el);});
}
