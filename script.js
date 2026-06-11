
  // ===== STATE =====
  let userName = '';
  let calYear, calMonth;
  const now = new Date();

  // ===== TICKER DATA =====
  const row1 = [['🍏','Track meals mindfully'],['🥕','Increase meals nutrition'],['🧘','Morning meditation'],['💧','Drink more water'],['🏃','Daily exercise'],['😴','Quality sleep']];
  const row2 = [['🥦','Build healthy habits'],['🎯','Set daily goals'],['📖','Read every day'],['🌿','Eat more greens'],['🧠','Mental wellness'],['⚡','Stay energized']];
  const row3 = [['🍽️','Mindful eating'],['🔥','Stay consistent'],['💪','Strength training'],['🌙','Evening routine'],['🫁','Deep breathing'],['🌞','Morning sunlight']];

  function buildTicker(id, items) {
    const el = document.getElementById(id);
    const doubled = [...items, ...items];
    el.innerHTML = doubled.map(([icon, text]) =>
      `<div class="ticker-item"><span class="ticker-icon">${icon}</span>${text}</div>`
    ).join('');
  }

  buildTicker('ticker1', row1);
  buildTicker('ticker2', row2);
  buildTicker('ticker3', row3);

  // ===== NAVIGATION =====
  function goTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    if (page === 'app') {
      initApp();
    }
  }

  function goBackToApp() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-app').classList.add('active');
  }

  // ===== AUTH =====
  function doSignup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const pass = document.getElementById('signup-pass').value.trim();
    if (!name || !email || !pass) { showToast('Please fill all fields! ⚠️'); return; }
    userName = name;
    showToast('Welcome to HabitFlow, ' + name + '! 🎉');
    goTo('app');
  }

  function doLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    if (!email || !pass) { showToast('Please fill all fields! ⚠️'); return; }
    userName = email.split('@')[0];
    userName = userName.charAt(0).toUpperCase() + userName.slice(1);
    showToast('Welcome back, ' + userName + '! 👋');
    goTo('app');
  }

  function doLogout() {
    userName = '';
    showToast('Logged out successfully! 👋');
    setTimeout(() => goTo('home'), 800);
  }

  // ===== APP INIT =====
  function initApp() {
    document.getElementById('user-name-display').textContent = userName || 'Friend';
    document.getElementById('profile-name-display').textContent = userName || 'Friend';
    buildWeek();
    updateDailyDate();
    animateCircle(83);
    animateProgressBars();
    buildChart();
    updateMealDetailTime();
  }

  // ===== REAL DATE/TIME =====
  function updateDailyDate() {
    const d = new Date();
    const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
    document.getElementById('dailyDate').textContent = 'Today, ' + d.toLocaleDateString('en-US', {day:'numeric', month:'short', year:'numeric'});
  }

  function updateMealDetailTime() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    const mo = String(d.getMonth()+1).padStart(2,'0');
    const yy = String(d.getFullYear()).slice(-2);
    document.getElementById('mealDetailTime').innerHTML = `${hh}:${mm}<br>${dd}.${mo}.${yy}`;
  }

  setInterval(() => {
    updateMealDetailTime();
    updateDailyDate();
  }, 60000);

  // ===== WEEK BAR =====
  function buildWeek() {
    const days = ['M','T','W','T','F','S','S'];
    const today = new Date();
    const todayDay = (today.getDay() + 6) % 7;
    const el = document.getElementById('weekSection');
    el.innerHTML = days.map((d, i) => {
      const diff = i - todayDay;
      const date = new Date(today);
      date.setDate(today.getDate() + diff);
      const isToday = diff === 0;
      return `<div class="week-day ${isToday ? 'today' : ''}" title="${date.toLocaleDateString('en-US',{month:'short',day:'numeric'})}">${d}</div>`;
    }).join('');
  }

  // ===== PROGRESS RING =====
  function animateCircle(target) {
    const circle = document.getElementById('ringFg');
    const numEl = document.getElementById('circleNum');
    const radius = 96;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (target / 100) * circumference;
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
      let count = 0;
      const interval = setInterval(() => {
        count++;
        numEl.textContent = Math.round((count / 60) * target);
        if (count >= 60) clearInterval(interval);
      }, 22);
    }, 400);
  }

  // ===== PROGRESS BARS =====
  function animateProgressBars() {
    setTimeout(() => {
      document.querySelectorAll('.progress-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 300);
  }

  // ===== CHART =====
  function buildChart() {
    const data = [{day:'Mon',pct:70},{day:'Tue',pct:85},{day:'Wed',pct:60},{day:'Thu',pct:90},{day:'Fri',pct:75},{day:'Sat',pct:55},{day:'Sun',pct:83}];
    const el = document.getElementById('chartBars');
    if (!el) return;
    el.innerHTML = data.map(d => `
      <div class="chart-bar-col">
        <div class="chart-bar" style="height:0%" data-h="${d.pct}"></div>
        <div class="chart-bar-label">${d.day}</div>
      </div>`).join('');
    setTimeout(() => {
      el.querySelectorAll('.chart-bar').forEach(b => { b.style.height = b.dataset.h + '%'; });
    }, 400);
  }

  // ===== TABS =====
  function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    const nb = document.getElementById('nav-' + tab);
    if (nb) nb.classList.add('active');
    if (tab === 'analytics') { animateProgressBars(); buildChart(); }
  }

  // ===== MEAL DETAIL =====
  const rainbowColors = [
    {color:'#e74c3c',label:'Red'},{color:'#e67e22',label:'Orange'},
    {color:'#f1c40f',label:'Yellow'},{color:'#27ae60',label:'Green'},
    {color:'#3498db',label:'Blue'},{color:'#bdc3c7',label:'White'}
  ];

  function openMeal(name, icon, foods, img) {
    document.getElementById('mealDetailTitle').textContent = name + ' Details';
    document.getElementById('mealFoodImg').src = img;
    document.getElementById('mealFoodTags').innerHTML = foods.map(f => `<span class="food-tag">${f}</span>`).join('');
    const rr = document.getElementById('rainbowRow');
    rr.innerHTML = '';
    rainbowColors.forEach(c => {
      rr.innerHTML += `<div class="rainbow-item"><div class="rainbow-dot" style="background:${c.color}"></div><div class="rainbow-label">${c.label}</div></div>`;
    });
    updateMealDetailTime();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-meal').classList.add('active');
  }

  // ===== QUICK ADD =====
  function openQuickAdd() {
    document.getElementById('quickAddModal').classList.add('active');
  }

  function closeQuickAdd(e) {
    if (!e || e.target === document.getElementById('quickAddModal')) {
      document.getElementById('quickAddModal').classList.remove('active');
    }
  }

  // ===== CALENDAR =====
  calYear = now.getFullYear();
  calMonth = now.getMonth();

  function openCalendar() {
    renderCalendar();
    document.getElementById('calModal').classList.add('active');
  }

  function closeCalendar(e) {
    if (!e || e.target === document.getElementById('calModal')) {
      document.getElementById('calModal').classList.remove('active');
    }
  }

  function changeMonth(dir) {
    calMonth += dir;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  }

  function renderCalendar() {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('calMonthLabel').textContent = months[calMonth] + ' ' + calYear;
    const grid = document.getElementById('calGrid');
    const dayHeaders = ['Mo','Tu','We','Th','Fr','Sa','Su'];
    let html = dayHeaders.map(d => `<div class="cal-day-head">${d}</div>`).join('');
    const first = new Date(calYear, calMonth, 1).getDay();
    const offset = (first + 6) % 7;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    for (let i = 0; i < offset; i++) html += `<div class="cal-day-cell empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
      html += `<div class="cal-day-cell ${isToday ? 'today-cal' : ''}" onclick="showToast('Selected ${months[calMonth]} ${d}! 📅');closeCalendar()">${d}</div>`;
    }
    grid.innerHTML = html;
  }

  // ===== HABIT TOGGLE =====
  function toggleHabit(el) {
    el.classList.toggle('done');
    showToast(el.classList.contains('done') ? '✅ Habit completed!' : '↩️ Habit unchecked');
  }

  function toggleTodo(el) {
    el.classList.toggle('done');
    const text = el.nextElementSibling;
    text.classList.toggle('done-text');
    showToast(el.classList.contains('done') ? '✅ Task done!' : '↩️ Task undone');
  }

  // ===== TOAST =====
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2600);
  }
