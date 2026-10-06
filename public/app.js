'use strict';

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const e = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const paths = {modernization:'Website modernization',new_site:'New website',migration:'Migration',focused_improvement:'Focused improvement',research:'Research & exploration'};
  const stages = ['discovery','evidence','scope','design','implementation','qa','review','deployment','maintenance'];
  const labels = {overview:'Overview',projects:'Projects',work:'Work',repositories:'Repositories',context:'Context',review:'Review',connections:'Connections'};
  const iconPaths = {
    overview:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    projects:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 11h18"/>',
    work:'<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M9 11h6M9 15h4"/>',
    repositories:'<path d="M5 3h12a2 2 0 0 1 2 2v16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM3 17h16M8 3v7l3-2 3 2V3"/>',
    context:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    review:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
    connections:'<path d="m8 15-2 2a3 3 0 0 1-4-4l5-5a3 3 0 0 1 4 0m2 8a3 3 0 0 0 4 0l5-5a3 3 0 0 0-4-4l-2 2M8 16l8-8"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',
    bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
    github:'<path d="M9 19c-4 1-4-2-6-2m12 5v-3.5c0-1 .1-1.5-.5-2 3.3-.4 6.5-1.6 6.5-7A5.5 5.5 0 0 0 19.5 6c.2-1 .2-2-.2-3-1.3-.3-3.3 1-4 1.5a14 14 0 0 0-6.6 0C8 4 6 2.7 4.7 3c-.4 1-.4 2-.2 3A5.5 5.5 0 0 0 3 9.5c0 5.4 3.2 6.6 6.5 7-.6.5-.6 1.4-.5 2V22"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    check:'<path d="m5 12 4 4L19 6"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.projects}</svg>`;
  const human = value => String(value || 'Not set').replace(/_/g,' ').replace(/\b\w/g, character => character.toUpperCase());
  const array = value => Array.isArray(value) ? value : [];
  const text = value => typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : String(value ?? '');
  const date = value => { if (!value) return 'Just now'; const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString(undefined,{month:'short',day:'numeric'}); };
  const short = (value, limit = 140) => { const result = text(value); return result.length > limit ? `${result.slice(0,limit)}…` : result; };
  const url = value => { try { const parsed = new URL(value); return ['https:','http:'].includes(parsed.protocol) ? parsed.href : ''; } catch { return ''; } };
  const state = {projects:[],tasks:[],contexts:[],runs:[],events:[],connections:{}};
  const ui = {section:'overview',projectId:'',taskId:'',runId:'',query:'',filterProject:'',repos:null,repoName:'',repoLog:null,repoFile:null,repoError:'',repoBusy:false,loaded:false,error:'',busy:false};
  let toastTimer;
  let repositoryRequest = 0;

  async function api(path, options = {}) {
    const response = await fetch(path,{credentials:'same-origin',...options,headers:{...(options.body ? {'Content-Type':'application/json'} : {}),...options.headers}});
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) throw new Error(response.status === 401 || response.status === 403 ? 'Your workspace session needs verification. Sign in through the configured access page, then refresh.' : 'The workspace returned an unexpected response. Check the private app connection and try again.');
    const result = await response.json();
    if (!response.ok) throw new Error(typeof result.error === 'string' ? result.error : `Request failed (${response.status}).`);
    return result;
  }
  async function refresh(showToast = false) {
    if (ui.busy) return;
    ui.busy = true;
    $('#main').setAttribute('aria-busy','true');
    try {
      const result = await api('/api/state');
      for (const key of ['projects','tasks','contexts','runs','events']) state[key] = array(result[key]);
      state.connections = result.connections || {};
      state.owner = result.owner;
      state.version = result.version;
      ui.loaded = true; ui.error = '';
      if (ui.projectId && !state.projects.some(project => project.id === ui.projectId)) ui.projectId = '';
      render();
      if (showToast) toast('Workspace refreshed.');
    } catch (error) {
      ui.error = error.message;
      if (!ui.loaded) render(); else toast(error.message,true);
    } finally { ui.busy = false; $('#main').setAttribute('aria-busy','false'); }
  }
  function toast(message, error = false) {
    const region = $('#toast-region');
    const item = document.createElement('div');
    item.className = `toast${error ? ' error' : ''}`;
    item.textContent = message;
    region.replaceChildren(item);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => region.replaceChildren(),error ? 9000 : 4500);
  }
  function navigate(section, options = {}) {
    if (!labels[section]) section = 'overview';
    const changed = ui.section !== section;
    ui.section = section;
    if (changed) { ui.query = ''; ui.taskId = ''; }
    if (options.projectId !== undefined) ui.projectId = options.projectId;
    if (options.filterProject !== undefined) ui.filterProject = options.filterProject;
    if (options.taskId !== undefined) ui.taskId = options.taskId;
    if (options.runId !== undefined) ui.runId = options.runId;
    history.replaceState(null,'',`#${section}`);
    closeMenu();
    render();
    $('#main').focus({preventScroll:true});
    if (changed) window.scrollTo({top:0,behavior:'instant'});
    if (section === 'repositories' && ui.repos === null) loadRepos();
  }
  function connection(key) { const raw = state.connections[key]; return typeof raw === 'object' && raw ? raw : {status:raw === true ? 'connected' : typeof raw === 'string' ? raw : 'not_connected'}; }
  function connected(key) { return connection(key).status === 'connected'; }
  function statusBadge(status) {
    const tone = ['connected','accepted','complete','completed'].includes(status) ? 'green' : ['review_ready','review','running','linked'].includes(status) ? 'blue' : ['failed','rejected'].includes(status) ? 'red' : ['queued','revision_requested'].includes(status) ? 'orange' : '';
    const name = {not_connected:'Not connected',unavailable:'Unavailable',review_ready:'Ready for review',draft:'Brief ready'}[status] || human(status);
    return `<span class="badge ${tone}">${e(name)}</span>`;
  }
  function projectById(id) { return state.projects.find(project => project.id === id); }
  function projectName(id) { return projectById(id)?.name || 'Project unavailable'; }
  function taskRuns(id) { return state.runs.filter(run => run.task_id === id); }
  function taskStatus(task) { const runs = taskRuns(task.id); return runs.find(run => run.status === 'running')?.status || runs.find(run => run.status === 'review_ready')?.status || runs.at(-1)?.status || task.status || 'draft'; }
  function scopedContexts(projectId) { return state.contexts.filter(context => context.project_id === projectId); }
  function activeProjectOptions(value = '', all = false) { return `${all ? '<option value="">All projects</option>' : '<option value="">Choose a project</option>'}${state.projects.map(project => `<option value="${e(project.id)}" ${project.id === value ? 'selected' : ''}>${e(project.name)}</option>`).join('')}`; }
  function heading(eyebrow,title,subtitle,actions = '') { return `<div class="page-heading"><div><p class="eyebrow">${e(eyebrow)}</p><h1>${e(title)}</h1><p class="subtitle">${e(subtitle)}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</div>`; }
  function button(label,action,primary = false,extra = '') { return `<button class="button ${primary ? 'button-primary' : 'button-quiet'}" data-action="${e(action)}" ${extra}>${e(label)}</button>`; }
  function empty(title,description,action = '',actionLabel = '',iconName = 'projects',compact = false) { return `<div class="empty-state${compact ? ' compact' : ''}"><div class="empty-icon">${icon(iconName)}</div><h3>${e(title)}</h3><p>${e(description)}</p>${action ? button(actionLabel,action,true) : ''}</div>`; }
  function notice(content,error = false) { return `<div class="notice${error ? ' error' : ''}">${icon('info')}<div>${content}</div></div>`; }
  function projectIcon(project) { if (/amplifier/i.test(project.name)) return 'bolt'; if (/context|memory/i.test(project.name)) return 'context'; return project.path === 'research' ? 'context' : 'globe'; }
  function projectCard(project) {
    const tasks = state.tasks.filter(task => task.project_id === project.id).length;
    const contexts = scopedContexts(project.id).length;
    return `<article class="project-card"><div class="project-card-top"><div class="project-icon">${icon(projectIcon(project))}</div>${statusBadge(project.stage || 'discovery')}</div><h3>${e(project.name)}</h3><p class="project-description">${e(project.description || 'A place for the next idea, its context and the work to bring it to life.')}</p><div class="project-meta"><span>${icon('work')}${tasks} ${tasks === 1 ? 'task' : 'tasks'}</span><span>${icon('context')}${contexts} ${contexts === 1 ? 'note' : 'notes'}</span></div><div class="project-card-bottom"><span class="path-label">${e(paths[project.path] || human(project.path))}</span><button class="button-link" data-action="open-project" data-id="${e(project.id)}">Open project <span aria-hidden="true">↗</span></button></div></article>`;
  }
  function connectionRows() {
    return [['artifacts','Cloudflare Artifacts','repositories'],['amplifier','Amplifier runner','bolt'],['github','GitHub links','github'],['context_intelligence','Context Intelligence','context']].map(([key,label,iconName]) => `<div class="connection-row"><span class="connection-name">${icon(iconName)}${label}</span>${statusBadge(connection(key).status)}</div>`).join('');
  }
  function overview() {
    const reviewCount = state.runs.filter(run => run.status === 'review_ready').length;
    const activeCount = state.runs.filter(run => ['running','queued'].includes(run.status)).length;
    return `${heading('YOUR PRIVATE WORKSPACE','Good work starts here.','A home for your projects, the context behind them, and what comes next.',button('New project','new-project'))}
      <section class="hero" aria-label="Prepare your next task"><div class="hero-copy"><div class="hero-label"><span class="status-dot"></span> FROM INTENT TO ARTIFACT</div><h2>A clear brief. A deliberate next step.</h2><p>Bring the right context to a task. Prepare the work, then choose when to put it in motion.</p><button class="button-link" data-action="new-task">Prepare a work packet <span aria-hidden="true">→</span></button></div><div class="hero-art" aria-hidden="true"><i class="art-line"></i><i class="art-line"></i><i class="art-line"></i><i class="art-dot"></i></div></section>
      <div class="stat-grid">${[[state.projects.length,'Projects','projects'],[activeCount,'Active runs','bolt'],[reviewCount,'Awaiting review','review'],[state.contexts.length,'Context notes','context']].map(([value,label,iconName]) => `<div class="stat-card"><div><p class="stat-label">${label}</p><p class="stat-number">${value.toString().padStart(2,'0')}</p></div><div class="stat-icon">${icon(iconName)}</div></div>`).join('')}</div>
      <section class="project-section"><div class="section-top"><div><h2>Your projects</h2><p class="section-note">Separate spaces. Shared intention.</p></div><button class="button-link" data-action="navigate" data-section="projects">View all projects <span aria-hidden="true">→</span></button></div>${state.projects.length ? `<div class="project-grid">${state.projects.slice(0,3).map(projectCard).join('')}</div>` : empty('Your first project starts here.','Give the work a name and choose a delivery path. Context and tasks stay attached to that project.','new-project','Create a project')}</section>
      <div class="lower-grid"><section class="panel"><div class="panel-heading"><h2>Set work in motion</h2><span class="tiny muted">ONE STEP AT A TIME</span></div><div class="steps">${[[state.projects.length,'Give the work a home','Create a project with a clear delivery path.','new-project'],[state.contexts.length,'Bring the context that matters','Add evidence, decisions or a working hypothesis.','new-context'],[state.tasks.length,'Prepare a focused brief','Define the goal, scope and acceptance criteria.','new-task']].map(([done,title,description,action],index) => `<div class="step"><span class="step-number${done ? ' complete' : ''}">${done ? '✓' : index + 1}</span><div class="step-copy"><strong>${title}</strong><p>${description}</p></div><button class="icon-button" data-action="${action}" aria-label="${title}">↗</button></div>`).join('')}</div></section><section class="panel"><div class="panel-heading"><h2>Workspace signals</h2><button class="button-link" data-action="navigate" data-section="connections">Manage <span aria-hidden="true">↗</span></button></div><div class="connection-list">${connectionRows()}</div><p class="connection-caption">${connected('amplifier') ? 'Runner available. Each task still needs an explicit start.' : 'Prepare briefs and export work packets now. Connect a runner when you’re ready to execute.'}</p></section></div>`;
  }
  function filters(placeholder,projectFilter = true) { return `<div class="filter-bar"><div class="search-field">${icon('search')}<label class="sr-only" for="list-search">${e(placeholder)}</label><input id="list-search" type="search" placeholder="${e(placeholder)}" value="${e(ui.query)}" autocomplete="off"></div>${projectFilter ? `<label class="sr-only" for="project-filter">Filter by project</label><select id="project-filter">${activeProjectOptions(ui.filterProject,true)}</select>` : ''}</div>`; }
  function matches(item,fields) { return !ui.query || fields.some(field => text(item[field]).toLowerCase().includes(ui.query.toLowerCase())); }
  function projectsView() {
    const project = projectById(ui.projectId);
    if (project) return projectDetail(project);
    const projects = state.projects.filter(item => matches(item,['name','description']));
    return `${heading('MAKE ROOM FOR THE WORK','Projects','A dedicated home for each idea, its evidence and its next step.',button('＋ New project','new-project',true))}${filters('Find a project…',false)}<div id="filter-results">${projects.length ? `<div class="project-grid">${projects.map(projectCard).join('')}</div>` : empty(state.projects.length ? 'No projects match.' : 'Make space for your first project.',state.projects.length ? 'Try a different project name or description.' : 'Start with a name, a delivery path and what you want to accomplish.',state.projects.length ? '' : 'new-project','Create a project')}</div>`;
  }
  function projectDetail(project) {
    const tasks = state.tasks.filter(task => task.project_id === project.id);
    const contexts = scopedContexts(project.id);
    const github = url(project.github_url);
    return `<button class="back-button" data-action="all-projects">← All projects</button>${heading(paths[project.path] || 'PROJECT',project.name,project.description || 'Define the work and keep its supporting context close.',button('New task','new-task',true,`data-project="${e(project.id)}"`))}<div class="content-grid"><div><section class="panel"><div class="panel-heading"><h2>Project work</h2><span class="badge">${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}</span></div><div class="panel-body">${tasks.length ? `<div class="task-list">${tasks.map(taskCard).join('')}</div>` : empty('The next step is yours.','Write a focused brief with a goal, acceptance criteria and the context it needs.','new-task','Create a task','work',true)}</div></section><section class="panel subsection"><div class="panel-heading"><h2>Selected context starts here</h2><button class="button-link" data-action="new-context" data-project="${e(project.id)}">Add a note <span aria-hidden="true">＋</span></button></div><div class="panel-body">${contexts.length ? contexts.map(context => `<div class="step"><span class="step-number">${icon('context')}</span><div class="step-copy"><strong>${e(context.title)}</strong><p>${e(human(context.kind))} · ${e(short(context.content,100))}</p></div></div>`).join('') : '<p class="muted tiny">No context notes yet. Add evidence or a decision, then explicitly include it in a task.</p>'}</div></section></div><aside><section class="panel"><div class="panel-heading"><h2>Project details</h2>${statusBadge(project.stage || 'discovery')}</div><div class="panel-body"><form class="stage-form" id="stage-form" data-id="${e(project.id)}"><div class="field"><label for="project-stage">Current stage</label><select id="project-stage" name="stage">${stages.map(stage => `<option value="${stage}" ${project.stage === stage ? 'selected' : ''}>${human(stage)}</option>`).join('')}</select></div><button class="button button-small" type="submit">Save</button></form><p class="field-hint">Stages change only when you explicitly move them.</p><p class="detail-label">GitHub repository</p>${github ? `<a class="text-link" href="${e(github)}" target="_blank" rel="noopener noreferrer">${e(project.github_url)} ↗</a>` : '<p class="tiny muted">No GitHub repository linked.</p>'}<p class="detail-label">Artifacts repository</p><p class="detail-content">${e(project.repo_name || 'No repository linked yet.')}</p>${!project.repo_name ? `<button class="button-link spacer-top" data-action="new-repo" data-project="${e(project.id)}">Create and link a repository →</button>` : ''}<button class="button-link spacer-top" data-action="link-repo" data-project="${e(project.id)}">${project.repo_name ? 'Change repository link' : 'Link an existing repository'} →</button><p class="detail-label">Created</p><p class="tiny muted">${e(date(project.created_at))}</p></div></section><div class="notice spacer-top">${icon('info')}<div>Review records your decision. Accepting a contribution does not merge, deploy or start the next stage.</div></div></aside></div>`;
  }
  function taskCard(task) {
    return `<article class="task-card"><div class="task-card-head"><div><h3>${e(task.title)}</h3><div class="task-subline">${e(projectName(task.project_id))} <span>·</span> ${e(date(task.created_at))}</div></div>${statusBadge(taskStatus(task))}</div><p>${e(short(task.goal,180))}</p><div class="task-card-footer"><div class="meta"><span>${array(task.context_ids).length} context notes</span><span>${array(task.assignments).length} assignments</span></div><div class="inline-actions"><button class="button-link" data-action="download-packet" data-id="${e(task.id)}">Export packet ↓</button><button class="button button-small" data-action="open-task" data-id="${e(task.id)}">Open task <span aria-hidden="true">→</span></button></div></div></article>`;
  }
  function workView() {
    const task = state.tasks.find(item => item.id === ui.taskId);
    if (task) return taskDetail(task);
    const tasks = state.tasks.filter(item => (!ui.filterProject || item.project_id === ui.filterProject) && matches(item,['title','goal','acceptance']));
    return `${heading('BRIEFS BEFORE BUILDS','Work','Bounded tasks, selected context and a clear definition of done.',button('＋ New task','new-task',true))}${!connected('amplifier') ? notice('<strong>Your briefs are ready before your runner is.</strong> Create tasks and download structured work packets. Execution becomes available after an Amplifier runner is connected.') : ''}${filters('Find a task…')}<div id="filter-results">${tasks.length ? `<div class="task-list">${tasks.map(taskCard).join('')}</div>` : empty(state.tasks.length ? 'No tasks match this view.' : 'Turn an intention into a brief.',state.tasks.length ? 'Try another search or choose a different project.' : 'Set the goal, define the boundaries and choose exactly which context the work needs.',state.tasks.length ? '' : 'new-task','Create a task','work')}</div>`;
  }
  function taskDetail(task) {
    const project = projectById(task.project_id);
    const selected = scopedContexts(task.project_id).filter(context => array(task.context_ids).includes(context.id));
    const runs = taskRuns(task.id);
    const queueAllowed = task.status === 'draft' && connected('amplifier') && connected('artifacts') && !!project?.repo_name && !runs.some(run => ['queued','running','review_ready'].includes(run.status));
    const queueReason = task.status !== 'draft' ? 'This brief has already been queued. Create a revised task to start another attempt.' : !project?.repo_name ? 'Link an Artifacts repository to this project before running.' : !connected('artifacts') ? 'Cloudflare Artifacts must be connected before running.' : !connected('amplifier') ? 'Connect an Amplifier runner to execute this task.' : !queueAllowed ? 'This task already has work in progress or awaiting review.' : 'Queue the planned assignments. The runner claims work when available.';
    return `<button class="back-button" data-action="all-tasks">← All work</button>${heading(projectName(task.project_id),task.title,'The brief stays focused. Execution starts only when you choose.',button('↓ Export packet','download-packet',false,`data-id="${e(task.id)}"`))}<div class="content-grid"><section class="panel"><div class="panel-heading"><h2>Task brief</h2>${statusBadge(taskStatus(task))}</div><div class="panel-body"><p class="detail-label">Goal</p><p class="detail-content">${e(task.goal)}</p><p class="detail-label">Acceptance criteria</p><p class="detail-content">${e(task.acceptance || 'No criteria recorded.')}</p><p class="detail-label">Scope & allowed paths</p><p class="detail-content">${e(task.scope || 'No scope recorded.')}</p><p class="detail-label">Planned assignments</p>${array(task.assignments).map((assignment,index) => `<div class="step"><span class="step-number">${index+1}</span><div class="step-copy"><strong>${e(human(assignment.role))}</strong><p>${e(assignment.instruction)}</p></div></div>`).join('') || '<p class="tiny muted">No assignments recorded.</p>'}</div></section><aside><section class="panel"><div class="panel-heading"><h2>Execution</h2><span class="badge">${runs.length} runs</span></div><div class="panel-body"><p class="tiny muted">${e(queueReason)}</p><button class="button button-primary spacer-top" data-action="queue-task" data-id="${e(task.id)}" ${queueAllowed ? '' : 'disabled'}>Queue work</button>${runs.length ? `<div class="subsection">${runs.map(run => `<div class="step"><div class="step-copy"><strong>${e(human(run.role || 'Assignment'))}</strong><p>${e(human(run.status))}</p></div>${run.status === 'review_ready' ? `<button class="button-link" data-action="open-review" data-id="${e(run.id)}">Review →</button>` : ''}</div>`).join('')}</div>` : ''}</div></section><section class="panel subsection"><div class="panel-heading"><h2>Included context</h2><span class="badge">${selected.length} selected</span></div><div class="panel-body">${selected.length ? selected.map(context => `<div class="step"><div class="step-copy"><strong>${e(context.title)}</strong><p>${e(human(context.kind))} · ${e(short(context.content,130))}</p></div></div>`).join('') : '<p class="tiny muted">No context selected for this task.</p>'}<p class="field-hint spacer-top">Only explicitly selected context from this project is included in its work packet.</p></div></section></aside></div>`;
  }
  function contextView() {
    const contexts = state.contexts.filter(item => (!ui.filterProject || item.project_id === ui.filterProject) && matches(item,['title','content','source']));
    return `${heading('THE REASONING BEHIND THE WORK','Context','Evidence, decisions and hypotheses. Included in tasks only when you select them.',button('＋ Add context','new-context',true))}${filters('Find a context note…')}<div id="filter-results">${contexts.length ? `<div class="context-grid">${contexts.map(context => `<article class="context-card"><div class="context-card-top">${statusBadge(context.kind || 'evidence')}<span class="tiny muted">${e(date(context.created_at))}</span></div><h3>${e(context.title)}</h3><p class="detail-content">${e(context.content)}</p>${context.source ? `<p class="context-source">Source: ${url(context.source) ? `<a class="text-link" href="${e(url(context.source))}" target="_blank" rel="noopener noreferrer">${e(context.source)} ↗</a>` : e(context.source)}</p>` : ''}<div class="context-card-bottom"><span>${e(projectName(context.project_id))}</span><button class="button-link" data-action="delete-context" data-id="${e(context.id)}" aria-label="Delete ${e(context.title)}">Delete</button></div></article>`).join('')}</div>` : empty(state.contexts.length ? 'No context matches this view.' : 'Keep the why close to the work.',state.contexts.length ? 'Try another search or choose a different project.' : 'Record a source, a decision or an assumption. Each note belongs to one project.',state.contexts.length ? '' : 'new-context','Add context','context')}</div>`;
  }
  function repositoriesView() {
    const repos = array(ui.repos?.repos || ui.repos);
    const selected = repos.find(repo => repo.name === ui.repoName);
    const error = ui.repoError ? notice(e(ui.repoError),true) : '';
    return `${heading('VERSIONED WORK, REAL HISTORY','Repositories','Browse live Artifacts repositories, inspect commits and read files.',button('＋ New repository','new-repo',true))}${!connected('artifacts') ? notice('<strong>Cloudflare Artifacts is unavailable.</strong> Repository operations need a configured Artifacts binding. Project briefs and context remain available.') : ''}${error}${ui.repos === null && !ui.repoError ? '<div class="loading-state compact"><span class="loader"></span><p>Loading repositories…</p></div>' : repos.length ? `<div class="repo-layout"><div><div class="section-top"><h2>Repositories</h2><button class="button-link" data-action="reload-repos">Refresh</button></div><div class="repo-list">${repos.map(repo => `<button class="repo-button ${selected?.name === repo.name ? 'active' : ''}" data-action="select-repo" data-name="${e(repo.name)}"><strong>${icon('repositories')}${e(repo.name)}</strong><p>${e(short(repo.description || 'Artifacts repository',90))}</p><small>${e(repo.default_branch || 'main')}</small></button>`).join('')}</div>${ui.repos?.cursor ? `<button class="button button-small spacer-top" data-action="more-repos">Load more repositories</button>` : ''}</div><div>${selected ? repoDetail(selected) : empty('Open a repository.','Choose a repository to inspect its history and read its files.','','','repositories')}</div></div>` : empty('No repositories available.',ui.repoError ? 'Resolve the connection error, then refresh the repository list.' : 'Create an Artifacts repository and optionally link it to one of your projects.','reload-repos','Refresh repositories','repositories')}`;
  }
  function repoDetail(repo) {
    return `<section class="panel"><div class="panel-heading"><h2>${e(repo.name)}</h2><span class="badge">${e(repo.default_branch || 'main')}</span></div><div class="panel-body"><form id="file-form" class="file-form" data-name="${e(repo.name)}"><div><label for="repo-ref">Branch or commit</label><input id="repo-ref" name="ref" value="${e(ui.repoFile?.ref || repo.default_branch || 'main')}" required maxlength="200"></div><div><label for="repo-path">File path</label><input id="repo-path" name="path" value="${e(ui.repoFile?.path || 'README.md')}" required maxlength="1000" placeholder="README.md"></div><button type="submit" class="button">Read file</button></form>${ui.repoBusy ? '<p class="loading-inline">Loading repository data…</p>' : ''}${ui.repoFile ? `<p class="detail-label">${e(ui.repoFile.path)} at ${e(ui.repoFile.ref)}</p><pre class="code-view">${e(text(ui.repoFile.content))}</pre>` : '<p class="field-hint spacer-top">Enter a file path and a branch or commit to read the stored version.</p>'}</div></section><section class="panel subsection"><div class="panel-heading"><h2>Commit history</h2><button class="button-link" data-action="repo-log" data-name="${e(repo.name)}">Refresh history</button></div><div class="panel-body">${ui.repoLog === null ? '<p class="tiny muted">Select a repository to load its history.</p>' : array(ui.repoLog.commits || ui.repoLog).length ? `<div class="log-list">${array(ui.repoLog.commits || ui.repoLog).map(commit => `<div class="log-row"><code>${e(short(commit.hash || commit.sha || commit.oid || commit.id || '',8))}</code><div>${e(commit.message || commit.subject || 'Commit')}<small>${e(typeof commit.author === 'object' ? commit.author?.name : commit.author || '')} ${e(date(commit.timestamp || commit.created_at || commit.date))}</small></div></div>`).join('')}</div>` : '<p class="tiny muted">No commits found at this reference.</p>'}</div></section>`;
  }
  function reviewView() {
    const runs = state.runs.filter(run => ['review_ready','accepted','rejected','revision_requested'].includes(run.status));
    const selected = runs.find(run => run.id === ui.runId) || runs.find(run => run.status === 'review_ready') || runs[0];
    return `${heading('HUMAN JUDGMENT, ON PURPOSE','Review','Inspect the returned work and evidence. Record a decision against the exact submitted commit.')}${notice('Acceptance records your decision. It does not merge a branch, deploy a project or initiate another stage.')}${runs.length ? `<div class="review-layout"><div class="review-list">${runs.map(run => { const task = state.tasks.find(item => item.id === run.task_id); return `<button class="review-selector ${selected?.id === run.id ? 'active' : ''}" data-action="select-review" data-id="${e(run.id)}">${statusBadge(run.status)}<h3>${e(task?.title || 'Task contribution')}</h3><p>${e(human(run.role || 'Assignment'))} · ${e(projectName(task?.project_id))}</p><code>${e(short(run.head_commit || 'No head recorded',12))}</code></button>`; }).join('')}</div><div>${reviewDetail(selected)}</div></div>` : empty('Nothing awaiting your review.','Completed runner contributions appear here with their exact commit, reported diff and test evidence.','','','review')}`;
  }
  function reviewDetail(run) {
    const ready = run.status === 'review_ready' && !!run.head_commit;
    return `<section class="panel"><div class="panel-heading"><h2>${e(human(run.role || 'Contribution'))}</h2>${statusBadge(run.status)}</div><div class="panel-body"><p class="detail-label">Runner-reported summary</p><p class="detail-content">${e(text(run.summary) || 'No summary reported.')}</p><div class="review-head">Review applies to this exact head<code>${e(run.head_commit || 'No head commit reported')}</code></div>${run.base_commit ? `<div class="review-head">Base commit<code>${e(run.base_commit)}</code></div>` : ''}<div class="review-evidence"><details open><summary>Runner-reported diff</summary><pre class="code-view">${e(text(run.diff) || 'No diff evidence reported.')}</pre></details><details open><summary>Runner-reported test evidence</summary><pre class="code-view">${e(text(run.tests) || 'No test evidence reported.')}</pre></details></div>${run.review_note ? `<p class="detail-label">Review note</p><p class="detail-content">${e(run.review_note)}</p>` : ''}<p class="field-hint spacer-top">Evidence is provided by the runner. Inspect it before accepting the contribution. Acceptance requires tests.passed to be true.</p></div>${ready ? `<div class="panel-actions"><button class="button button-primary" data-action="review-run" data-id="${e(run.id)}" data-decision="accepted" ${run.tests?.passed === true ? '' : 'disabled title="Passing test evidence is required for acceptance"'}>Accept contribution</button><button class="button" data-action="review-run" data-id="${e(run.id)}" data-decision="revision_requested">Request revision</button><button class="button button-danger" data-action="review-run" data-id="${e(run.id)}" data-decision="rejected">Reject</button></div>` : ''}</section>`;
  }
  function connectionsView() {
    const descriptions = [
      ['artifacts','Cloudflare Artifacts','repositories','Repositories, isolated contributions and versioned history.','Configure the server’s Artifacts binding to enable repository browsing, file reads and run preparation.'],
      ['amplifier','Amplifier runner','bolt','A bounded executor for the tasks you explicitly queue.','Run the outbound bridge in your execution environment with the paired runner secret. Provider credentials stay with the runner.'],
      ['github','GitHub links','github','Keep a reference to each project’s upstream repository.','Add a GitHub repository URL when you create a project. A saved link does not grant API access or push permission.'],
      ['context_intelligence','Context Intelligence','context','Optional external context and memory integration.','No external memory service is connected automatically. Add project context manually and choose its inclusion in each task.']
    ];
    return `${heading('KNOW WHAT IS CONNECTED','Connections','A clear view of the services behind your workspace. No implied access, no silent execution.')}
      <div class="connection-grid">${descriptions.map(([key,name,iconName,description,setup]) => `<section class="connection-card"><div class="connection-card-top"><div class="connection-card-icon">${icon(iconName)}</div>${statusBadge(connection(key).status)}</div><h3>${name}</h3><p>${description}</p>${connection(key).detail ? `<p>${e(connection(key).detail)}</p>` : ''}${connection(key).last_seen ? `<p class="tiny">Last seen ${e(date(connection(key).last_seen))}</p>` : ''}<p class="setup-note">${setup}</p></section>`).join('')}</div><section class="export-panel"><div><h3>Your workspace is portable.</h3><p>Download your projects, briefs, selected context and review records as JSON. Secrets are excluded.</p></div>${button('↓ Export workspace','export-workspace')}</section>`;
  }
  function render() {
    $('#navigation').innerHTML = Object.entries(labels).map(([key,label],index) => `${index === 6 ? '<div class="nav-separator"></div>' : ''}<a class="nav-link ${ui.section === key ? 'active' : ''}" href="#${key}" ${ui.section === key ? 'aria-current="page"' : ''}>${icon(key)}<span>${label}</span>${key === 'review' && state.runs.some(run => run.status === 'review_ready') ? `<span class="nav-count">${state.runs.filter(run => run.status === 'review_ready').length}</span>` : ''}</a>`).join('');
    $('#current-section').textContent = labels[ui.section];
    document.title = `${labels[ui.section]} · Artifacts Studio`;
    $('#workspace-version').textContent = state.version ? `Artifacts Studio · ${state.version}` : 'Private engineering workspace';
    if (!ui.loaded) {
      if (ui.error) $('#main').innerHTML = `<div class="error-page"><p class="eyebrow">WORKSPACE UNAVAILABLE</p><h1>We couldn’t open your workspace.</h1><p>${e(ui.error)}</p>${button('Try again','refresh',true)}</div>`;
      return;
    }
    const views = {overview,projects:projectsView,work:workView,context:contextView,repositories:repositoriesView,review:reviewView,connections:connectionsView};
    $('#main').innerHTML = views[ui.section]();
  }
  function updateFilters() {
    const input = $('#list-search');
    const start = input?.selectionStart;
    const end = input?.selectionEnd;
    render();
    const next = $('#list-search');
    if (next) { next.focus(); if (typeof start === 'number') next.setSelectionRange(start,end); }
  }

  function modal(title,description,form,submitLabel,formId,extra = '') {
    const dialog = $('#form-dialog');
    $('#dialog-content').innerHTML = `<div class="dialog-heading"><div><h2 id="dialog-title">${e(title)}</h2><p>${e(description)}</p></div><button class="icon-button" data-action="close-dialog" aria-label="Close dialog">✕</button></div><form id="${e(formId)}" ${extra}><div class="form-body"><div id="form-error" class="form-error" role="alert" hidden></div>${form}</div><div class="dialog-actions"><button type="button" class="button button-quiet" data-action="close-dialog">Cancel</button><button type="submit" class="button button-primary">${e(submitLabel)}</button></div></form>`;
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => $('input,select,textarea',dialog)?.focus());
  }
  function inputField(name,label,placeholder = '',options = {}) {
    return `<div class="field"><label for="field-${e(name)}">${e(label)}${options.optional ? '<span class="field-optional">optional</span>' : ''}</label><input id="field-${e(name)}" name="${e(name)}" ${options.optional ? '' : 'required'} type="${options.type || 'text'}" placeholder="${e(placeholder)}" maxlength="${options.max || 240}" ${options.pattern ? `pattern="${e(options.pattern)}"` : ''} value="${e(options.value || '')}">${options.hint ? `<p class="field-hint">${e(options.hint)}</p>` : ''}</div>`;
  }
  function textField(name,label,placeholder = '',options = {}) {
    return `<div class="field"><label for="field-${e(name)}">${e(label)}${options.optional ? '<span class="field-optional">optional</span>' : ''}</label><textarea id="field-${e(name)}" name="${e(name)}" ${options.optional ? '' : 'required'} placeholder="${e(placeholder)}" maxlength="${options.max || 12000}" rows="${options.rows || 3}"></textarea>${options.hint ? `<p class="field-hint">${e(options.hint)}</p>` : ''}</div>`;
  }
  function projectField(value = '',optional = false) { return `<div class="field"><label for="field-project_id">Project${optional ? '<span class="field-optional">optional</span>' : ''}</label><select id="field-project_id" name="project_id" ${optional ? '' : 'required'}>${activeProjectOptions(value)}</select></div>`; }
  function suggestedProject(explicit) { return explicit || ui.filterProject || (ui.section === 'projects' ? ui.projectId : '') || (state.projects.length === 1 ? state.projects[0].id : ''); }
  function requireProject() { if (state.projects.length) return true; toast('Create a project first to give this work a home.'); openProjectForm(); return false; }
  function openProjectForm() {
    modal('Create a project','Give the work a home and a clear delivery path.',`${inputField('name','Project name','e.g. Portfolio refresh',{max:100})}${textField('description','What is this project for?','The purpose, the audience and the outcome you have in mind.',{optional:true,max:2000})}<div class="field"><label for="field-path">Delivery path</label><select id="field-path" name="path">${Object.entries(paths).map(([key,value]) => `<option value="${key}">${value}</option>`).join('')}</select></div>${inputField('github_url','GitHub repository URL','https://github.com/owner/repository',{optional:true,type:'url',max:400,hint:'A reference link only. Creating a project does not grant access or push changes.'})}`,'Create project','project-form');
  }
  function openContextForm(projectId) {
    if (!requireProject()) return;
    modal('Add project context','A note stays within this project until you explicitly select it for a task.',`${projectField(suggestedProject(projectId))}${inputField('title','Note title','e.g. Keep the existing CMS',{max:160})}<div class="field"><label for="field-kind">Kind of context</label><select id="field-kind" name="kind"><option value="evidence">Evidence</option><option value="decision">Decision</option><option value="hypothesis">Hypothesis</option></select></div>${textField('content','Context','What does the next task need to know?',{max:24000,rows:4})}${inputField('source','Source','A URL, document title or where this came from',{optional:true,max:1000})}`,'Save context','context-form');
  }
  function contextChecks(projectId) {
    const contexts = scopedContexts(projectId);
    return contexts.length ? contexts.map(context => `<label class="check-row"><input type="checkbox" name="context_ids" value="${e(context.id)}"><span>${e(context.title)}<small>${e(human(context.kind))} · ${e(short(context.content,90))}</small></span></label>`).join('') : `<p class="checklist-empty">${projectId ? 'This project has no context notes yet. You can still prepare a task without them.' : 'Choose a project to see its context notes.'}</p>`;
  }
  function openTaskForm(projectId) {
    if (!requireProject()) return;
    const selected = suggestedProject(projectId);
    modal('Prepare a task','A focused brief you can export now and execute when your runner is ready.',`${projectField(selected)}${inputField('title','Task title','e.g. Audit the homepage accessibility',{max:160})}${textField('goal','Goal','What should change, and why does it matter?',{max:12000})}${textField('acceptance','Acceptance criteria','List the observable outcomes that will make this work complete.',{max:8000})}${textField('scope','Scope & allowed paths','Describe what is in scope, allowed file paths and any constraints.',{max:8000})}<div class="field"><label>Include project context</label><div id="context-checks" class="checklist">${contextChecks(selected)}</div><p class="field-hint">Only checked notes are included. Changing the project clears the selection.</p></div><div class="field"><label>Planned assignments</label><div class="assignment-fields">${inputField('role_1','Role','e.g. builder',{max:60,value:'builder'})}${textField('instruction_1','Assignment','Carry out the task within the stated scope and return a diff plus test evidence.',{max:6000,rows:2})}</div><div class="assignment-fields"><details><summary>Add a second assignment (optional)</summary>${inputField('role_2','Role','e.g. reviewer',{optional:true,max:60})}${textField('instruction_2','Assignment','A separate, bounded contribution toward this task.',{optional:true,max:6000,rows:2})}</details></div><p class="field-hint">Up to two assignments. Saving the brief does not start a run.</p></div>`,'Save task brief','task-form');
  }
  function openRepoForm(projectId) {
    modal('Create a repository','Create an Artifacts repository, with an optional project link.',`${!connected('artifacts') ? notice('Artifacts is currently unavailable. The server must have a working binding before this repository can be created.') : ''}${inputField('name','Repository name','e.g. portfolio-studio',{max:100,pattern:'[a-zA-Z0-9][a-zA-Z0-9._-]*',hint:'Letters, numbers, periods, underscores and hyphens.'})}${textField('description','Description','What will live in this repository?',{optional:true,max:1000})}${projectField(suggestedProject(projectId),true)}`,'Create repository','repo-form');
  }
  function openLinkRepoForm(projectId) {
    const project = projectById(projectId);
    if (!project) return;
    modal('Link an existing repository','The server verifies that this Artifacts repository is accessible.',`${inputField('repo_name','Artifacts repository name','e.g. portfolio-studio',{max:100,pattern:'[a-zA-Z0-9][a-zA-Z0-9._-]*',value:project.repo_name || ''})}<p class="field-hint">This records a repository link for ${e(project.name)}. It does not import GitHub content or start execution.</p>`,'Link repository','link-repo-form',`data-id="${e(projectId)}"`);
  }
  function openReviewForm(id,decision) {
    const run = state.runs.find(item => item.id === id);
    if (!run || run.status !== 'review_ready' || !run.head_commit) return toast('This contribution is no longer ready for review. Refresh the workspace.',true);
    const labels = {accepted:'Accept contribution',revision_requested:'Request revision',rejected:'Reject contribution'};
    modal(labels[decision] || 'Review contribution','Your decision applies only to the submitted head shown below.',`<p class="detail-label">Exact head commit</p><p class="detail-content"><code>${e(run.head_commit)}</code></p><div class="spacer-top">${textField('note','Review note','Record what you checked and the reason for your decision.',{optional:decision === 'accepted',max:6000,rows:4})}</div><p class="field-hint">This records a review decision. It does not merge, deploy or trigger new work.</p>`,labels[decision] || 'Save review','review-form',`data-id="${e(id)}" data-decision="${e(decision)}" data-head="${e(run.head_commit)}"`);
  }
  async function submitForm(form) {
    const fields = new FormData(form);
    const values = Object.fromEntries(fields.entries());
    const submit = $('button[type="submit"]',form);
    const errorEl = $('#form-error',form);
    if (errorEl) errorEl.hidden = true;
    submit.disabled = true;
    const originalLabel = submit.textContent;
    submit.textContent = 'Saving…';
    try {
      let result;
      if (form.id === 'project-form') {
        result = await api('/api/projects',{method:'POST',body:JSON.stringify(values)});
        await refresh(); $('#form-dialog').close(); navigate('projects',{projectId:(result.project || result).id}); toast('Project created.');
      } else if (form.id === 'context-form') {
        await api('/api/contexts',{method:'POST',body:JSON.stringify(values)});
        await refresh(); $('#form-dialog').close(); navigate('context',{filterProject:values.project_id}); toast('Project context saved.');
      } else if (form.id === 'task-form') {
        const assignments = [{role:values.role_1.trim(),instruction:values.instruction_1.trim()}];
        if (values.role_2.trim() || values.instruction_2.trim()) {
          if (!values.role_2.trim() || !values.instruction_2.trim()) throw new Error('The second assignment needs both a role and an instruction.');
          assignments.push({role:values.role_2.trim(),instruction:values.instruction_2.trim()});
        }
        const allowedContexts = new Set(scopedContexts(values.project_id).map(context => context.id));
        const contextIds = fields.getAll('context_ids').filter(id => allowedContexts.has(id));
        if (contextIds.length > 20) throw new Error('Choose at most 20 context notes for a focused task packet.');
        result = await api('/api/tasks',{method:'POST',body:JSON.stringify({project_id:values.project_id,title:values.title,goal:values.goal,acceptance:values.acceptance,scope:values.scope,context_ids:contextIds,assignments})});
        await refresh(); $('#form-dialog').close(); navigate('work',{taskId:(result.task || result).id,filterProject:values.project_id}); toast('Task brief saved. Your work packet is ready to export.');
      } else if (form.id === 'repo-form') {
        const payload = {name:values.name,description:values.description,...(values.project_id ? {project_id:values.project_id} : {})};
        result = await api('/api/repos',{method:'POST',body:JSON.stringify(payload)});
        $('#form-dialog').close(); await refresh(); navigate('repositories'); await loadRepos(); toast('Repository created.');
      } else if (form.id === 'link-repo-form') {
        await api(`/api/projects/${encodeURIComponent(form.dataset.id)}`,{method:'PATCH',body:JSON.stringify({repo_name:values.repo_name})});
        $('#form-dialog').close(); await refresh(); toast('Existing repository linked.');
      } else if (form.id === 'review-form') {
        await api(`/api/runs/${encodeURIComponent(form.dataset.id)}/review`,{method:'POST',body:JSON.stringify({decision:form.dataset.decision,note:values.note,expected_head:form.dataset.head})});
        $('#form-dialog').close(); await refresh(); toast('Review decision recorded.');
      } else if (form.id === 'stage-form') {
        await api(`/api/projects/${encodeURIComponent(form.dataset.id)}`,{method:'PATCH',body:JSON.stringify({stage:values.stage})});
        await refresh(); toast('Project stage updated.');
      } else if (form.id === 'file-form') {
        submit.textContent = 'Reading…';
        const repoName = form.dataset.name;
        const result = await api(`/api/repos/${encodeURIComponent(repoName)}/file?${new URLSearchParams({ref:values.ref,path:values.path})}`);
        if (ui.repoName === repoName) { ui.repoFile = {...result,path:result.path || values.path,ref:result.ref || values.ref}; ui.repoError = ''; render(); }
      } else if (form.id === 'delete-context-form') {
        await api(`/api/contexts/${encodeURIComponent(form.dataset.id)}`,{method:'DELETE'});
        $('#form-dialog').close(); await refresh(); toast('Context note deleted.');
      }
    } catch (error) {
      if (errorEl) { errorEl.textContent = error.message; errorEl.hidden = false; errorEl.scrollIntoView({block:'nearest'}); } else toast(error.message,true);
    } finally { submit.disabled = false; submit.textContent = originalLabel; }
  }
  async function download(path,filename) {
    try {
      const result = await api(path);
      const objectUrl = URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));
      const link = document.createElement('a'); link.href = objectUrl; link.download = filename; document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl),1000);
      toast('Download prepared.');
    } catch (error) { toast(error.message,true); }
  }
  async function loadRepos(append = false) {
    const request = ++repositoryRequest;
    ui.repoError = '';
    try {
      const cursor = append ? ui.repos?.cursor : null;
      const result = await api(`/api/repos${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`);
      if (request !== repositoryRequest) return;
      ui.repos = append ? {...result,repos:[...array(ui.repos?.repos || ui.repos),...array(result.repos)]} : result;
      if (ui.section === 'repositories') render();
    } catch (error) { if (request !== repositoryRequest) return; ui.repoError = error.message; if (ui.section === 'repositories') render(); }
  }
  async function selectRepo(name) {
    ui.repoName = name; ui.repoFile = null; ui.repoLog = null; ui.repoError = ''; ui.repoBusy = true; render();
    await loadRepoLog(name);
  }
  async function loadRepoLog(name) {
    const repo = array(ui.repos?.repos || ui.repos).find(item => item.name === name);
    const ref = $('#repo-ref')?.value || repo?.default_branch || 'main';
    try {
      const result = await api(`/api/repos/${encodeURIComponent(name)}/log?${new URLSearchParams({ref})}`);
      if (ui.repoName === name) { ui.repoLog = result; ui.repoError = ''; }
    } catch (error) { if (ui.repoName === name) ui.repoError = error.message; }
    finally { if (ui.repoName === name) { ui.repoBusy = false; if (ui.section === 'repositories') render(); } }
  }
  async function queueTask(id,element) {
    element.disabled = true;
    try { await api(`/api/tasks/${encodeURIComponent(id)}/queue`,{method:'POST',body:'{}'}); await refresh(); toast('Work queued. The connected runner can now claim the assignments.'); }
    catch (error) { toast(error.message,true); element.disabled = false; }
  }
  function deleteContext(id) {
    const context = state.contexts.find(item => item.id === id);
    if (!context) return;
    const references = state.tasks.filter(task => array(task.context_ids).includes(id)).length;
    modal('Delete context note',context.title,`<p class="detail-content">Delete this project note? ${references ? `It is currently selected by ${references} ${references === 1 ? 'task' : 'tasks'}. The server may prevent deletion while it is referenced.` : 'This action removes the note from your workspace.'}</p>`,'Delete note','delete-context-form',`data-id="${e(id)}"`);
  }
  function closeMenu() { $('#sidebar').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded','false'); $('#menu-toggle').setAttribute('aria-label','Open navigation'); }
  document.addEventListener('click',event => {
    const target = event.target.closest('[data-action]');
    if (!target || target.disabled) return;
    const action = target.dataset.action;
    if (action === 'refresh') { refresh(true); if (ui.section === 'repositories') loadRepos(); }
    else if (action === 'navigate') navigate(target.dataset.section);
    else if (action === 'new-project') openProjectForm();
    else if (action === 'new-context') openContextForm(target.dataset.project);
    else if (action === 'new-task') openTaskForm(target.dataset.project);
    else if (action === 'new-repo') openRepoForm(target.dataset.project);
    else if (action === 'link-repo') openLinkRepoForm(target.dataset.project);
    else if (action === 'close-dialog') $('#form-dialog').close();
    else if (action === 'open-project') navigate('projects',{projectId:target.dataset.id});
    else if (action === 'all-projects') { ui.projectId = ''; render(); }
    else if (action === 'open-task') navigate('work',{taskId:target.dataset.id});
    else if (action === 'all-tasks') { ui.taskId = ''; render(); }
    else if (action === 'download-packet') download(`/api/tasks/${encodeURIComponent(target.dataset.id)}/packet`,`task-packet-${target.dataset.id}.json`);
    else if (action === 'export-workspace') download('/api/export',`artifacts-studio-${new Date().toISOString().slice(0,10)}.json`);
    else if (action === 'queue-task') queueTask(target.dataset.id,target);
    else if (action === 'delete-context') deleteContext(target.dataset.id);
    else if (action === 'reload-repos') loadRepos();
    else if (action === 'more-repos') loadRepos(true);
    else if (action === 'select-repo') selectRepo(target.dataset.name);
    else if (action === 'repo-log') loadRepoLog(target.dataset.name);
    else if (action === 'select-review') { ui.runId = target.dataset.id; render(); }
    else if (action === 'open-review') navigate('review',{runId:target.dataset.id});
    else if (action === 'review-run') openReviewForm(target.dataset.id,target.dataset.decision);
  });
  document.addEventListener('submit',event => {
    if (event.target.matches('#project-form,#context-form,#task-form,#repo-form,#review-form,#stage-form,#file-form,#delete-context-form,#link-repo-form')) { event.preventDefault(); submitForm(event.target); }
  });
  document.addEventListener('input',event => { if (event.target.id === 'list-search') { ui.query = event.target.value; updateFilters(); } });
  document.addEventListener('change',event => {
    if (event.target.id === 'project-filter') { ui.filterProject = event.target.value; render(); }
    if (event.target.id === 'field-project_id' && event.target.closest('#task-form')) $('#context-checks').innerHTML = contextChecks(event.target.value);
  });
  $('#menu-toggle').addEventListener('click',() => { const open = $('#sidebar').classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded',String(open)); $('#menu-toggle').setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); });
  document.addEventListener('click',event => { if ($('#sidebar').classList.contains('open') && !event.target.closest('#sidebar') && !event.target.closest('#menu-toggle')) closeMenu(); });
  document.addEventListener('keydown',event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('hashchange',() => navigate(location.hash.slice(1)));
  ui.section = labels[location.hash.slice(1)] ? location.hash.slice(1) : 'overview';
  refresh().then(() => { if (ui.section === 'repositories' && ui.loaded) loadRepos(); });
})();
