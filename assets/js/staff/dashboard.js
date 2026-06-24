function renderStaffAssignments(items, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach((item) => {
    const frag = cloneTemplate('staff-assignment-template');
    if (!frag) return;
    const card = frag.querySelector('.assignment-card');
    if (card) {
      const slug = typeof item.role === 'string' ? item.role.toLowerCase().replace(/\s+/g, '') : '';
      card.setAttribute('data-role', slug);
    }
    const roleEl = frag.querySelector('[data-field="role"]');
    if (roleEl) roleEl.textContent = item.role;
    const statusEl = frag.querySelector('[data-field="status"]');
    if (statusEl)
      statusEl.textContent =
        typeof item.status === 'string'
          ? item.status
          : item.status && item.status.label
            ? item.status.label
            : '';
    const titleEl = frag.querySelector('[data-field="title"]');
    if (titleEl) titleEl.textContent = item.title;
    const descEl = frag.querySelector('[data-field="description"]');
    if (descEl) descEl.textContent = item.description;
    const metaList = frag.querySelector('[data-field="meta"]');
    if (metaList) {
      item.meta.forEach((text) => {
        const m = cloneTemplate('staff-assignment-meta-template');
        if (!m) return;
        const li = m.querySelector('li');
        li.textContent = text;
        metaList.appendChild(m);
      });
    }
    const actionsEl = frag.querySelector('[data-field="actions"]');
    if (actionsEl) {
      item.actions.forEach((action) => {
        const a = cloneTemplate('staff-assignment-action-template');
        if (!a) return;
        const btn = a.querySelector('button');
        const label =
          typeof action === 'string' ? action : action && action.label ? action.label : 'Action';
        btn.textContent = label;
        actionsEl.appendChild(a);
      });
    }
    grid.appendChild(frag);
  });
}
function renderStaffActionHub(cards) {
  const grid = document.getElementById('staff-action-grid');
  if (!grid) return;
  grid.innerHTML = '';
  (Array.isArray(cards) ? cards : []).forEach((c) => {
    const cardFrag = cloneTemplate('staff-action-card-template');
    if (!cardFrag) return;
    const card = cardFrag.querySelector('.action-card');
    card.querySelector('[data-field="title"]').textContent = c.title;
    const badge = card.querySelector('[data-field="badge"]');
    if (badge)
      badge.textContent =
        typeof c.badge === 'string' ? c.badge : c.badge && c.badge.label ? c.badge.label : '';
    const formContainer = cardFrag.querySelector('[data-field="form"]');
    const form = document.createElement('form');
    (Array.isArray(c.fields) ? c.fields : []).forEach((f) => {
      const labelFrag = cloneTemplate('staff-action-field-template');
      const label = labelFrag.querySelector('label');
      label.textContent = f.label;
      const inputFrag = cloneTemplate('staff-action-input-template');
      form.appendChild(labelFrag);
      form.appendChild(inputFrag);
    });
    const actions = document.createElement('div');
    const btnEntries = Array.isArray(c.buttons)
      ? c.buttons
      : Array.isArray(c.actions)
        ? c.actions
        : [];
    btnEntries.forEach((b) => {
      const btnFrag = cloneTemplate('staff-action-button-template');
      const btn = btnFrag.querySelector('button');
      const label = typeof b === 'string' ? b : b && b.label ? b.label : 'Action';
      btn.textContent = label;
      if (b && b.intent) attachActionHandler(btn, b.intent);
      actions.appendChild(btnFrag);
    });
    form.appendChild(actions);
    formContainer.appendChild(form);
    grid.appendChild(cardFrag);
  });
}
function wireStaffNavigation() {
  const links = document.querySelectorAll('.sidebar nav a[data-section]');
  const sections = document.querySelectorAll('.content-section');
  const hamburger = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      const nowActive = !sidebar.classList.contains('active');
      sidebar.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', nowActive.toString());
      sidebar.setAttribute('aria-hidden', (!nowActive).toString());
    });
  }
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-section');
      sections.forEach((s) => s.classList.remove('active'));
      const target = document.getElementById(id);
      if (target) target.classList.add('active');
      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      links.forEach((l) => l.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
      if (window.innerWidth <= 992 && sidebar && hamburger) {
        sidebar.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
      }
    });
  });
}
function initialiseStaffDashboard() {
  updateClock();
  setInterval(updateClock, 60000);
  renderStaffAssignments(staffDashboardState.assignments.frontdesk, 'staff-assignments-grid');
  renderRoomManagement(staffDashboardState.rooms);
  renderShiftBookings(staffDashboardState.shiftBookings);
  renderStaffActionHub(staffDashboardState.actionHub || staffDashboardState.actions || []);
  wireStaffNavigation();
}