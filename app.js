document.head.insertAdjacentHTML('beforeend', '<link rel="manifest" href="./manifest.json"><link rel="icon" href="./assets/721134729_1554145309760098_3243896221636783487_n.jpg" type="image/jpeg"><link rel="apple-touch-icon" href="./assets/721134729_1554145309760098_3243896221636783487_n.jpg">');

if (!window.SNHS_SUPABASE_URL || !window.SNHS_SUPABASE_ANON_KEY) {
  const configRequest = new XMLHttpRequest();
  configRequest.open('GET', 'supabase-config.js', false);
  configRequest.send();
  if (configRequest.status === 200 || configRequest.status === 0) window.eval(configRequest.responseText);
}

const supabaseReady = new Promise((resolve, reject) => {
  if (!window.SNHS_SUPABASE_URL || !window.SNHS_SUPABASE_ANON_KEY) return reject(new Error('Supabase configuration is missing.'));
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = () => resolve(window.supabase.createClient(window.SNHS_SUPABASE_URL, window.SNHS_SUPABASE_ANON_KEY));
  script.onerror = () => reject(new Error('Supabase client could not be loaded.'));
  document.head.append(script);
});

let supabaseClient;
let currentUser;
let profilesForAdmin = [];
const initializeSupabase = async () => {
  supabaseClient = await supabaseReady;
  const session = await supabaseClient.auth.getSession();
  if (session.error) throw session.error;
  currentUser = session.data.session?.user;
  if (!currentUser) {
    const result = await supabaseClient.auth.signInAnonymously();
    if (result.error) throw result.error;
    currentUser = result.data.user;
  }
  return supabaseClient;
};

document.body.innerHTML = document.body.innerHTML.replaceAll('Hiraya', 'SNHS');
document.title = 'SNHS ALUMNI COMMUNITY';
document.querySelector('.welcome .eyebrow').textContent = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
}).format(new Date()).toUpperCase();
const schoolLogo = './assets/721134729_1554145309760098_3243896221636783487_n.jpg';
document.querySelector('.mark').innerHTML = `<img src="${schoolLogo}" alt="Sto. Niño High School logo">`;
document.querySelector('.art').firstChild.textContent = '';
document.querySelector('.art').insertAdjacentHTML('afterbegin', `<img src="${schoolLogo}" alt="Sto. Niño High School logo">`);
const logoStyles = document.createElement('style');
logoStyles.textContent = '.mark img{width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block}.art>img{width:76px;height:76px;object-fit:cover;border-radius:50%;display:block;margin:0 auto 12px}.art{display:flex;flex-direction:column;align-items:center;justify-content:center}';
document.head.append(logoStyles);
const backgroundStyles = document.createElement('style');
backgroundStyles.textContent = 'body{background:radial-gradient(circle at 85% 12%,#df7b6659 0,transparent 26%),radial-gradient(circle at 18% 82%,#2f74a866 0,transparent 31%),linear-gradient(125deg,#101e32 0%,#182e3b 42%,#321d43 100%);background-attachment:fixed}.main{background:rgba(247,250,246,.94);box-shadow:0 0 48px #08121f59;min-height:100vh}';
document.head.append(backgroundStyles);
const sidebarStyles = document.createElement('style');
sidebarStyles.textContent = '.side{transition:transform .25s ease}.side-collapse,.side-reopen{border:0;background:#ffffff18;color:#e7f4ef;width:28px;height:28px;border-radius:50%;font:700 22px/1 "DM Sans";cursor:pointer}.side-collapse{position:absolute;top:17px;right:12px}.side-collapse:hover,.side-reopen:hover{background:#ffffff35}.side.collapsed{transform:translateX(-105%)}.main{transition:margin-left .25s ease,width .25s ease}.main.sidebar-collapsed{margin-left:0;width:100%}.side-reopen{position:fixed;left:12px;top:18px;z-index:6;background:var(--deep);box-shadow:0 4px 14px #08121f59}.side-reopen[hidden]{display:none}@media(max-width:620px){.side-collapse{display:none}.side.collapsed{transform:translateX(-105%)}.main.sidebar-collapsed{margin-left:0;width:100%}}';
document.head.append(sidebarStyles);
document.querySelector('.welcome h1').textContent = 'Welcome';
document.querySelector('#register').textContent = 'Register now!';
document.querySelector('.tabs')?.remove();
document.querySelector('#chatInput').placeholder = 'Write a message...';
document.querySelector('.stats').innerHTML = '<div class="stat registry-total"><span class="label">TOTAL ALUMNI REGISTRY</span><strong>0</strong></div>';

