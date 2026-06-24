function renderAdminWelcome(welcome) {
  if (!welcome) return;
  setElementText('admin-welcome-title', welcome.title || '');
  setElementText('admin-welcome-subtitle', welcome.subtitle || '');
}
function renderAdminMetrics(metrics) {
  const container = document.getElementById('admin-metric-cards');
  const template = document.getElementById('admin-metric-template');
  if (!container) return;
  container.innerHTML = '';
  if (!template || !Array.isArray(metrics) || !metrics.length) return;

  metrics.forEach((metric) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    setDomField(clone, '[data-field="title"]', metric.title);
    setDomField(clone, '[data-field="value"]', metric.value);

    const iconEl = clone.querySelector('[data-field="icon"]');
    if (iconEl) {
      iconEl.className = `card-icon ${metric.icon?.className || ''}`.trim();
      iconEl.innerHTML = metric.icon?.html || '';
    }

    const trendEl = clone.querySelector('[data-field="trend"]');
    if (trendEl) {
      trendEl.className = ['card-footer', metric.trend?.tone || ''].filter(Boolean).join(' ');
      trendEl.innerHTML = metric.trend?.icon
        ? `<i class="${metric.trend.icon}"></i> ${metric.trend.text || ''}`
        : metric.trend?.text || '';
    }

    container.appendChild(clone);
  });
}
function renderAdminActivity(activity) {
  const container = document.getElementById('admin-activity-list');
  const template = document.getElementById('admin-activity-template');
  if (!container) return;
  container.innerHTML = '';

  if (!template || !Array.isArray(activity) || !activity.length) {
    const placeholder = document.createElement('div');
    placeholder.className = 'empty-state';
    placeholder.textContent = 'No activity recorded for today.';
    container.appendChild(placeholder);
    return;
  }

  activity.forEach((item) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    const iconEl = clone.querySelector('[data-field="icon"]');
    if (iconEl) iconEl.innerHTML = item.icon || '';
    setDomField(clone, '[data-field="title"]', item.title);
    setDomField(clone, '[data-field="description"]', item.description);
    setDomField(clone, '[data-field="time"]', item.time);
    container.appendChild(clone);
  });
}
function renderAdminBookings(bookings) {
  renderTemplateList(
    'admin-bookings-list',
    'admin-booking-template',
    bookings,
    (clone, booking) => {
      setDomField(clone, '[data-field="guest"]', booking.guest);
      setDomField(clone, '[data-field="meta"]', booking.meta);
      const statusEl = clone.querySelector('[data-field="status"]');
      if (statusEl) {
        statusEl.className = ['booking-status', booking.status?.tone || '']
          .filter(Boolean)
          .join(' ');
        statusEl.textContent = booking.status?.label || '';
      }
    },
    'No bookings yet.'
  );
}
function renderAdminStaff(staff) {
  renderTemplateList(
    'admin-staff-list',
    'admin-staff-template',
    staff,
    (clone, member) => {
      const avatar = clone.querySelector('[data-field="avatar"]');
      if (avatar) {
        avatar.setAttribute('src', member.avatar || '');
        avatar.setAttribute('alt', member.name || 'Staff');
      }
      setDomField(clone, '[data-field="name"]', member.name);
      setDomField(clone, '[data-field="role"]', member.role);
      const statusEl = clone.querySelector('[data-field="status"]');
      if (statusEl) {
        statusEl.className = ['staff-status', member.status === 'away' ? 'away' : '']
          .filter(Boolean)
          .join(' ');
      }
    },
    'No staff members are currently on duty.'
  );
}
function renderAdminFeedback(feedback) {
  renderTemplateList(
    'admin-feedback-list',
    'admin-feedback-template',
    feedback,
    (clone, entry) => {
      setDomField(clone, '[data-field="guest"]', entry.guest);
      const ratingEl = clone.querySelector('[data-field="rating"]');
      if (ratingEl) ratingEl.innerHTML = entry.rating || '';
      setDomField(clone, '[data-field="content"]', entry.content);
      setDomField(clone, '[data-field="date"]', entry.date);
    },
    'No feedback has been recorded.'
  );
}
function renderAdminRoomStatus(rooms) {
  const container = document.getElementById('admin-room-status');
  const template = document.getElementById('admin-room-template');
  if (!container) return;
  container.innerHTML = '';

  if (!template || !Array.isArray(rooms) || !rooms.length) return;

  rooms.forEach((room) => {
    const clone = template.content.firstElementChild.cloneNode(true);
    clone.textContent = room.label || '';
    clone.className = ['room', room.tone || ''].filter(Boolean).join(' ');
    if (room.title) clone.setAttribute('title', `${room.label} · ${room.title}`);
    container.appendChild(clone);
  });
}
function renderAdminLedger(entries) {
  renderTemplateList(
    'admin-ledger-body',
    'admin-ledger-row-template',
    entries,
    (clone, entry) => {
      setDomField(clone, '[data-field="reservation"]', entry.reservation);
      setDomField(clone, '[data-field="guest"]', entry.guest);
      setDomField(clone, '[data-field="accommodation"]', entry.accommodation);
      setDomField(clone, '[data-field="stay"]', entry.stay);
      const statusEl = clone.querySelector('[data-field="status"]');
      if (statusEl) {
        statusEl.innerHTML = entry.status
          ? `<span class="status-pill ${entry.status.tone || ''}"><i class="${entry.status.icon || ''}"></i>${entry.status.label || ''}</span>`
          : '';
      }
      const actionsEl = clone.querySelector('[data-field="actions"]');
      if (actionsEl) {
        const actions = [
          { label: 'Check-in', intent: { fn: 'adminCheckInBooking', args: [entry.reservation] } },
          { label: 'Cancel', intent: { fn: 'adminCancelBooking', args: [entry.reservation] } },
          { label: 'Check-out', intent: { fn: 'adminCheckOutBooking', args: [entry.reservation] } },
        ];
        renderInlineActions(actionsEl, actions);
      }
    },
    null,
    5
  );
}
function renderAdminRoomInventory(rows) {
  renderTemplateList('admin-room-inventory', 'admin-room-row-template', rows, (clone, row) => {
    setDomField(clone, '[data-field="room"]', row.room);
    setDomField(clone, '[data-field="category"]', row.category);
    setDomField(clone, '[data-field="occupancy"]', row.occupancy);
    const guestStatus = clone.querySelector('[data-field="guestStatus"]');
    if (guestStatus) {
      guestStatus.innerHTML = row.guestStatus
        ? `<span class="status-pill ${row.guestStatus.tone || ''}"><i class="${row.guestStatus.icon || ''}"></i>${row.guestStatus.label || ''}</span>`
        : '';
    }
    setDomField(clone, '[data-field="housekeeping"]', row.housekeeping);
    const actionsEl = clone.querySelector('[data-field="actions"]');
    if (actionsEl) {
      const actions = [
        { label: 'Mark clean', intent: { fn: 'adminMarkRoomClean', args: [row.room] } },
        { label: 'Block room', intent: { fn: 'adminBlockRoom', args: [row.room] } },
      ];
      renderInlineActions(actionsEl, actions);
    }
  });
}
function renderAdminGuestDirectory(guests) {
  renderTemplateList(
    'admin-guest-directory',
    'admin-guest-row-template',
    guests,
    (clone, guest) => {
      setDomField(clone, '[data-field="guest"]', guest.guest);
      const tierEl = clone.querySelector('[data-field="tier"]');
      if (tierEl) tierEl.innerHTML = guest.tier || '';
      setDomField(clone, '[data-field="stay"]', guest.stay);
      setDomField(clone, '[data-field="balance"]', guest.balance);
      setDomField(clone, '[data-field="notes"]', guest.notes);
      const actionsEl = clone.querySelector('[data-field="actions"]');
      if (actionsEl) {
        const actions = [
          { label: 'Edit', intent: { fn: 'adminEditGuest', args: [guest.guest] } },
          { label: 'Charge', intent: { fn: 'adminChargeGuest', args: [guest.guest] } },
          { label: 'Message', intent: { fn: 'adminMessageGuest', args: [guest.guest] } },
        ];
        renderInlineActions(actionsEl, actions);
      }
    },
    'No guest profiles to display.'
  );
}
function renderAdminServices(services) {
  renderTemplateCards('admin-services-grid', 'admin-service-template', services);
}
function renderAdminReports(reports) {
  renderTemplateCards('admin-reports-grid', 'admin-report-template', reports);
}
function renderAdminSettings(settings) {
  renderTemplateList(
    'admin-settings-list',
    'admin-setting-template',
    settings,
    (clone, item) => {
      const iconEl = clone.querySelector('[data-field="icon"]');
      if (iconEl) iconEl.className = item.icon || '';
      setDomField(clone, '[data-field="label"]', item.label);
    },
    'No administrative tools configured.'
  );
}
function renderAdminRevenueChart(series) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('admin-revenue-chart');
  if (!canvas) return;

  if (adminRevenueChart) {
    adminRevenueChart.destroy();
  }

  adminRevenueChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: series?.labels || [],
      datasets: [
        {
          label: 'Revenue ($)',
          data: series?.data || [],
          borderColor: '#8B7355',
          backgroundColor: 'rgba(139, 115, 85, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#8B7355',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(44, 62, 80, 0.9)',
          titleFont: { family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
          bodyFont: { family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
          callbacks: {
            label: (context) => `$${Number(context.parsed.y || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            callback: (value) => `$${Number(value || 0).toLocaleString()}`,
          },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}
function updateAdminDate() {
  const dateEl = document.getElementById('currentDate');
  if (!dateEl) return;
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
function wireAdminSidebar() {
  const menuItems = document.querySelectorAll('.sidebar-menu li');
  const linksEls = document.querySelectorAll('.sidebar-menu li a');
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const sections = document.querySelectorAll('section.info-section');
  const content = document.getElementById('dashboard');
  const overviewNodes = content
    ? Array.from(content.children).filter((el) => !el.matches('section.info-section'))
    : [];
  sections.forEach((s) => {
    try { s.removeAttribute('hidden'); } catch (_) {}
  });

  // Default view: show overview, hide detailed sections
  sections.forEach((s) => {
    s.style.display = 'none';
  });
  overviewNodes.forEach((n) => {
    n.style.display = '';
  });

  linksEls.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.slice(1);
        if (targetId === 'dashboard') {
          // Show overview; hide all detailed sections
          sections.forEach((s) => {
            s.style.display = 'none';
          });
          overviewNodes.forEach((n) => {
            n.style.display = '';
          });
        } else {
          // Show only the target section; hide overview
          overviewNodes.forEach((n) => {
            n.style.display = 'none';
          });
          sections.forEach((s) => {
            const isTarget = s.id === targetId;
            s.style.display = isTarget ? 'block' : 'none';
            if (isTarget) {
              try { s.removeAttribute('hidden'); } catch (_) {}
              try { s.scrollIntoView({ behavior: 'instant', block: 'start' }); } catch (_) {}
            }
          });
        }
      }
      menuItems.forEach((i) => i.classList.remove('active'));
      const parentLi = link.closest('li');
      if (parentLi) parentLi.classList.add('active');
      linksEls.forEach((a) => a.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
      if (window.innerWidth <= 992 && sidebar) {
        sidebar.classList.remove('active');
      }
    });
  });

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      const nowActive = !sidebar.classList.contains('active');
      sidebar.classList.toggle('active');
      toggleBtn.setAttribute('aria-expanded', nowActive.toString());
    });
  }
}
function initialiseAdminDashboard() {
  if (!document.body.classList.contains('admin-dashboard')) return;
  renderAdminWelcome(adminDashboardState.welcome);
  renderAdminMetrics(adminDashboardState.metrics);
  renderAdminActivity(adminDashboardState.activity);
  renderAdminBookings(adminDashboardState.bookings);
  renderAdminStaff(adminDashboardState.staff);
  renderAdminFeedback(adminDashboardState.feedback);
  renderAdminRoomStatus(adminDashboardState.roomStatus);
  renderAdminLedger(adminDashboardState.ledger);
  renderAdminRoomInventory(adminDashboardState.roomInventory);
  renderAdminGuestDirectory(adminDashboardState.guests);
  renderAdminServices(adminDashboardState.services);
  renderAdminReports(adminDashboardState.reports);
  renderAdminSettings(adminDashboardState.settings);
  renderAdminRevenueChart(adminDashboardState.revenueSeries);
  wireAdminSidebar();
  updateAdminDate();
  wireAdminControls();
}
function wireAdminControls() {
  const newBookingBtn = document.getElementById('admin-new-booking');
  if (newBookingBtn) newBookingBtn.addEventListener('click', adminCreateBooking);
  const searchBookingBtn = document.getElementById('admin-search-booking');
  if (searchBookingBtn) searchBookingBtn.addEventListener('click', adminSearchBooking);
  const assignRoomBtn = document.getElementById('admin-assign-room');
  if (assignRoomBtn) assignRoomBtn.addEventListener('click', adminAssignRoom);
  const exportRoomsBtn = document.getElementById('admin-export-rooms');
  if (exportRoomsBtn) exportRoomsBtn.addEventListener('click', adminExportRooms);
  const addGuestBtn = document.getElementById('admin-add-guest');
  if (addGuestBtn) addGuestBtn.addEventListener('click', adminAddGuest);
  const searchGuestBtn = document.getElementById('admin-search-guest');
  if (searchGuestBtn) searchGuestBtn.addEventListener('click', adminSearchGuest);
}
function adminCreateBooking() {
  const formHtml = `
    <div style="display:flex; flex-direction:column; gap:15px;">
      <div><label>Guest Full Name</label><input type="text" class="form-input" placeholder="John Doe"></div>
      <div><label>Room Category</label><select class="form-input"><option>Standard</option><option>Deluxe Suite</option></select></div>
      <div style="display:flex; gap:10px;">
        <div style="flex:1"><label>Check-in</label><input type="date" class="form-input"></div>
        <div style="flex:1"><label>Check-out</label><input type="date" class="form-input"></div>
      </div>
    </div>
  `;
  showModal('Create New Booking', formHtml, (closeDialog) => {
    showToast('New booking successfully created.', 'success');
    closeDialog();
  }, 'Create Booking');
}
function adminSearchBooking() {
  const searchHtml = `<input type="text" class="form-input" placeholder="Search by booking ID or Guest Name...">`;
  showModal('Search Bookings', searchHtml, (closeDialog) => {
    showToast('Searching database...', 'info');
    closeDialog();
  }, 'Search');
}
function adminCheckInBooking(reservationId) {
  const rows = document.querySelectorAll('#admin-ledger-body tr');
  rows.forEach((row) => {
    const idCell = row.querySelector('[data-field="reservation"]');
    if (idCell && idCell.textContent === reservationId) {
      const statusCell = row.querySelector('[data-field="status"]');
      if (statusCell) statusCell.innerHTML = '<span class="status-pill pill-confirmed"><i class="fas fa-circle"></i>Checked-in</span>';
    }
  });
}
function adminCancelBooking(reservationId) {
  const rows = document.querySelectorAll('#admin-ledger-body tr');
  rows.forEach((row) => {
    const idCell = row.querySelector('[data-field="reservation"]');
    if (idCell && idCell.textContent === reservationId) {
      const statusCell = row.querySelector('[data-field="status"]');
      if (statusCell) statusCell.innerHTML = '<span class="status-pill pill-cancelled"><i class="fas fa-circle"></i>Cancelled</span>';
    }
  });
}
function adminCheckOutBooking(reservationId) {
  const rows = document.querySelectorAll('#admin-ledger-body tr');
  rows.forEach((row) => {
    const idCell = row.querySelector('[data-field="reservation"]');
    if (idCell && idCell.textContent === reservationId) {
      const statusCell = row.querySelector('[data-field="status"]');
      if (statusCell) statusCell.innerHTML = '<span class="status-pill pill-confirmed"><i class="fas fa-circle"></i>Checked-out</span>';
    }
  });
}
function adminAssignRoom() {
  showModal('Assign Room', '<p>Select an unassigned reservation and a clean/ready room from inventory.</p>', (closeFn) => {
    showToast('Room successfully assigned.', 'success');
    closeFn();
  }, 'Assign');
}
function adminExportRooms() {
  showToast('Exporting Room Inventory to CSV...', 'success');
}
function adminMarkRoomClean(room) {
  const rows = document.querySelectorAll('#admin-room-inventory tr');
  rows.forEach((row) => {
    const roomCell = row.querySelector('[data-field="room"]');
    if (roomCell && roomCell.textContent === room) {
      const hkCell = row.querySelector('[data-field="housekeeping"]');
      if (hkCell) hkCell.textContent = 'Cleaned and ready';
    }
  });
}
function adminBlockRoom(room) {
  const rows = document.querySelectorAll('#admin-room-inventory tr');
  rows.forEach((row) => {
    const roomCell = row.querySelector('[data-field="room"]');
    if (roomCell && roomCell.textContent === room) {
      const statusCell = row.querySelector('[data-field="guestStatus"]');
      if (statusCell) statusCell.innerHTML = '<span class="status-pill pill-cancelled"><i class="fas fa-circle"></i>Out of order</span>';
    }
  });
}
function adminAddGuest() {
  const formHtml = `
    <div style="display:flex; flex-direction:column; gap:15px;">
      <div><label>Guest Name</label><input type="text" class="form-input"></div>
      <div><label>Email Address</label><input type="email" class="form-input"></div>
      <div><label>Phone Number</label><input type="tel" class="form-input"></div>
      <div>
        <label>VIP Tier</label>
        <select class="form-input">
          <option>Standard</option><option>Gold</option><option>Platinum</option><option>Diamond</option>
        </select>
      </div>
    </div>
  `;
  showModal('Register New Guest', formHtml, (closeDialog) => {
    showToast('Guest profile added successfully.', 'success');
    closeDialog();
  }, 'Save Profile');
}
function adminSearchGuest() {
  showModal('Search Guest Directory', '<input type="text" class="form-input" placeholder="Search by name, email, or phone...">', (closeFn) => {
    showToast('Searching guest records...', 'info');
    closeFn();
  }, 'Search');
}
function adminEditGuest(name) {
  showModal(`Edit Profile - ${name}`, '<p>Update the records for ' + name + '</p>', (closeFn) => {
    showToast('Profile updated.', 'success');
    closeFn();
  }, 'Save Changes');
}
function adminChargeGuest(name) {
  const chargeHtml = `
    <div><label>Charge Amount ($)</label><input type="number" class="form-input" placeholder="0.00"></div>
    <div style="margin-top:10px;"><label>Description</label><input type="text" class="form-input" placeholder="e.g. Minibar, Late checkout..."></div>
  `;
  showModal(`Charge Folio - ${name}`, chargeHtml, (closeFn) => {
    showToast(`Charged applied to ${name}'s folio.`, 'success');
    closeFn();
  }, 'Process Charge');
}
function adminMessageGuest(name) {
  const msgHtml = `<textarea class="form-textarea" rows="4" placeholder="Type your message to ${name} here..."></textarea>`;
  showModal(`Message - ${name}`, msgHtml, (closeFn) => {
    showToast('Message sent to guest portal.', 'success');
    closeFn();
  }, 'Send Message');
}