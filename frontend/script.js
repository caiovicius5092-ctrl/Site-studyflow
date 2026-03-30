    window.addEventListener('load', function() {
        // Espera 2 segundos (2000 milissegundos)
        setTimeout(function() {
            const splash = document.getElementById('splash-screen');
            splash.style.opacity = '0'; // Faz o fade out
            setTimeout(() => {
                splash.style.display = 'none'; // Remove do HTML
            }, 500);
        }, 3000);
    });

const SUBJECT_COLORS = {
  'Programação':   { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  'Matemática':    { bg: '#fde8e1', color: '#c2410c', dot: '#e76f51' },
  'Inglês':        { bg: '#d8f3dc', color: '#166534', dot: '#22c55e' },
  'Física':        { bg: '#ede9fc', color: '#5b21b6', dot: '#8b5cf6' },
  'História':      { bg: '#fef3e2', color: '#92400e', dot: '#f59e0b' },
  'Design':        { bg: '#fce7f3', color: '#9d174d', dot: '#ec4899' },
  'Banco de Dados':{ bg: '#e0f2fe', color: '#0369a1', dot: '#0ea5e9' },
  'Outro':         { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' },
};

const PRIORITY_COLORS = {
  alta:  { color: '#dc2626', label: '🔴 Alta' },
  media: { color: '#f59e0b', label: '🟡 Média' },
  baixa: { color: '#22c55e', label: '🟢 Baixa' },
};

const SUGGESTIONS = {
  'Programação': ['Que tal resolver um exercício de lógica hoje?', 'Revise conceitos de POO — é fundamental!', 'Pratique 30 min de código limpo hoje.'],
  'Matemática':  ['Revise derivadas e integrais hoje.', 'Que tal resolver 5 exercícios de álgebra?', 'Revise trigonometria — cai bastante em provas!'],
  'Inglês':      ['Ouça um podcast em inglês hoje!', 'Revise 10 novas palavras de vocabulário.', 'Pratique writing por 15 minutos hoje.'],
  'Física':      ['Revise as leis de Newton hoje.', 'Resolva problemas de termodinâmica!', 'Estude eletromagnetismo — tema importante.'],
  'História':    ['Revise linha do tempo da Segunda Guerra.', 'Leia sobre Revolução Industrial hoje!', 'Faça um resumo do conteúdo desta semana.'],
  'Design':      ['Analise 3 interfaces de apps hoje.', 'Pratique hierarquia tipográfica!', 'Estude teoria das cores — fundamental.'],
  'Banco de Dados': ['Pratique queries SQL complexas hoje.', 'Revise modelagem de dados relacional.', 'Estude índices e otimização de queries.'],
  'Outro':       ['Foque na tarefa mais difícil primeiro!', 'Use a técnica Pomodoro: 25min de foco.', 'Revise o conteúdo da semana passada.'],
};

let tasks = JSON.parse(localStorage.getItem('studyflow-tasks') || '[]');
let currentSubject = 'todas';
let currentStatus = 'todas';

function save() {
  localStorage.setItem('studyflow-tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('task-input');
  const title = input.value.trim();
  if (!title) {
    input.focus();
    input.style.borderColor = '#dc2626';
    setTimeout(() => input.style.borderColor = '', 1000);
    return;
  }

  const task = {
    id: Date.now(),
    title,
    subject: document.getElementById('subject-select').value,
    priority: document.getElementById('priority-select').value,
    done: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  save();
  input.value = '';
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
  render();
});

function toggleDone(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.done = !t.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function setSubjectFilter(subject, btn) {
  currentSubject = subject;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateTitle();
  renderTasks();
}

function setStatusFilter(status, btn) {
  currentStatus = status;
  document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}

function getFiltered() {
  return tasks.filter(t => {
    const matchSub = currentSubject === 'todas' || t.subject === currentSubject;
    const matchStatus = currentStatus === 'todas' || (currentStatus === 'done' ? t.done : !t.done);
    return matchSub && matchStatus;
  });
}

function updateTitle() {
  document.getElementById('main-title').textContent =
    currentSubject === 'todas' ? 'Todas as tarefas' : currentSubject;
}

function updateSuggestion() {
  const pending = tasks.filter(t => !t.done);
  const sugText = document.getElementById('suggestion-text');
  const sugPill = document.getElementById('suggestion-pill');

  if (tasks.length === 0) {
    sugText.textContent = 'Adicione suas tarefas para receber sugestões personalizadas!';
    sugPill.style.display = 'none';
    return;
  }

  if (pending.length === 0) {
    sugText.textContent = '🎉 Incrível! Você concluiu todas as tarefas de hoje!';
    sugPill.style.display = 'none';
    return;
  }

  const subjectCount = {};
  pending.forEach(t => { subjectCount[t.subject] = (subjectCount[t.subject] || 0) + 1; });
  const topSubject = Object.entries(subjectCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (topSubject && SUGGESTIONS[topSubject]) {
    const msgs = SUGGESTIONS[topSubject];
    sugText.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    sugPill.textContent = topSubject;
    sugPill.style.display = 'inline-block';
  }
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById('done-count').textContent = done;
  document.getElementById('total-count').textContent = total;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '% concluído';
}

function updateSubjectFilters() {
  const container = document.getElementById('subject-filters');
  const subjects = ['todas', ...Object.keys(SUBJECT_COLORS)];

  container.innerHTML = '';
  subjects.forEach(s => {
    const count = s === 'todas' ? tasks.length : tasks.filter(t => t.subject === s).length;
    if (s !== 'todas' && count === 0) return;

    const c = SUBJECT_COLORS[s];
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (currentSubject === s ? ' active' : '');
    btn.dataset.subject = s;
    btn.onclick = () => setSubjectFilter(s, btn);
    btn.innerHTML = `
      <span class="filter-dot" style="background:${s === 'todas' ? '#9a9485' : c.dot}"></span>
      ${s === 'todas' ? 'Todas' : s}
      <span class="filter-count">${count}</span>
    `;
    container.appendChild(btn);
  });
}

function renderTasks() {
  const wrap = document.getElementById('tasks-wrap');
  const filtered = getFiltered();
  const pending = filtered.filter(t => !t.done);
  const done = filtered.filter(t => t.done);

  wrap.innerHTML = '';

  if (filtered.length === 0) {
    wrap.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${currentStatus === 'done' ? '✅' : '🎯'}</div>
        <h3>${currentStatus === 'done' ? 'Nenhuma tarefa concluída ainda' : 'Nenhuma tarefa pendente!'}</h3>
        <p>${currentStatus === 'done' ? 'Complete suas tarefas para vê-las aqui.' : 'Você está em dia com os estudos! 🎉'}</p>
      </div>`;
    return;
  }

  function makeCard(t) {
    const card = document.createElement('div');
    card.className = 'task-card' + (t.done ? ' done' : '');
    card.dataset.id = t.id;

    const sc = SUBJECT_COLORS[t.subject] || SUBJECT_COLORS['Outro'];
    const pc = PRIORITY_COLORS[t.priority];

    card.innerHTML = `
      <div class="check-wrap">
        <div class="checkbox ${t.done ? 'checked' : ''}" onclick="checkTask(${t.id}, this)">
          <span class="check-icon">✓</span>
        </div>
      </div>
      <div class="priority-dot" style="background:${pc.color}"></div>
      <div class="task-body">
        <div class="task-title">${t.title}</div>
        <div class="task-tags">
          <span class="tag" style="background:${sc.bg};color:${sc.color}">${t.subject}</span>
          <span class="tag" style="background:#f3f4f6;color:#6b7280">${pc.label}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="action-icon-btn del" title="Excluir" onclick="deleteTask(${t.id})">🗑</button>
      </div>
    `;
    return card;
  }

  if (pending.length > 0) {
    const label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = `Pendentes (${pending.length})`;
    wrap.appendChild(label);
    pending.forEach(t => wrap.appendChild(makeCard(t)));
  }

  if (done.length > 0) {
    const label = document.createElement('div');
    label.className = 'section-label';
    label.style.marginTop = '12px';
    label.textContent = `Concluídas (${done.length})`;
    wrap.appendChild(label);
    done.forEach(t => wrap.appendChild(makeCard(t)));
  }
}

function checkTask(id, el) {
  el.classList.toggle('checked');
  el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 300);
  setTimeout(() => toggleDone(id), 150);
}

function render() {
  updateProgress();
  updateSuggestion();
  updateSubjectFilters();
  renderTasks();
}