const donationSection = document.createElement('section');
donationSection.className = 'donations';
donationSection.id = 'donations';
donationSection.innerHTML = '<div class="heading"><div><p class="eyebrow">GIVE BACK TO SNHS</p><h2>Support our alumni community</h2></div><div class="donation-total-wrap"><span class="muted">TOTAL DONATIONS</span><strong class="donation-total">₱0</strong></div></div><p class="muted donation-prompt">Choose an amount to record your donation.</p><p class="donation-instructions">Send your donation through GCash or bank transfer. Update these details in the Admin portal.</p><div class="donation-grid"></div><label class="donor-picker-label">View donors<select class="donor-picker"><option value="">Select a donor</option></select></label><p class="donation-status" role="status"></p>';
const donationAmounts = [500, 1000, 2000, 3000, 4000, 5000];
const donationGrid = donationSection.querySelector('.donation-grid');
donationAmounts.forEach(amount => donationGrid.insertAdjacentHTML('beforeend', `<button class="donation-card" type="button" data-amount="${amount}"><span class="donation-symbol">₱</span><strong>₱${amount.toLocaleString()}</strong><small>Donate this amount</small></button>`));
document.querySelector('.content').after(donationSection);
document.querySelector('.nav').insertAdjacentHTML('beforeend', '<a href="#donations">₱ &nbsp; Donations</a>');
const donationDialog = document.createElement('dialog');
donationDialog.innerHTML = '<form method="dialog" class="donation-form"><button type="button" class="donation-dialog-close" aria-label="Close">×</button><p class="eyebrow">RECORD DONATION</p><h3 class="donation-dialog-title"></h3><label>Donor name <span class="muted">(optional)</span><input class="donor-name" type="text" maxlength="120" placeholder="Leave blank for anonymous"></label><label>Donation date<input class="donation-date" type="date" required></label><div class="donation-dialog-actions"><button type="button" class="button donation-dialog-cancel">Cancel</button><button class="button donation-dialog-confirm" type="submit">Confirm donation</button></div></form>';
document.body.append(donationDialog);
const donationDialogStyles = document.createElement('style');
donationDialogStyles.textContent = '.donation-form{width:min(390px,calc(100vw - 36px));padding:26px;background:#fff;color:var(--ink);position:relative;border:0}.donation-form h3{font:700 24px/1.2 "Playfair Display";margin:4px 0 20px}.donation-form label{display:block;margin:14px 0;font-size:11px;font-weight:700}.donation-form input{display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px;border:1px solid var(--line);font:11px "DM Sans"}.donation-dialog-close{position:absolute;right:12px;top:10px;border:0;background:none;color:var(--muted);font-size:22px;cursor:pointer}.donation-dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}.donation-dialog-actions .button{margin:0}.donor-picker-label{display:block;max-width:360px;margin-top:20px;color:var(--muted);font-size:10px;font-weight:700}.donor-picker{display:block;width:100%;margin-top:7px;padding:10px;border:1px solid var(--line);background:#fff;color:var(--ink);font:11px "DM Sans"}.donation-instructions{max-width:680px;margin:12px 0 0;color:var(--muted);font-size:11px;line-height:1.6;white-space:pre-line}';
document.head.append(donationDialogStyles);
const donationForm = donationDialog.querySelector('.donation-form');
const donorPicker = donationSection.querySelector('.donor-picker');
let selectedDonationAmount = 0;
donationGrid.querySelectorAll('.donation-card').forEach(card => card.onclick = () => {
  donationGrid.querySelectorAll('.donation-card').forEach(item => item.classList.remove('selected'));
  card.classList.add('selected');
  selectedDonationAmount = Number(card.dataset.amount);
  donationDialog.querySelector('.donation-dialog-title').textContent = `Record ₱${selectedDonationAmount.toLocaleString()} donation`;
  donationForm.reset();
  donationDialog.querySelector('.donation-date').value = new Date().toISOString().slice(0, 10);
  donationDialog.showModal();
});
donationDialog.querySelector('.donation-dialog-close').onclick = () => donationDialog.close();
donationDialog.querySelector('.donation-dialog-cancel').onclick = () => donationDialog.close();
donationForm.onsubmit = async event => {
    event.preventDefault();
    const confirmButton = donationDialog.querySelector('.donation-dialog-confirm');
    const status = donationSection.querySelector('.donation-status');
    confirmButton.disabled = true;
    confirmButton.textContent = 'Saving...';
    try {
      const supabase = await initializeSupabase();
      const donorName = donationDialog.querySelector('.donor-name').value.trim() || 'Anonymous';
      const donationDate = donationDialog.querySelector('.donation-date').value;
      const { error } = await supabase.from('donations').insert({ user_id: currentUser.id, amount: selectedDonationAmount, donor_name: donorName, donation_date: donationDate });
      if (error) throw error;
      status.textContent = `Thank you. Your ₱${selectedDonationAmount.toLocaleString()} donation was recorded.`;
      await loadDonationTotal(supabase);
      donationDialog.close();
    } catch (error) {
      status.textContent = error.message || 'Donation could not be recorded.';
    } finally {
      confirmButton.disabled = false;
      confirmButton.textContent = 'Confirm donation';
    }
};

const loadDonationTotal = async supabase => {
  const { data, error } = await supabase.from('donations').select('amount,donor_name,donation_date').order('donation_date', { ascending: false });
  if (error) throw error;
  donationSection.querySelector('.donation-total').textContent = `₱${data.reduce((total, donation) => total + donation.amount, 0).toLocaleString()}`;
  donorPicker.innerHTML = '<option value="">Select a donor</option>';
  data.forEach(donation => {
    const option = document.createElement('option');
    option.textContent = `${donation.donor_name?.trim() || 'Anonymous'} - ${new Date(`${donation.donation_date}T00:00:00`).toLocaleDateString()} - ₱${donation.amount.toLocaleString()}`;
    donorPicker.append(option);
  });
};

const updateOnlineCount = count => {
  document.querySelector('.directory .online').innerHTML = `<i></i> ${count} online now`;
  document.querySelector('#chat .online').innerHTML = `<i></i> ${count} online now`;
  document.querySelector('.side-bottom small').textContent = `${count} alumni online now`;
};

