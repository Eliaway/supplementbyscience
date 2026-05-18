// ============================================================
// MY STACK — مكملاتي، بروتوكولاتي، الداشبورد الشخصي
// ============================================================

// ======= STATE =======
let mySupps = JSON.parse(localStorage.getItem('mySupps') || '[]');
// mySupps: [{id, nameAr, nameEn, emoji, dose, unit, timing, notes, addedAt, log:{date:bool}}]

let myProtocols = JSON.parse(localStorage.getItem('myProtocols') || '[]');
// myProtocols: [{id, name, icon, goal, supplements:[{id,nameAr,dose,timing}], savedAt}]

let myStreak = JSON.parse(localStorage.getItem('myStreak') || '{"days":0,"lastDate":""}');

// ======= HELPERS =======
function saveMySupps() { localStorage.setItem('mySupps', JSON.stringify(mySupps)); }
function saveMyProtocols() { localStorage.setItem('myProtocols', JSON.stringify(myProtocols)); }
function saveStreak() { localStorage.setItem('myStreak', JSON.stringify(myStreak)); }

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak() {
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (myStreak.lastDate === today) return;
  if (myStreak.lastDate === yesterday) {
    myStreak.days += 1;
  } else if (myStreak.lastDate !== today) {
    myStreak.days = 1;
  }
  myStreak.lastDate = today;
  saveStreak();
}

function getTodayCompliance() {
  if (!mySupps.length) return 0;
  const today = todayStr();
  const done = mySupps.filter(s => s.log && s.log[today]).length;
  return Math.round((done / mySupps.length) * 100);
}

function getInteractionWarnings() {
  const warnings = [];
  const ids = mySupps.map(s => s.id);
  // Known interactions
  const INTERACTIONS = [
    { a: 'calcium', b: 'iron', msg: 'الكالسيوم يقلل امتصاص الحديد — خذهما بفارق ساعتين' },
    { a: 'zinc', b: 'copper', msg: 'الزنك الزائد يستنزف النحاس — تأكد من التوازن' },
    { a: 'vitd3', b: 'calcium', msg: 'فيتامин D3 مع الكالسيوم — ممتاز، لكن راقب مستوى الكالسيوم في الدم' },
    { a: 'magnesium', b: 'vitd3', msg: 'المغنيسيوم يُفعّل فيتامين D3 — تركيبة مثالية' },
    { a: 'omega3', b: 'vitk2', msg: 'أوميغا-3 مع K2 — يحسن صحة القلب والأوعية معاً' },
    { a: 'creatine', b: 'caffeine', msg: 'الكرياتين مع الكافيين — قد يقلل فعالية الكرياتين' },
    { a: 'melatonin', b: 'ashwagandha', msg: 'الميلاتونين مع أشواغاندا — تأثير مهدئ مضاعف، احذر النعاس الزائد' },
    { a: 'iron', b: 'vitc', msg: 'الحديد مع فيتامين C — يزيد الامتصاص بنسبة 3x' },
    { a: 'berberine', b: 'metformin', msg: 'بربرين مع ميتفورمين — تأثير مضاعف على السكر، استشر طبيبك' },
  ];
  INTERACTIONS.forEach(({ a, b, msg }) => {
    if (ids.includes(a) && ids.includes(b)) {
      warnings.push({ a, b, msg });
    }
  });
  return warnings;
}

