const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:8000/api/v1' 
  : '/api/v1';
let token = null;
let tasks = [];
let currentFilter = 'all';

// ── UTILS ──
function showToast(msg, type='success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = 'toast', 2800);
}

function setLoading(btn, loading) {
  const span = btn.querySelector('span');
  if (loading) {
    btn._orig = span.textContent;
    span.innerHTML = '<span class="spinner"></span>';
    btn.disabled = true;
  } else {
    span.textContent = btn._orig || span.textContent;
    btn.disabled = false;
  }
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
}

async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (res.status === 204 || res.headers.get('content-length') === '0') return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Erro na requisição');
  return data;
}

// ── AUTH ──
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b,i) => {
    b.classList.toggle('active', (tab==='login'&&i===0)||(tab==='register'&&i===1));
  });
  document.getElementById('tab-login').style.display = tab==='login' ? 'block' : 'none';
  document.getElementById('tab-register').style.display = tab==='register' ? 'block' : 'none';
  document.getElementById('auth-error').style.display = 'none';
}

async function doLogin() {
  const btn = document.getElementById('login-btn');
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const err = document.getElementById('auth-error');
  err.style.display = 'none';
  if (!email || !pass) { err.textContent = 'Preencha todos os campos.'; err.style.display = 'block'; return; }
  setLoading(btn, true);
  try {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', pass);
    const res = await fetch(API + '/auth/login', { method:'POST', body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Credenciais inválidas');
    token = data.access_token;
    await loadUser(email);
  } catch(e) {
    err.textContent = e.message;
    err.style.display = 'block';
  } finally { setLoading(btn, false); }
}

async function doRegister() {
  const btn = document.getElementById('register-btn');
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  const err = document.getElementById('auth-error');
  err.style.display = 'none';
  if (!username || !email || !pass) { err.textContent = 'Preencha todos os campos.'; err.style.display = 'block'; return; }
  setLoading(btn, true);
  try {
    await api('POST', '/users/adiciona', { username, email, password: pass });
    showToast('Conta criada! Fazendo login...', 'success');
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = pass;
    switchTab('login');
    setTimeout(doLogin, 400);
  } catch(e) {
    err.textContent = e.message;
    err.style.display = 'block';
  } finally { setLoading(btn, false); }
}

async function loadUser(emailHint) {
  try {
    const u = await api('GET', '/auth/test-token');
    const name = u.username || emailHint || 'Usuário';
    document.getElementById('user-display').textContent = name;
    document.getElementById('avatar-initials').textContent = name[0].toUpperCase();
    showApp();
  } catch(e) { token = null; }
}

function doLogout() {
  token = null; tasks = [];
  document.getElementById('app-screen').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('login-password').value = '';
  showToast('Até logo!', 'success');
}

function showApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'flex';
  loadTasks();
}

// ── TASKS ──
async function loadTasks() {
  try {
    tasks = await api('GET', '/task/');
    renderTasks();
  } catch(e) {
    document.getElementById('task-list').innerHTML =
      `<div style="color:var(--danger);font-size:12px;padding:1rem;">${e.message}</div>`;
  }
}

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  let filtered = tasks;
  if (currentFilter === 'pending') filtered = tasks.filter(t => !t.status);
  if (currentFilter === 'done') filtered = tasks.filter(t => t.status);

  const label = document.getElementById('task-count-label');
  label.textContent = `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'} · ${tasks.filter(t=>!t.status).length} pendente${tasks.filter(t=>!t.status).length===1?'':'s'}`;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◻</div>
        <div class="empty-title">${currentFilter==='all'?'Nenhuma tarefa':'Nada aqui'}</div>
        <div class="empty-desc">${currentFilter==='all'?'Crie sua primeira tarefa acima.':currentFilter==='pending'?'Tudo concluído!':'Nenhuma tarefa concluída.'}</div>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(t => `
    <div class="task-card ${t.status?'done':''}" data-id="${t.task_id}">
      <div class="checkbox" onclick="toggleTask(event,'${t.task_id}',${t.status})">
        <span class="checkbox-check">✓</span>
      </div>
      <div class="task-body">
        <div class="task-title">${escHtml(t.title)}</div>
        <div class="task-desc">${escHtml(t.description)}</div>
        <div class="task-meta">
          <span class="task-date">${formatDate(t.created_at)}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn" onclick="openEdit(event,'${t.task_id}')" title="Editar">✎</button>
        <button class="icon-btn delete" onclick="deleteTask(event,'${t.task_id}')" title="Excluir">✕</button>
      </div>
    </div>`).join('');
}

function escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toggleForm() {
  const f = document.getElementById('create-form');
  const isOpen = f.classList.contains('visible');
  f.classList.toggle('visible', !isOpen);
  document.getElementById('add-btn-icon').textContent = isOpen ? '+' : '−';
  if (!isOpen) document.getElementById('new-title').focus();
}

async function createTask() {
  const btn = document.getElementById('create-btn');
  const title = document.getElementById('new-title').value.trim();
  const desc = document.getElementById('new-desc').value.trim();
  if (!title || !desc) { showToast('Preencha título e descrição.', 'error'); return; }
  setLoading(btn, true);
  try {
    const t = await api('POST', '/task/create', { title, description: desc, status: false });
    tasks.unshift(t);
    document.getElementById('new-title').value = '';
    document.getElementById('new-desc').value = '';
    toggleForm();
    renderTasks();
    showToast('Tarefa criada!');
  } catch(e) { showToast(e.message, 'error'); }
  finally { setLoading(btn, false); }
}

async function toggleTask(e, id, current) {
  e.stopPropagation();
  try {
    const updated = await api('PUT', `/task/${id}`, { status: !current });
    const idx = tasks.findIndex(t => t.task_id === id);
    if (idx !== -1) tasks[idx] = { ...tasks[idx], ...updated };
    renderTasks();
    showToast(!current ? 'Tarefa concluída!' : 'Tarefa reaberta.');
  } catch(e) { showToast(e.message, 'error'); }
}

async function deleteTask(e, id) {
  e.stopPropagation();
  try {
    await api('DELETE', `/task/${id}`);
    tasks = tasks.filter(t => t.task_id !== id);
    renderTasks();
    showToast('Tarefa removida.', 'success');
  } catch(err) { showToast(err.message, 'error'); }
}

function openEdit(e, id) {
  e.stopPropagation();
  const t = tasks.find(t => t.task_id === id);
  if (!t) return;
  document.getElementById('edit-task-id').value = id;
  document.getElementById('edit-title').value = t.title;
  document.getElementById('edit-desc').value = t.description;
  document.getElementById('edit-status').value = String(t.status);
  document.getElementById('edit-modal').classList.add('visible');
  document.getElementById('edit-title').focus();
}

function closeModal() {
  document.getElementById('edit-modal').classList.remove('visible');
}

async function saveEdit() {
  const btn = document.getElementById('save-btn');
  const id = document.getElementById('edit-task-id').value;
  const title = document.getElementById('edit-title').value.trim();
  const desc = document.getElementById('edit-desc').value.trim();
  const status = document.getElementById('edit-status').value === 'true';
  if (!title || !desc) { showToast('Preencha todos os campos.', 'error'); return; }
  setLoading(btn, true);
  try {
    const updated = await api('PUT', `/task/${id}`, { title, description: desc, status });
    const idx = tasks.findIndex(t => t.task_id === id);
    if (idx !== -1) tasks[idx] = { ...tasks[idx], ...updated };
    closeModal();
    renderTasks();
    showToast('Tarefa atualizada!');
  } catch(e) { showToast(e.message, 'error'); }
  finally { setLoading(btn, false); }
}

// close modal on overlay click
document.getElementById('edit-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('edit-modal')) closeModal();
});

// enter key support
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter' && e.target.id === 'login-password') doLogin();
  if (e.key === 'Enter' && e.target.id === 'reg-password') doRegister();
});