const countdown = document.createElement('aside');
countdown.className = 'floating-countdown';
countdown.setAttribute('aria-live', 'polite');
  countdown.innerHTML = '<button class="countdown-close" type="button" aria-label="Hide event countdown">×</button><strong class="countdown-title"></strong><div class="countdown-values"><span><b data-unit="days">00</b><small>days</small></span><span><b data-unit="hours">00</b><small>hours</small></span><span><b data-unit="minutes">00</b><small>min</small></span><span><b data-unit="seconds">00</b><small>sec</small></span></div><p class="countdown-question" style="margin:14px 0 5px;color:#e5f1ed;font-size:10px;line-height:1.35;overflow-wrap:anywhere;"></p><strong class="countdown-confirmed" style="display:block;color:var(--gold);font-size:10px;margin-bottom:8px;">0 confirmed</strong><button class="countdown-rsvp" type="button" style="width:100%;border:1px solid var(--gold);background:var(--gold);color:var(--deep);border-radius:9px;padding:8px 9px;font:700 10px "DM Sans";cursor:pointer;">Confirm attendance</button>';
document.body.append(countdown);
let countdownInterval;
const setCountdown = event => {
  clearInterval(countdownInterval);
  const eventTime = event?.event_date ? new Date(event.event_date).getTime() : NaN;
  if (!event?.event_date || !Number.isFinite(eventTime) || eventTime <= Date.now()) {
    countdown.hidden = true;
    return;
  }
  countdown.hidden = false;
  countdown.querySelector('.countdown-title').textContent = event.title;
  const update = () => {
    const remaining = Math.max(0, eventTime - Date.now());
    const seconds = Math.floor(remaining / 1000);
    const values = { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
    Object.entries(values).forEach(([unit, value]) => { countdown.querySelector(`[data-unit="${unit}"]`).textContent = String(value).padStart(2, '0'); });
    if (!remaining) clearInterval(countdownInterval);
  };
  update();
  countdownInterval = setInterval(update, 1000);
};
const updateCountdownConfirmation = (total, confirmed) => {
  countdown.querySelector('.countdown-confirmed').textContent = `${total} confirmed`;
  const button = countdown.querySelector('.countdown-rsvp');
  button.disabled = false;
  button.classList.toggle('confirmed', confirmed);
  button.style.background = confirmed ? 'transparent' : 'var(--gold)';
  button.style.color = confirmed ? 'var(--gold)' : 'var(--deep)';
  button.textContent = confirmed ? 'Attendance confirmed' : 'Confirm attendance';
};
const loadCountdownConfirmation = async (supabase, event) => {
  const { data, error } = await supabase.from('event_attendees').select('user_id').eq('event_id', event.id);
  if (error) throw error;
  const confirmed = data.some(attendee => attendee.user_id === currentUser.id);
  countdown.querySelector('.countdown-question').textContent = `Pupunta ka ba sa ${event.title}?`;
  updateCountdownConfirmation(data.length, confirmed);
  countdown.querySelector('.countdown-rsvp').onclick = async () => {
    const button = countdown.querySelector('.countdown-rsvp');
    const isConfirmed = button.classList.contains('confirmed');
    button.disabled = true;
    button.textContent = isConfirmed ? 'Cancelling...' : 'Confirming...';
    try {
      const result = isConfirmed
        ? await supabase.from('event_attendees').delete().eq('event_id', event.id).eq('user_id', currentUser.id)
        : await supabase.from('event_attendees').insert({ event_id: event.id, user_id: currentUser.id });
      if (result.error) throw result.error;
      await loadCountdownConfirmation(supabase, event);
    } catch (error) {
      console.error('Countdown RSVP update failed:', error);
      button.disabled = false;
      button.textContent = isConfirmed ? 'Attendance confirmed' : 'Confirm attendance';
      countdown.querySelector('.countdown-question').textContent = error.message || 'Hindi na-update ang confirmation. Subukan muli.';
    }
  };
};
countdown.querySelector('.countdown-close').onclick = () => { countdown.hidden = true; clearInterval(countdownInterval); };
let countdownDragging = false;
let countdownOffsetX = 0;
let countdownOffsetY = 0;
countdown.addEventListener('pointerdown', event => {
  if (event.target.closest('button')) return;
  const bounds = countdown.getBoundingClientRect();
  countdownDragging = true;
  countdownOffsetX = event.clientX - bounds.left;
  countdownOffsetY = event.clientY - bounds.top;
  countdown.style.right = 'auto';
  countdown.style.bottom = 'auto';
  countdown.setPointerCapture?.(event.pointerId);
  countdown.classList.add('dragging');
});
countdown.addEventListener('pointermove', event => {
  if (!countdownDragging) return;
  const left = Math.max(0, Math.min(window.innerWidth - countdown.offsetWidth, event.clientX - countdownOffsetX));
  const top = Math.max(0, Math.min(window.innerHeight - countdown.offsetHeight, event.clientY - countdownOffsetY));
  countdown.style.left = `${left}px`;
  countdown.style.top = `${top}px`;
});
countdown.addEventListener('pointerup', event => {
  countdownDragging = false;
  countdown.releasePointerCapture?.(event.pointerId);
  countdown.classList.remove('dragging');
});
countdown.addEventListener('pointercancel', () => {
  countdownDragging = false;
  countdown.classList.remove('dragging');
});

document.querySelector('.top').insertAdjacentHTML('afterbegin', '<button class="mobile-toggle" aria-label="Open navigation">☰</button>');
const side = document.querySelector('.side');
side.insertAdjacentHTML('afterbegin', '<button class="side-collapse" type="button" aria-label="Hide navigation" title="Hide navigation">‹</button>');
document.body.insertAdjacentHTML('beforeend', '<button class="side-reopen" type="button" aria-label="Show navigation" title="Show navigation">›</button>');
const sideCollapse = side.querySelector('.side-collapse');
const sideReopen = document.querySelector('.side-reopen');
const setSideCollapsed = collapsed => {
  side.classList.toggle('collapsed', collapsed);
  document.querySelector('.main').classList.toggle('sidebar-collapsed', collapsed);
  sideReopen.hidden = !collapsed;
  sideCollapse.setAttribute('aria-label', collapsed ? 'Show navigation' : 'Hide navigation');
  sideCollapse.title = collapsed ? 'Show navigation' : 'Hide navigation';
};
sideCollapse.onclick = () => setSideCollapsed(true);
sideReopen.onclick = () => setSideCollapsed(false);
document.querySelector('.mobile-toggle').onclick = () => {
  if (side.classList.contains('collapsed')) setSideCollapsed(false);
  side.classList.toggle('open');
};
document.querySelectorAll('.nav a').forEach(link => link.onclick = () => side.classList.remove('open'));

const dialog = document.querySelector('dialog');
document.querySelector('#register').onclick = async () => {
  dialog.showModal();
  try {
    const supabase = await initializeSupabase();
    const { data } = await supabase.from('profiles').select('full_name,city,email,batch_year,contact_no').eq('id', currentUser.id).maybeSingle();
    if (!data) return;
    profileInputs[0].value = data.full_name || '';
    profileInputs[1].value = data.city || '';
    profileInputs[2].value = data.email || '';
    document.querySelector('[name="batch_year"]').value = data.batch_year || '';
    document.querySelector('[name="contact_no"]').value = data.contact_no || '';
  } catch (error) {
    console.error('Profile could not be loaded:', error);
  }
};
document.querySelector('.close').onclick = () => dialog.close();
const profileInputs = document.querySelector('#profileForm').querySelectorAll('input');
profileInputs[0].name = 'full_name';
profileInputs[1].name = 'city';
profileInputs[2].type = 'email';
profileInputs[2].name = 'email';
profileInputs[2].placeholder = 'e.g. name@email.com';
const profileLabels = document.querySelector('#profileForm').querySelectorAll('label');
profileLabels[2].firstChild.textContent = 'E-mail';
const batchField = document.createElement('label');
batchField.innerHTML = 'Batch year<input name="batch_year" type="number" min="1900" max="2100" required placeholder="e.g. 2018">';
document.querySelector('#profileForm').querySelector('.button').before(batchField);
document.querySelector('#profileForm').onsubmit = async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const saveButton = form.querySelector('.button');
  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';
  try {
    const supabase = await initializeSupabase();
    const formData = new FormData(form);
    const fullName = formData.get('full_name')?.toString().trim();
    if (!fullName) throw new Error('Please enter your full name.');
    if (!formData.get('privacy_accepted')) throw new Error('Please accept the Data Privacy Act notice.');
    const { error } = await supabase.from('profiles').upsert({ id: currentUser.id, full_name: fullName, city: formData.get('city'), email: formData.get('email'), batch_year: Number(formData.get('batch_year')), contact_no: formData.get('contact_no'), batch: `Class of ${formData.get('batch_year')}`, privacy_accepted: true });
    if (error) throw error;
  } catch (error) {
    saveButton.disabled = false;
    saveButton.textContent = 'Save profile →';
    console.error('Supabase profile save failed:', error);
    alert('Hindi na-save sa Supabase. Tingnan ang Supabase settings at subukan muli.');
    return;
  }
  document.querySelector('#register').textContent = 'Registered';
  document.querySelector('#register').style.background = 'var(--teal)';
  document.querySelector('.profile b').textContent = fullName;
  document.querySelector('.profile small').textContent = `Class of ${formData.get('batch_year')}`;
  dialog.close();
};