// ======= RENDER DASHBOARD =======
function renderDashboard() {
  const el = document.getElementById('dashboardContent');
  if (!el) return;
  const today = todayStr();
  const compliance = getTodayCompliance();
  const warnings = getInteractionWarnings();
  const userName = (typeof onbCurrentUser !== 'undefined' && onbCurrentUser) ? onbCurrentUser.name : 'المستخدم';
  const goals = JSON.parse(localStorage.getItem('onbGoals') || '[]');
  const goalLabels = {
    energy:'⚡ الطاقة', muscle:'💪 العضلات', weight:'⚖️ الوزن', sleep:'😴 النوم',
    brain:'🧠 التركيز', immunity:'🛡️ المناعة', joints:'🦴 المفاصل', heart:'❤️ القلب',
    skin:'✨ الجلد', hormones:'⚗️ الهرمونات'
  };

  // Today's supplements
  const todaySupps = mySupps.map(s => ({
    ...s,
    done: !!(s.log && s.log[today])
  }));

  el.innerHTML = `
    <div class="dash-container">
      <!-- Header -->
      <div class="dash-header">
        <div class="dash-greeting">
          <div class="dash-greeting-text">مرحباً، ${userName} 👋</div>
          <div class="dash-date">${new Date().toLocaleDateString('ar-SA', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</div>
        </div>
        <div class="dash-streak">
          <div class="dash-streak-icon">🔥</div>
          <div class="dash-streak-val">${myStreak.days}</div>
          <div class="dash-streak-label">يوم متتالي</div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="dash-stats">
        <div class="dash-stat-card">
          <div class="dash-stat-icon" style="background:rgba(99,102,241,0.15)">💊</div>
          <div class="dash-stat-body">
            <div class="dash-stat-val">${mySupps.length}</div>
            <div class="dash-stat-label">مكمل في بروتوكولي</div>
          </div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon" style="background:rgba(16,185,129,0.15)">✅</div>
          <div class="dash-stat-body">
            <div class="dash-stat-val">${compliance}%</div>
            <div class="dash-stat-label">الالتزام اليوم</div>
          </div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon" style="background:rgba(245,158,11,0.15)">📋</div>
          <div class="dash-stat-body">
            <div class="dash-stat-val">${myProtocols.length}</div>
            <div class="dash-stat-label">بروتوكول محفوظ</div>
          </div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon" style="background:rgba(239,68,68,0.15)">⚠️</div>
          <div class="dash-stat-body">
            <div class="dash-stat-val">${warnings.length}</div>
            <div class="dash-stat-label">تنبيه تفاعل</div>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="dash-progress-card">
        <div class="dash-progress-header">
          <span>التزامك اليوم</span>
          <span style="font-weight:800;color:${compliance >= 80 ? 'var(--accent)' : compliance >= 50 ? 'var(--accent2)' : 'var(--accent3)'}">${compliance}%</span>
        </div>
        <div class="dash-progress-bar">
          <div class="dash-progress-fill" style="width:${compliance}%;background:${compliance >= 80 ? 'var(--accent)' : compliance >= 50 ? 'var(--accent2)' : 'var(--accent3)'}"></div>
        </div>
        <div class="dash-progress-sub">${todaySupps.filter(s=>s.done).length} من ${mySupps.length} مكملات تم أخذها</div>
      </div>

      <!-- Today's Supplements Checklist -->
      <div class="dash-section">
        <div class="dash-section-header">
          <span class="dash-section-title">💊 مكملاتي اليوم</span>
          <button class="dash-action-btn" onclick="showSection('my-supplements')">إدارة المكملات →</button>
        </div>
        ${todaySupps.length === 0 ? `
          <div class="dash-empty">
            <div style="font-size:3rem">💊</div>
            <div>لم تضف أي مكملات بعد</div>
            <button class="btn-primary" style="margin-top:12px" onclick="showSection('my-supplements')">إضافة مكملات</button>
          </div>
        ` : `
          <div class="checklist">
            ${todaySupps.map(s => `
              <div class="checklist-item ${s.done ? 'done' : ''}" onclick="toggleSuppLog('${s.id}')">
                <div class="checklist-check">${s.done ? '✅' : '⬜'}</div>
                <div class="checklist-emoji">${s.emoji || '💊'}</div>
                <div class="checklist-body">
                  <div class="checklist-name">${s.nameAr}</div>
                  <div class="checklist-meta">${s.dose} ${s.unit} • ${s.timing}</div>
                </div>
                ${s.done ? '<div class="checklist-badge">تم ✓</div>' : ''}
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Interaction Warnings -->
      ${warnings.length > 0 ? `
        <div class="dash-section">
          <div class="dash-section-header">
            <span class="dash-section-title">⚠️ تنبيهات التفاعلات</span>
          </div>
          <div class="warnings-list">
            ${warnings.map(w => `
              <div class="warning-item">
                <div class="warning-icon">⚠️</div>
                <div class="warning-text">${w.msg}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Goals -->
      ${goals.length > 0 ? `
        <div class="dash-section">
          <div class="dash-section-header">
            <span class="dash-section-title">🎯 أهدافك الصحية</span>
          </div>
          <div class="goals-chips">
            ${goals.map(g => `<span class="goal-chip">${goalLabels[g] || g}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Quick Actions -->
      <div class="dash-section">
        <div class="dash-section-header">
          <span class="dash-section-title">⚡ إجراءات سريعة</span>
        </div>
        <div class="quick-actions">
          <button class="quick-action-btn" onclick="showSection('my-supplements')">
            <span style="font-size:24px">💊</span>
            <span>مكملاتي</span>
          </button>
          <button class="quick-action-btn" onclick="showSection('my-protocols')">
            <span style="font-size:24px">📋</span>
            <span>بروتوكولاتي</span>
          </button>
          <button class="quick-action-btn" onclick="showSection('ai')">
            <span style="font-size:24px">🤖</span>
            <span>مساعد AI</span>
          </button>
          <button class="quick-action-btn" onclick="showSection('supplements')">
            <span style="font-size:24px">🔬</span>
            <span>استكشاف</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ======= TOGGLE SUPPLEMENT LOG =======
function toggleSuppLog(id) {
  const today = todayStr();
  const s = mySupps.find(x => x.id === id);
  if (!s) return;
  if (!s.log) s.log = {};
  s.log[today] = !s.log[today];
  saveMySupps();
  updateStreak();
  renderDashboard();
}

// ======= RENDER MY SUPPLEMENTS =======
function renderMySupplements() {
  const el = document.getElementById('mySupplementsContent');
  if (!el) return;
  const today = todayStr();

  el.innerHTML = `
    <div class="section-container" style="max-width:900px">
      <div class="my-section-header">
        <div>
          <h2 class="my-section-title">💊 مكملاتي</h2>
          <p class="my-section-sub">تتبع مكملاتك اليومية وجرعاتك</p>
        </div>
        <button class="btn-primary" onclick="openAddSuppModal()">+ إضافة مكمل</button>
      </div>

      <!-- Summary Bar -->
      <div class="my-summary-bar">
        <div class="my-summary-item">
          <span class="my-summary-val">${mySupps.length}</span>
          <span class="my-summary-label">مكمل</span>
        </div>
        <div class="my-summary-divider"></div>
        <div class="my-summary-item">
          <span class="my-summary-val">${mySupps.filter(s=>s.log&&s.log[today]).length}</span>
          <span class="my-summary-label">تم اليوم</span>
        </div>
        <div class="my-summary-divider"></div>
        <div class="my-summary-item">
          <span class="my-summary-val">${getTodayCompliance()}%</span>
          <span class="my-summary-label">الالتزام</span>
        </div>
      </div>

      <!-- Supplements List -->
      ${mySupps.length === 0 ? `
        <div class="my-empty">
          <div style="font-size:4rem;margin-bottom:16px">💊</div>
          <h3>لم تضف أي مكملات بعد</h3>
          <p>ابدأ بإضافة مكملاتك لتتبع جرعاتك اليومية</p>
          <button class="btn-primary" style="margin-top:20px" onclick="openAddSuppModal()">+ إضافة أول مكمل</button>
        </div>
      ` : `
        <div class="my-supps-list">
          ${mySupps.map(s => {
            const done = !!(s.log && s.log[today]);
            return `
              <div class="my-supp-card ${done ? 'done' : ''}">
                <div class="my-supp-left">
                  <div class="my-supp-emoji">${s.emoji || '💊'}</div>
                  <div class="my-supp-info">
                    <div class="my-supp-name">${s.nameAr}</div>
                    <div class="my-supp-en">${s.nameEn || ''}</div>
                    <div class="my-supp-dose">${s.dose} ${s.unit} • ${s.timing}</div>
                    ${s.notes ? `<div class="my-supp-notes">📝 ${s.notes}</div>` : ''}
                  </div>
                </div>
                <div class="my-supp-right">
                  <button class="my-check-btn ${done ? 'done' : ''}" onclick="toggleSuppLog('${s.id}')">
                    ${done ? '✅ تم' : '⬜ خذ الآن'}
                  </button>
                  <div class="my-supp-actions">
                    <button class="my-icon-btn" onclick="editSuppModal('${s.id}')" title="تعديل">✏️</button>
                    <button class="my-icon-btn danger" onclick="removeSupp('${s.id}')" title="حذف">🗑️</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Weekly Compliance Chart -->
        <div class="my-week-card">
          <div class="my-week-title">📊 الالتزام الأسبوعي</div>
          <div class="my-week-bars">
            ${Array.from({length:7}, (_,i) => {
              const d = new Date(Date.now() - (6-i)*86400000);
              const ds = d.toISOString().slice(0,10);
              const done = mySupps.filter(s=>s.log&&s.log[ds]).length;
              const pct = mySupps.length ? Math.round((done/mySupps.length)*100) : 0;
              const dayName = d.toLocaleDateString('ar-SA', {weekday:'short'});
              const isToday = ds === today;
              return `
                <div class="my-week-bar-col">
                  <div class="my-week-bar-wrap">
                    <div class="my-week-bar-fill" style="height:${pct}%;background:${isToday?'var(--primary)':'var(--border2)'}"></div>
                  </div>
                  <div class="my-week-day ${isToday?'today':''}">${dayName}</div>
                  <div class="my-week-pct">${pct}%</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `}

      <!-- Add Supplement Modal -->
      <div id="addSuppModal" class="my-modal hidden">
        <div class="my-modal-box">
          <div class="my-modal-header">
            <span id="addSuppModalTitle">إضافة مكمل</span>
            <button onclick="closeAddSuppModal()" style="background:none;border:none;color:var(--text3);font-size:20px;cursor:pointer">✕</button>
          </div>
          <div class="my-modal-body">
            <!-- Search from database -->
            <div class="my-modal-section">
              <div class="my-modal-section-title">🔍 ابحث في قاعدة البيانات</div>
              <input type="text" id="suppSearchInput" class="my-input" placeholder="اكتب اسم المكمل..." oninput="searchSuppsForAdd(this.value)">
              <div id="suppSearchResults" class="supp-search-results"></div>
            </div>
            <div class="my-modal-divider">أو أضف يدوياً</div>
            <!-- Manual Entry -->
            <div class="my-modal-grid">
              <div class="my-form-group">
                <label>اسم المكمل (عربي)</label>
                <input type="text" id="newSuppNameAr" class="my-input" placeholder="مثال: فيتامين D3">
              </div>
              <div class="my-form-group">
                <label>الاسم الإنجليزي</label>
                <input type="text" id="newSuppNameEn" class="my-input" placeholder="Vitamin D3">
              </div>
              <div class="my-form-group">
                <label>الجرعة</label>
                <input type="text" id="newSuppDose" class="my-input" placeholder="5000">
              </div>
              <div class="my-form-group">
                <label>الوحدة</label>
                <select id="newSuppUnit" class="my-input">
                  <option>IU</option><option>مغ</option><option>غ</option><option>ملغ</option><option>كبسولة</option><option>قرص</option><option>ملعقة</option>
                </select>
              </div>
              <div class="my-form-group" style="grid-column:1/-1">
                <label>توقيت الأخذ</label>
                <select id="newSuppTiming" class="my-input">
                  <option>مع الفطور</option><option>مع الغداء</option><option>مع العشاء</option>
                  <option>قبل النوم</option><option>قبل التمرين</option><option>بعد التمرين</option>
                  <option>على معدة فارغة</option><option>في أي وقت</option>
                </select>
              </div>
              <div class="my-form-group" style="grid-column:1/-1">
                <label>ملاحظات (اختياري)</label>
                <input type="text" id="newSuppNotes" class="my-input" placeholder="مثال: مع وجبة دهنية">
              </div>
            </div>
            <input type="hidden" id="editSuppId" value="">
            <button class="btn-primary" style="width:100%;margin-top:8px" onclick="saveNewSupp()">💾 حفظ المكمل</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function searchSuppsForAdd(q) {
  const el = document.getElementById('suppSearchResults');
  if (!q || q.length < 2) { el.innerHTML = ''; return; }
  const results = (typeof SUPPLEMENTS_DATA !== 'undefined' ? SUPPLEMENTS_DATA : [])
    .filter(s => s.nameAr.includes(q) || (s.nameEn && s.nameEn.toLowerCase().includes(q.toLowerCase())))
    .slice(0, 8);
  if (!results.length) { el.innerHTML = '<div class="supp-search-empty">لا توجد نتائج</div>'; return; }
  el.innerHTML = results.map(s => `
    <div class="supp-search-item" onclick="selectSuppFromSearch('${s.id}')">
      <span>${s.emoji || '💊'}</span>
      <span>${s.nameAr}</span>
      <span style="color:var(--text3);font-size:12px">${s.nameEn}</span>
    </div>
  `).join('');
}

function selectSuppFromSearch(id) {
  const s = (typeof SUPPLEMENTS_DATA !== 'undefined' ? SUPPLEMENTS_DATA : []).find(x => x.id === id);
  if (!s) return;
  document.getElementById('newSuppNameAr').value = s.nameAr;
  document.getElementById('newSuppNameEn').value = s.nameEn || '';
  document.getElementById('newSuppDose').value = s.dosage?.min?.replace(/[^\d.]/g, '') || '';
  document.getElementById('newSuppUnit').value = s.dosage?.unit?.split('/')[0] || 'مغ';
  document.getElementById('newSuppTiming').value = s.dosage?.timing || 'مع الفطور';
  document.getElementById('suppSearchResults').innerHTML = '';
  document.getElementById('suppSearchInput').value = '';
  // Store emoji and id for saving
  document.getElementById('newSuppNameAr').dataset.emoji = s.emoji || '💊';
  document.getElementById('newSuppNameAr').dataset.dbId = s.id;
}

function openAddSuppModal() {
  document.getElementById('addSuppModalTitle').textContent = 'إضافة مكمل';
  document.getElementById('editSuppId').value = '';
  document.getElementById('newSuppNameAr').value = '';
  document.getElementById('newSuppNameEn').value = '';
  document.getElementById('newSuppDose').value = '';
  document.getElementById('newSuppNotes').value = '';
  document.getElementById('addSuppModal').classList.remove('hidden');
}

function closeAddSuppModal() {
  document.getElementById('addSuppModal').classList.add('hidden');
}

function editSuppModal(id) {
  const s = mySupps.find(x => x.id === id);
  if (!s) return;
  document.getElementById('addSuppModalTitle').textContent = 'تعديل المكمل';
  document.getElementById('editSuppId').value = id;
  document.getElementById('newSuppNameAr').value = s.nameAr;
  document.getElementById('newSuppNameEn').value = s.nameEn || '';
  document.getElementById('newSuppDose').value = s.dose;
  document.getElementById('newSuppUnit').value = s.unit;
  document.getElementById('newSuppTiming').value = s.timing;
  document.getElementById('newSuppNotes').value = s.notes || '';
  document.getElementById('addSuppModal').classList.remove('hidden');
}

function saveNewSupp() {
  const nameAr = document.getElementById('newSuppNameAr').value.trim();
  const nameEn = document.getElementById('newSuppNameEn').value.trim();
  const dose = document.getElementById('newSuppDose').value.trim();
  const unit = document.getElementById('newSuppUnit').value;
  const timing = document.getElementById('newSuppTiming').value;
  const notes = document.getElementById('newSuppNotes').value.trim();
  const editId = document.getElementById('editSuppId').value;
  const emoji = document.getElementById('newSuppNameAr').dataset.emoji || '💊';
  const dbId = document.getElementById('newSuppNameAr').dataset.dbId || '';

  if (!nameAr || !dose) { alert('يرجى إدخال اسم المكمل والجرعة'); return; }

  if (editId) {
    const idx = mySupps.findIndex(x => x.id === editId);
    if (idx !== -1) {
      mySupps[idx] = { ...mySupps[idx], nameAr, nameEn, dose, unit, timing, notes };
    }
  } else {
    const id = dbId || ('custom_' + Date.now());
    if (mySupps.find(x => x.id === id)) { alert('هذا المكمل موجود بالفعل'); return; }
    mySupps.push({ id, nameAr, nameEn, emoji, dose, unit, timing, notes, addedAt: new Date().toISOString(), log: {} });
  }
  saveMySupps();
  closeAddSuppModal();
  renderMySupplements();
}

function removeSupp(id) {
  if (!confirm('هل تريد حذف هذا المكمل؟')) return;
  mySupps = mySupps.filter(x => x.id !== id);
  saveMySupps();
  renderMySupplements();
}

// ======= RENDER MY PROTOCOLS =======
function renderMyProtocols() {
  const el = document.getElementById('myProtocolsContent');
  if (!el) return;

  el.innerHTML = `
    <div class="section-container" style="max-width:900px">
      <div class="my-section-header">
        <div>
          <h2 class="my-section-title">📋 بروتوكولاتي</h2>
          <p class="my-section-sub">بروتوكولاتك المحفوظة والمخصصة</p>
        </div>
        <button class="btn-primary" onclick="openAddProtocolModal()">+ إنشاء بروتوكول</button>
      </div>

      ${myProtocols.length === 0 ? `
        <div class="my-empty">
          <div style="font-size:4rem;margin-bottom:16px">📋</div>
          <h3>لا توجد بروتوكولات محفوظة</h3>
          <p>احفظ بروتوكولاً من المكتبة أو أنشئ بروتوكولاً مخصصاً</p>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;flex-wrap:wrap">
            <button class="btn-primary" onclick="openAddProtocolModal()">+ إنشاء بروتوكول</button>
            <button class="btn-outline" onclick="showSection('protocols')">استعرض المكتبة</button>
          </div>
        </div>
      ` : `
        <div class="my-protocols-grid">
          ${myProtocols.map(p => `
            <div class="my-protocol-card">
              <div class="my-protocol-header">
                <div class="my-protocol-icon">${p.icon || '📋'}</div>
                <div class="my-protocol-info">
                  <div class="my-protocol-name">${p.name}</div>
                  <div class="my-protocol-goal">${p.goal || ''}</div>
                </div>
                <div class="my-protocol-actions">
                  <button class="my-icon-btn" onclick="addProtocolToStack('${p.id}')" title="إضافة للمكملات اليومية">➕</button>
                  <button class="my-icon-btn danger" onclick="removeProtocol('${p.id}')" title="حذف">🗑️</button>
                </div>
              </div>
              <div class="my-protocol-supps">
                ${(p.supplements || []).map(s => `
                  <div class="my-protocol-supp-item">
                    <span class="my-protocol-supp-dot"></span>
                    <span class="my-protocol-supp-name">${s.nameAr}</span>
                    <span class="my-protocol-supp-dose">${s.dose} • ${s.timing}</span>
                  </div>
                `).join('')}
              </div>
              <div class="my-protocol-footer">
                <span style="font-size:12px;color:var(--text3)">
                  ${new Date(p.savedAt).toLocaleDateString('ar-SA')}
                </span>
                <button class="my-protocol-activate-btn" onclick="activateProtocol('${p.id}')">
                  تفعيل كبروتوكول يومي
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}

      <!-- Add Protocol Modal -->
      <div id="addProtocolModal" class="my-modal hidden">
        <div class="my-modal-box" style="max-width:600px">
          <div class="my-modal-header">
            <span>إنشاء بروتوكول مخصص</span>
            <button onclick="closeAddProtocolModal()" style="background:none;border:none;color:var(--text3);font-size:20px;cursor:pointer">✕</button>
          </div>
          <div class="my-modal-body">
            <div class="my-form-group">
              <label>اسم البروتوكول</label>
              <input type="text" id="newProtName" class="my-input" placeholder="مثال: بروتوكول الطاقة والتركيز">
            </div>
            <div class="my-form-group">
              <label>الهدف</label>
              <input type="text" id="newProtGoal" class="my-input" placeholder="مثال: تحسين الطاقة والتركيز">
            </div>
            <div class="my-form-group">
              <label>الأيقونة</label>
              <div class="icon-picker">
                ${['⚡','💪','😴','🧠','❤️','🛡️','🦴','✨','⚗️','🔥','🌿','💎'].map(ic => `
                  <button class="icon-pick-btn" onclick="selectProtIcon('${ic}')" id="icon-${ic}">${ic}</button>
                `).join('')}
              </div>
              <input type="hidden" id="newProtIcon" value="📋">
            </div>
            <div class="my-modal-section-title" style="margin:16px 0 8px">المكملات في البروتوكول</div>
            <div id="protSuppsList"></div>
            <div style="display:flex;gap:8px;margin-top:8px">
              <input type="text" id="protSuppSearch" class="my-input" placeholder="ابحث عن مكمل..." oninput="searchSuppsForProtocol(this.value)" style="flex:1">
            </div>
            <div id="protSuppResults" class="supp-search-results"></div>
            <button class="btn-primary" style="width:100%;margin-top:16px" onclick="saveNewProtocol()">💾 حفظ البروتوكول</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

let newProtSupps = [];

function openAddProtocolModal() {
  newProtSupps = [];
  document.getElementById('newProtName').value = '';
  document.getElementById('newProtGoal').value = '';
  document.getElementById('newProtIcon').value = '📋';
  document.getElementById('protSuppsList').innerHTML = '';
  document.getElementById('addProtocolModal').classList.remove('hidden');
}

function closeAddProtocolModal() {
  document.getElementById('addProtocolModal').classList.add('hidden');
}

function selectProtIcon(ic) {
  document.getElementById('newProtIcon').value = ic;
  document.querySelectorAll('.icon-pick-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('icon-' + ic)?.classList.add('selected');
}

function searchSuppsForProtocol(q) {
  const el = document.getElementById('protSuppResults');
  if (!q || q.length < 2) { el.innerHTML = ''; return; }
  const results = (typeof SUPPLEMENTS_DATA !== 'undefined' ? SUPPLEMENTS_DATA : [])
    .filter(s => s.nameAr.includes(q) || (s.nameEn && s.nameEn.toLowerCase().includes(q.toLowerCase())))
    .slice(0, 8);
  el.innerHTML = results.map(s => `
    <div class="supp-search-item" onclick="addSuppToProtocol('${s.id}')">
      <span>${s.emoji || '💊'}</span>
      <span>${s.nameAr}</span>
      <span style="color:var(--text3);font-size:12px">${s.nameEn}</span>
    </div>
  `).join('');
}

function addSuppToProtocol(id) {
  const s = (typeof SUPPLEMENTS_DATA !== 'undefined' ? SUPPLEMENTS_DATA : []).find(x => x.id === id);
  if (!s || newProtSupps.find(x => x.id === id)) return;
  newProtSupps.push({
    id: s.id,
    nameAr: s.nameAr,
    nameEn: s.nameEn || '',
    emoji: s.emoji || '💊',
    dose: s.dosage?.min || '1',
    unit: s.dosage?.unit?.split('/')[0] || 'مغ',
    timing: s.dosage?.timing || 'مع الفطور'
  });
  document.getElementById('protSuppSearch').value = '';
  document.getElementById('protSuppResults').innerHTML = '';
  renderProtSuppsList();
}

function renderProtSuppsList() {
  const el = document.getElementById('protSuppsList');
  if (!el) return;
  el.innerHTML = newProtSupps.map((s, i) => `
    <div class="prot-supp-row">
      <span>${s.emoji} ${s.nameAr}</span>
      <input type="text" value="${s.dose}" class="my-input" style="width:70px" onchange="newProtSupps[${i}].dose=this.value">
      <select class="my-input" style="width:80px" onchange="newProtSupps[${i}].timing=this.value">
        ${['مع الفطور','مع الغداء','مع العشاء','قبل النوم','قبل التمرين','بعد التمرين'].map(t => `<option ${s.timing===t?'selected':''}>${t}</option>`).join('')}
      </select>
      <button onclick="newProtSupps.splice(${i},1);renderProtSuppsList()" style="background:none;border:none;color:var(--accent3);cursor:pointer;font-size:16px">✕</button>
    </div>
  `).join('') || '<div style="color:var(--text3);font-size:13px;padding:8px">لم تضف أي مكملات بعد</div>';
}

function saveNewProtocol() {
  const name = document.getElementById('newProtName').value.trim();
  const goal = document.getElementById('newProtGoal').value.trim();
  const icon = document.getElementById('newProtIcon').value;
  if (!name) { alert('يرجى إدخال اسم البروتوكول'); return; }
  myProtocols.push({
    id: 'prot_' + Date.now(),
    name, goal, icon,
    supplements: [...newProtSupps],
    savedAt: new Date().toISOString()
  });
  saveMyProtocols();
  closeAddProtocolModal();
  renderMyProtocols();
}

function removeProtocol(id) {
  if (!confirm('هل تريد حذف هذا البروتوكول؟')) return;
  myProtocols = myProtocols.filter(x => x.id !== id);
  saveMyProtocols();
  renderMyProtocols();
}

function activateProtocol(id) {
  const p = myProtocols.find(x => x.id === id);
  if (!p) return;
  let added = 0;
  (p.supplements || []).forEach(s => {
    if (!mySupps.find(x => x.id === s.id)) {
      mySupps.push({ ...s, addedAt: new Date().toISOString(), log: {} });
      added++;
    }
  });
  saveMySupps();
  alert(`تم إضافة ${added} مكمل جديد إلى قائمتك اليومية`);
  showSection('my-supplements');
}

function addProtocolToStack(id) {
  activateProtocol(id);
}

// Save a protocol from the library
function saveProtocolToMy(protId, name, icon, goal, supplements) {
  if (myProtocols.find(x => x.id === protId)) {
    alert('هذا البروتوكول محفوظ بالفعل');
    return;
  }
  myProtocols.push({
    id: protId,
    name, goal, icon,
    supplements: supplements || [],
    savedAt: new Date().toISOString()
  });
  saveMyProtocols();
  alert('تم حفظ البروتوكول في "بروتوكولاتي" ✅');
}
