function initialiseCustomerDashboard() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');

  if (mode === 'new') {
    try {
      customerDashboardState.profile.salutation = 'Welcome';
      customerDashboardState.profile.name = '';
      customerDashboardState.profile.subtext =
        'Discover exceptional hospitality. Book your first stay or order delicious cuisine.';
      customerDashboardState.profile.loyaltyBadges = [];

      customerDashboardState.bookings = {
        stats: { activeStay: { value: '—', meta: '' }, upcomingStays: { value: 0, meta: '' }, upgradeRequests: { value: 0, meta: '' } },
        current: null,
        planner: null,
        list: [],
      };

      customerDashboardState.orders = {
        stats: { active: { value: 0, meta: '' }, average: { value: '—', meta: '' } },
        timeline: { title: 'Live order timeline', badge: {}, events: [], actions: [] },
        history: [],
      };

      customerDashboardState.reservations = {
        stats: { week: { value: 0, meta: '' }, holds: { value: 0, meta: '' } },
        highlight: { title: '', badge: {}, events: [] },
        recommendations: { title: '', badge: {}, copy: '', items: [], actions: [] },
        list: [],
      };

      customerDashboardState.payments = {
        outstanding: { amount: '$0.00', meta: '' },
        lastPayment: { amount: '$0.00', meta: 'No recent activity' },
        summary: null,
        methods: { entries: [], actions: [] },
        recent: [],
      };

      customerDashboardState.receipts = { list: [], actions: [] };
    } catch (_) {}
  }

  renderCustomerWelcome(customerDashboardState.profile);
  renderCustomerNavCounts(customerDashboardState);
  renderBookingSummary(customerDashboardState.bookings);
  renderPaymentsSection(customerDashboardState.payments);
  renderReceiptsSection(customerDashboardState.receipts);
  renderReservationsSection(customerDashboardState.reservations);
  renderOrdersSection(customerDashboardState.orders);
  initialiseSupportChannels(customerDashboardState.supportChannels);
  wireCustomerQuickActions();
}
function renderCustomerWelcome(profile) {
  if (!profile) return;
  const welcomeHeading = document.getElementById('welcome');
  if (welcomeHeading) {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'new') {
      welcomeHeading.textContent = 'Welcome';
    } else {
      const greeting = profile.salutation ? `${profile.salutation}, ${profile.name}` : profile.name;
      welcomeHeading.textContent = greeting;
    }
  }

  setElementText('welcome-subtext', profile.subtext || '');

  const badgesContainer = document.getElementById('loyalty-badges');
  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    const badges = Array.isArray(profile.loyaltyBadges) ? profile.loyaltyBadges : [];
    if (!badges.length) {
      const placeholder = document.createElement('span');
      placeholder.className = 'welcome-badge muted';
      placeholder.textContent = 'Update your profile to unlock perks';
      badgesContainer.appendChild(placeholder);
    } else {
      badges.forEach((badge) => {
        const badgeEl = document.createElement('span');
        badgeEl.className = 'welcome-badge';
        badgeEl.textContent = badge.label;
        badgesContainer.appendChild(badgeEl);
      });
    }
  }
}
function renderCustomerNavCounts(state) {
  if (!state) return;
  const navCounts = {
    bookings: state.bookings?.list?.length || 0,
    reservations: Array.isArray(state.reservations?.list) ? state.reservations.list.length : 0,
    payments: state.payments?.recent?.length || 0,
    receipts: state.receipts?.list?.length || 0,
    orders: Array.isArray(state.orders?.history) ? state.orders.history.length : 0,
  };

  Object.entries(navCounts).forEach(([key, value]) => {
    const el = document.getElementById(`nav-count-${key}`);
    if (el) el.textContent = value;
  });
}
function wireCustomerSidebar() {
  const hamburger = document.getElementById('customer-hamburger');
  const sidebar = document.getElementById('sidebar');
  if (!hamburger || !sidebar) return;
  hamburger.addEventListener('click', () => {
    const nowActive = !sidebar.classList.contains('active');
    sidebar.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', nowActive.toString());
    sidebar.setAttribute('aria-hidden', (!nowActive).toString());
  });
}