const bindRSVPs = async (supabase, events) => {
  const { data: attendance, error } = await supabase.from('event_attendees').select('event_id').eq('user_id', currentUser.id);
  if (error) throw error;
  document.querySelectorAll('.event').forEach(card => {
    const event = events.find(item => item.title === card.querySelector('h3')?.textContent.trim());
    const button = card.querySelector('.rsvp');
    if (!button || !event) return;
    button.dataset.eventId = event.id;
    button.classList.toggle('going', attendance.some(item => item.event_id === event.id));
    button.textContent = button.classList.contains('going') ? 'GOING' : 'RSVP';
    button.onclick = async () => {
      button.disabled = true;
      const going = button.classList.contains('going');
      try {
        const result = going
          ? await supabase.from('event_attendees').delete().eq('event_id', event.id).eq('user_id', currentUser.id)
          : await supabase.from('event_attendees').insert({ event_id: event.id, user_id: currentUser.id });
        if (result.error) throw result.error;
        button.classList.toggle('going', !going);
        button.textContent = button.classList.contains('going') ? 'GOING' : 'RSVP';
      } catch (error) {
        console.error('RSVP update failed:', error);
        alert('Hindi na-update ang RSVP. Subukan muli.');
      } finally {
        button.disabled = false;
      }
    };
  });
};

const appendMessage = message => {
  const element = document.createElement('div');
  element.className = `message${message.user_id === currentUser?.id ? ' own' : ''}`;
  const senderName = message.user_id === currentUser?.id ? 'You' : (profileNames[message.user_id] || 'Alumni');
  const initials = senderName === 'You' ? 'You' : senderName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  element.innerHTML = `<span class="avatar">${initials}</span><div><strong>${senderName} <small>${new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></strong><p></p></div>`;
  element.querySelector('p').textContent = message.body;
  document.querySelector('.messages').append(element);
};
document.querySelector('#chatForm').onsubmit = async event => {
  event.preventDefault();
  const input = document.querySelector('#chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.disabled = true;
  try {
    const supabase = await initializeSupabase();
    const { error } = await supabase.from('messages').insert({ user_id: currentUser.id, body: text, room: 'general' });
    if (error) throw error;
    input.value = '';
  } catch (error) {
    console.error('Supabase message send failed:', error);
    alert('Hindi naipadala ang message. Subukan muli.');
  } finally {
    input.disabled = false;
  }
};

const adminStyles = document.createElement('style');
adminStyles.textContent = '.mobile-toggle{display:none}.admin-login{border:1px solid var(--line);background:#fff;color:var(--teal);padding:8px 10px;border-radius:4px;font:700 10px "DM Sans";cursor:pointer;margin-right:12px}.admin-panel{background:#fff;padding:28px;width:min(430px,calc(100vw - 30px));position:relative}.admin-panel h2{font:700 25px "Playfair Display";margin:0 0 7px}.admin-panel p{color:var(--muted);font-size:11px}.admin-panel label{display:block;font-size:10px;font-weight:700;margin:15px 0}.admin-panel input,.admin-panel textarea{display:block;width:100%;border:1px solid var(--line);padding:10px;margin-top:6px;font:11px "DM Sans"}.admin-password-wrap{position:relative}.admin-password-wrap input{padding-right:38px}.password-toggle{position:absolute;right:8px;bottom:7px;border:0;background:none;color:var(--muted);cursor:pointer;font-size:16px;padding:2px}.admin-panel textarea{min-height:75px;resize:vertical}.admin-panel .button{width:100%;margin-top:8px}.admin-status{font-size:10px;color:var(--teal);margin-top:12px}.admin-close{position:absolute;right:13px;top:9px;border:0;background:none;font-size:21px;color:var(--muted)}.admin-delete{display:block;width:100%;margin-top:8px;padding:10px;border:1px solid var(--line);background:#fff;color:var(--teal);font:700 10px "DM Sans";cursor:pointer}.admin-delete.danger{color:#a33;border-color:#d9aaaa}@media(max-width:620px){.mobile-toggle{display:block;border:0;background:none;color:var(--teal);font-size:21px;padding:4px}.side{display:flex;transform:translateX(-105%);transition:transform .2s;z-index:5;width:235px;box-shadow:8px 0 24px #123f3b33}.side.open{transform:translateX(0)}.top{gap:8px}.top>div:first-child{font-size:0}.top>div:first-child:after{content:"SNHS Alumni";font-size:11px}}';
document.head.append(adminStyles);

const adminDialog = document.createElement('dialog');
adminDialog.innerHTML = '<form class="admin-panel"><button type="button" class="admin-close">×</button><p class="eyebrow">SNHS ALUMNI CONTROL</p><h2>Admin access</h2><p>Enter the current alumni president password.</p><label>Admin password<span class="admin-password-wrap"><input class="admin-password" type="password" required placeholder="Enter admin password" autocomplete="current-password"><button class="password-toggle" type="button" aria-label="Show admin password" title="Show password">◉</button></span></label><button class="button" type="submit">Sign in</button><div class="admin-status"></div></form>';
document.body.append(adminDialog);
document.querySelector('.top').insertAdjacentHTML('beforeend', '<button class="admin-login" type="button">Admin</button>');
document.querySelector('.admin-login').onclick = () => adminDialog.showModal();
adminDialog.querySelector('.admin-close').onclick = () => adminDialog.close();
adminDialog.querySelector('.password-toggle').onclick = event => {
  const password = adminDialog.querySelector('.admin-password');
  const visible = password.type === 'text';
  password.type = visible ? 'password' : 'text';
  event.currentTarget.textContent = visible ? '◉' : '⊙';
  event.currentTarget.setAttribute('aria-label', visible ? 'Show admin password' : 'Hide admin password');
  event.currentTarget.title = visible ? 'Show password' : 'Hide password';
};

const clearAdminData = async (target, status) => {
  const labels = { profiles: 'all alumni profiles', announcements: 'all announcements', events: 'all events and RSVPs', messages: 'all chat messages', all: 'everything except your admin profile' };
  if (!confirm(`Delete ${labels[target]} permanently? This cannot be undone.`)) return;
  status.textContent = 'Deleting...';
  try {
    const { error } = await supabaseClient.rpc('admin_clear_data', { target });
    if (error) throw error;
    if (target === 'profiles' || target === 'all') {
      alumni = [];
      renderAlumni();
      updateOnlineCount(0);
    }
    if (target === 'announcements' || target === 'all') {
      document.querySelector('.story h3').textContent = 'No announcements yet';
      document.querySelector('.story p').textContent = 'The community is just getting started.';
    }
    if (target === 'events' || target === 'all') {
      document.querySelector('.event h3').textContent = 'No events yet';
      document.querySelector('.event p').textContent = 'Check back soon for community events.';
      document.querySelector('.event small').textContent = '';
      setCountdown();
    }
    if (target === 'messages' || target === 'all') document.querySelector('.messages').innerHTML = '<p class="muted">No messages yet.</p>';
    status.textContent = `Deleted ${labels[target]}.`;
  } catch (error) {
    status.textContent = error.message || 'Delete failed.';
  }
};

const deleteMember = async (memberId, status) => {
  if (!memberId) {
    status.textContent = 'Select a member first.';
    return;
  }
  const member = profilesForAdmin.find(profile => profile.id === memberId);
  if (!member || !confirm(`Delete ${member.full_name} permanently?`)) return;
  status.textContent = 'Deleting member...';
  try {
    const { error } = await supabaseClient.rpc('admin_delete_profile', { member_id: memberId });
    if (error) throw error;
    profilesForAdmin = profilesForAdmin.filter(profile => profile.id !== memberId);
    alumni = alumni.filter(person => person[0] !== member.full_name);
    renderAlumni();
    document.querySelector('.registry-total strong').textContent = alumni.length;
    status.textContent = `${member.full_name} was deleted.`;
  } catch (error) {
    status.textContent = error.message || 'Member delete failed.';
  }
};

const renderAdminPanel = (panel) => {
  panel.innerHTML = '<button type="button" class="admin-close">×</button><p class="eyebrow">SNHS ALUMNI CONTROL</p><h2>Admin dashboard</h2><p>Manage one member at a time. Destructive actions are permanent.</p><label>Announcement title<input class="admin-title" value="A new chapter for our alumni community"></label><label>Announcement message<textarea class="admin-message">We are refreshing our shared space for the SNHS community.</textarea></label><button class="button admin-save" type="button">Save announcement</button><label>Donation instructions<textarea class="admin-donation-instructions" placeholder="Example: Send donations to GCash 09XX XXX XXXX under SNHS Alumni Association."></textarea></label><button class="button admin-save-donation" type="button">Save donation instructions</button><hr><h3 class="admin-section-title">Create upcoming event</h3><label>Event title<input class="admin-event-title" required placeholder="e.g. Alumni Homecoming"></label><label>Date and time<input class="admin-event-date" type="datetime-local" required></label><label>Location<input class="admin-event-location" placeholder="e.g. SNHS covered court"></label><label>What should alumni know?<textarea class="admin-event-description" placeholder="Write the event details here..."></textarea></label><button class="button admin-create-event" type="button">Create event</button><hr><label>Remove a specific member<select class="admin-member-select"><option value="">Select a member</option></select></label><button class="admin-delete danger admin-delete-member" type="button">Delete selected member</button><button class="admin-delete" data-target="announcements" type="button">Delete all announcements</button><button class="admin-delete" data-target="events" type="button">Delete all events and RSVPs</button><button class="admin-delete" data-target="messages" type="button">Delete all chat messages</button><div class="admin-status">Signed in as admin</div>';
  const status = panel.querySelector('.admin-status');
  panel.querySelector('.admin-close').onclick = () => adminDialog.close();
  panel.querySelector('.admin-save').insertAdjacentHTML('afterend', '<label>Community quote<textarea class="admin-quote">The roots of education may be bitter, but the fruit is sweet.</textarea></label><label>Quote author<input class="admin-quote-author" value="Aristotle"></label><button class="button admin-save-quote" type="button">Save quote</button>');
  panel.querySelector('.admin-save').onclick = () => {
    document.querySelector('.story h3').textContent = panel.querySelector('.admin-title').value;
    document.querySelector('.story p').textContent = panel.querySelector('.admin-message').value;
    status.textContent = 'Announcement saved locally.';
  };
  panel.querySelector('.admin-donation-instructions').value = donationSection.querySelector('.donation-instructions').textContent;
  panel.querySelector('.admin-save-donation').onclick = async () => {
    const button = panel.querySelector('.admin-save-donation');
    button.disabled = true;
    status.textContent = 'Saving donation instructions...';
    try {
      const value = panel.querySelector('.admin-donation-instructions').value.trim();
      const { error } = await supabaseClient.rpc('admin_update_setting', { setting_key: 'donation_instructions', setting_value: value });
      if (error) throw error;
      donationSection.querySelector('.donation-instructions').textContent = value || 'Donation instructions will be announced soon.';
      status.textContent = 'Donation instructions saved.';
    } catch (error) {
      status.textContent = error.message || 'Donation instructions could not be saved.';
    } finally {
      button.disabled = false;
    }
  };
  panel.querySelector('.admin-save-quote').onclick = () => {
    document.querySelector('.quote p').textContent = `“${panel.querySelector('.admin-quote').value.trim()}”`;
    document.querySelector('.quote small').textContent = `— ${panel.querySelector('.admin-quote-author').value.trim()}`;
    status.textContent = 'Quote saved locally.';
  };
  panel.querySelector('.admin-create-event').onclick = async () => {
    const title = panel.querySelector('.admin-event-title').value.trim();
    const date = panel.querySelector('.admin-event-date').value;
    const location = panel.querySelector('.admin-event-location').value.trim();
    const description = panel.querySelector('.admin-event-description').value.trim();
    if (!title || !date || new Date(date) <= new Date()) {
      status.textContent = 'Enter an event title and a future date.';
      return;
    }
    const button = panel.querySelector('.admin-create-event');
    button.disabled = true;
    status.textContent = 'Creating event...';
    try {
      const { data, error } = await supabaseClient.rpc('admin_create_event', { event_title: title, event_date: new Date(date).toISOString(), event_location: location || null, event_description: description || null });
      if (error) throw error;
      document.querySelector('.event h3').textContent = data.title;
      document.querySelector('.event small').textContent = data.location || 'Details to follow';
      document.querySelector('.event p').textContent = `${new Date(data.event_date).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}${data.description ? ` - ${data.description}` : ''}`;
      setCountdown(data);
      await loadCountdownConfirmation(supabaseClient, data);
      panel.querySelector('.admin-event-title').value = '';
      panel.querySelector('.admin-event-date').value = '';
      panel.querySelector('.admin-event-location').value = '';
      panel.querySelector('.admin-event-description').value = '';
      status.textContent = 'Upcoming event created.';
    } catch (error) {
      status.textContent = error.message || 'Event creation failed.';
    } finally {
      button.disabled = false;
    }
  };
  const memberSelect = panel.querySelector('.admin-member-select');
  profilesForAdmin.forEach(profile => memberSelect.insertAdjacentHTML('beforeend', `<option value="${profile.id}">${profile.full_name}</option>`));
  panel.querySelector('.admin-delete-member').onclick = () => deleteMember(memberSelect.value, status);
  panel.querySelectorAll('.admin-delete[data-target]').forEach(button => button.onclick = () => clearAdminData(button.dataset.target, status));
};

adminDialog.querySelector('form').onsubmit = async event => {
  event.preventDefault();
  const panel = event.currentTarget;
  const status = panel.querySelector('.admin-status');
  status.textContent = 'Signing in...';
  try {
    supabaseClient = await supabaseReady;
    const { error } = await supabaseClient.auth.signInWithPassword({ email: window.SNHS_ADMIN_EMAIL, password: panel.querySelector('.admin-password').value });
    if (error) throw error;
    const { data: { user } } = await supabaseClient.auth.getUser();
    const roleResult = await supabaseClient.from('profiles').select('role').eq('id', user.id).single();
    if (roleResult.error || roleResult.data.role !== 'admin') {
      await supabaseClient.auth.signOut();
      throw new Error('This account is not an admin.');
    }
    currentUser = user;
    renderAdminPanel(panel);
  } catch (error) {
    status.textContent = error.message === 'Invalid login credentials' ? 'Invalid admin password. Use the Supabase user password.' : (error.message || 'Admin sign-in failed.');
  }
};

const communityStyles = document.createElement('style');
communityStyles.textContent = '.floating-countdown{position:fixed;right:18px;bottom:18px;z-index:10;width:232px;padding:16px 17px;background:var(--deep);color:#fff;border:1px solid #ffffff26;border-left:4px solid var(--gold);border-radius:18px;box-shadow:0 12px 30px #123f3b40,0 2px 8px #eabc5830;cursor:grab;touch-action:none;user-select:none}.floating-countdown.dragging{cursor:grabbing;box-shadow:0 16px 36px #123f3b55}.floating-countdown[hidden]{display:none}.countdown-close{position:absolute;right:9px;top:7px;border:0;background:#ffffff12;color:#c1d7d0;font-size:15px;line-height:1;width:23px;height:23px;border-radius:50%;cursor:pointer}.countdown-close:hover{background:#ffffff25}.countdown-title{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow-wrap:anywhere;font:700 16px/1.2 "Playfair Display";margin:0 25px 13px 0;min-height:38px}.countdown-values{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.countdown-values span{display:grid;justify-items:center;padding:7px 2px 6px;background:#ffffff12;border:1px solid #ffffff18;border-radius:11px}.countdown-values b{font:700 16px "DM Sans"}.countdown-values small{color:#b7cec7;font-size:8px;margin-top:3px}.donations{margin-top:64px}.donation-total-wrap{display:grid;justify-items:end;align-content:center}.donation-total-wrap .muted{font-size:8px;letter-spacing:1px}.donation-total{color:var(--coral);font:700 24px "Playfair Display"}.donation-prompt{margin-top:-8px}.donation-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:18px}.donation-card{border:1px solid var(--line);background:#fff;color:var(--ink);padding:17px 10px;text-align:left;cursor:pointer;transition:border-color .2s,transform .2s,box-shadow .2s}.donation-card:hover,.donation-card.selected{border-color:var(--coral);box-shadow:0 5px 14px #df7b6622;transform:translateY(-2px)}.donation-symbol{display:block;color:var(--coral);font:700 16px "Playfair Display"}.donation-card strong{display:block;font:700 21px "Playfair Display";margin-top:5px}.donation-card small{display:block;color:var(--muted);font-size:9px;margin-top:9px}.donation-status{color:var(--teal);min-height:28px;margin:14px 0 0;font-size:11px}.donation-confirm{margin-left:9px;padding:8px 10px}.event{min-width:0}.event>div:last-child{min-width:0}.event h3,.event p,.event small{overflow-wrap:anywhere}.event h3{line-height:1.2;margin-bottom:8px}.event p{line-height:1.45;margin:0 0 5px}.event small{display:block;line-height:1.35}.event .rsvp{display:block;max-width:100%;margin-top:12px;white-space:nowrap}.directory{margin-top:64px}.directory-toolbar{display:flex;gap:9px;flex-wrap:wrap;margin:18px 0}.directory-toolbar input,.directory-toolbar select{border:1px solid var(--line);background:#fff;padding:10px 12px;font:11px "DM Sans";color:var(--ink);min-width:150px}.directory-toolbar input{flex:1}.alumni-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.alumni-card{background:#fff;border:1px solid var(--line);padding:17px}.alumni-card strong,.alumni-card small{display:block}.alumni-card strong{font:700 15px "Playfair Display"}.alumni-card small{color:var(--muted);font-size:10px;margin-top:4px}.alumni-card .interest{color:var(--teal);font-size:9px;margin-top:12px;font-weight:700}@media(max-width:1100px){.donation-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:900px){.alumni-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.floating-countdown{right:12px;bottom:12px;width:205px;padding:13px;border-radius:16px}.donations{margin-top:42px}.donation-total-wrap{justify-items:start;margin-top:10px}.donation-grid{grid-template-columns:repeat(2,1fr)}.directory{margin-top:42px}.alumni-grid{grid-template-columns:1fr 1fr}.directory-toolbar input,.directory-toolbar select{min-width:0;width:100%}.event{grid-template-columns:50px minmax(0,1fr);gap:12px}.event .rsvp{width:100%}}';
document.head.append(communityStyles);
const directory = document.createElement('section');
directory.className = 'directory';
directory.id = 'directory';
directory.innerHTML = '<div class="heading"><div><p class="eyebrow">FIND YOUR PEOPLE</p><h2>Alumni directory</h2></div><span class="online"><i></i> 2,846 alumni</span></div><div class="directory-toolbar"><input id="alumniSearch" type="search" placeholder="Search name or profession"><select id="batchFilter"><option value="">All batches</option><option>Class of 2018</option><option>Class of 2005</option><option>Class of 1998</option></select><select id="cityFilter"><option value="">All cities</option><option>Manila</option><option>Cebu</option><option>Davao</option></select></div><div class="alumni-grid"></div>';
document.querySelector('.content').after(directory);
document.querySelector('.nav').insertAdjacentHTML('beforeend', '<a href="#directory">◎ &nbsp; Alumni directory</a>');

let alumni = [];
let profileNames = {};
const alumniGrid = document.querySelector('.alumni-grid');
const renderAlumni = () => {
  const search = document.querySelector('#alumniSearch').value.toLowerCase();
  const batch = document.querySelector('#batchFilter').value;
  const city = document.querySelector('#cityFilter').value;
  alumniGrid.innerHTML = alumni.filter(person => `${person[0]} ${person[3]}`.toLowerCase().includes(search) && (!batch || person[1] === batch) && (!city || person[2] === city)).map(person => `<article class="alumni-card"><strong>${person[0]}</strong><small>${person[1]} • ${person[2]}</small><span class="interest">${person[3]}</span></article>`).join('') || '<p class="muted">No alumni found.</p>';
};
document.querySelectorAll('#alumniSearch,#batchFilter,#cityFilter').forEach(input => input.addEventListener('input', renderAlumni));
renderAlumni();

const professionField = document.createElement('label');
professionField.innerHTML = 'Contact no.<input name="contact_no" type="tel" required placeholder="e.g. 09XX XXX XXXX">';
document.querySelector('#profileForm').querySelector('.button').before(professionField);
const privacyField = document.createElement('label');
privacyField.innerHTML = '<input name="privacy_accepted" type="checkbox" required> I agree to the Data Privacy Act notice.';
privacyField.style.display = 'flex';
privacyField.style.alignItems = 'center';
privacyField.style.gap = '8px';
document.querySelector('#profileForm').querySelector('.button').before(privacyField);

const loadSupabaseData = async () => {
  try {
    const supabase = await initializeSupabase();
    const [profilesResult, announcementsResult, eventsResult, messagesResult, settingsResult] = await Promise.all([
      supabase.from('profiles').select('id,full_name,batch,batch_year,city,profession').order('created_at', { ascending: false }),
      supabase.from('announcements').select('title,message').order('created_at', { ascending: false }).limit(1),
      supabase.from('events').select('id,title,event_date,location,description').gte('event_date', new Date().toISOString()).order('event_date', { ascending: true }),
      supabase.from('messages').select('id,user_id,body,created_at').eq('room', 'general').order('created_at', { ascending: true }).limit(50),
      supabase.from('site_settings').select('key,value').eq('key', 'donation_instructions').maybeSingle()
    ]);
    if (profilesResult.error) throw profilesResult.error;
    profilesForAdmin = profilesResult.data;
    profileNames = Object.fromEntries(profilesResult.data.map(profile => [profile.id, profile.full_name]));
    await loadDonationTotal(supabase);
    if (!settingsResult.error && settingsResult.data?.value) document.querySelector('.donation-instructions').textContent = settingsResult.data.value;
    alumni = profilesResult.data.map(profile => [profile.full_name, profile.batch_year ? `Batch ${profile.batch_year}` : (profile.batch || 'Alumni'), profile.city || 'Location not set', profile.profession || 'Community member', profile.full_name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()]);
    renderAlumni();
    updateOnlineCount(0);
    document.querySelector('.registry-total strong').textContent = alumni.length;
      const latestProfile = profilesResult.data.find(profile => profile.id === currentUser.id);
      if (latestProfile) {
        document.querySelector('.profile b').textContent = latestProfile.full_name;
        document.querySelector('.profile small').textContent = latestProfile.batch || 'Alumni member';
    }
    if (!announcementsResult.error && announcementsResult.data.length) {
      document.querySelector('.story h3').textContent = announcementsResult.data[0].title;
      document.querySelector('.story p').textContent = announcementsResult.data[0].message;
    } else {
      document.querySelector('.story h3').textContent = 'No announcements yet';
      document.querySelector('.story p').textContent = 'The community is just getting started.';
      document.querySelector('.minis').innerHTML = '<p class="muted">No announcements yet.</p>';
    }
    if (!eventsResult.error && eventsResult.data.length) {
      const event = eventsResult.data[0];
      document.querySelector('.event h3').textContent = event.title;
      document.querySelector('.event small').textContent = event.location || 'Details to follow';
      document.querySelector('.event p').textContent = `${new Date(event.event_date).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}${event.description ? ` - ${event.description}` : ''}`;
      setCountdown(event);
      await loadCountdownConfirmation(supabase, event);
      await bindRSVPs(supabase, eventsResult.data);
    } else {
      document.querySelector('.event h3').textContent = 'No events yet';
      document.querySelector('.event p').textContent = 'Check back soon for community events.';
      document.querySelector('.event small').textContent = '';
      setCountdown();
    }
    if (!messagesResult.error && messagesResult.data.length) { document.querySelector('.messages').innerHTML = ''; messagesResult.data.forEach(appendMessage); }
    const presenceChannel = supabase.channel('community-presence', { config: { presence: { key: currentUser.id } } });
    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState();
      updateOnlineCount(Object.keys(state).length);
    }).subscribe(async status => {
      if (status === 'SUBSCRIBED') await presenceChannel.track({ user_id: currentUser.id });
    });
    supabase.channel('community-data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => loadDonationTotal(supabase))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'room=eq.general' }, payload => appendMessage(payload.new))
      .subscribe();
  } catch (error) { console.error('Supabase data loading failed:', error); }
};
loadSupabaseData();
