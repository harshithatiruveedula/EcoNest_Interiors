// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('siteNav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

// Simple client-side validation and submission
// Simple config
const BACKEND_URL = 'http://127.0.0.1:5000'; // change if your backend runs elsewhere

// Client-only fallback: store in localStorage and download a CSV row
function saveClientOnly(payload) {
  try {
    const key = 'consultations_local';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const entry = {
      created_at: new Date().toISOString(),
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      date: payload.date || '',
      service: payload.service || ''
    };
    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
    const headers = ['created_at','name','email','phone','date','service'];
    const escape = (v) => {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
    };
    const row = headers.map(h => escape(entry[h])).join(',');
    const csv = headers.join(',') + '\n' + row;
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consultation-entry.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (_err) {
    // ignore
  }
}

const form = document.getElementById('consultForm');
if (form) {
  const showError = (field, message) => {
    const wrapper = field.closest('.form-field');
    if (!wrapper) return;
    wrapper.classList.add('invalid');
    const msg = wrapper.querySelector('.error-message');
    if (msg) msg.textContent = message;
  };
  const clearError = (field) => {
    const wrapper = field.closest('.form-field');
    if (!wrapper) return;
    wrapper.classList.remove('invalid');
    const msg = wrapper.querySelector('.error-message');
    if (msg) msg.textContent = '';
  };

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    // Require at least 10 digits (ignore spaces, +, -). Cap at 15.
    phone: (v) => {
      const digits = (v || '').replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15;
    },
    service: (v) => v && v.trim().length > 0,
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const fields = ['name','email','phone','service'];
    for (const id of fields) {
      const el = document.getElementById(id);
      if (!el) continue;
      const value = el.value || '';
      if (!validators[id](value)) {
        const msg = id === 'phone' ? 'Please enter at least 10 digits.' : 'Please enter the right input.';
        showError(el, msg);
        valid = false;
      } else {
        clearError(el);
      }
    }
    if (!valid) return;
    const payload = {
      name: document.getElementById('name')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      date: document.getElementById('date')?.value || '',
      service: document.getElementById('service')?.value || '',
    };

    fetch(`${BACKEND_URL}/api/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || 'Failed');
        return r.json();
      })
      .then(() => {
        alert('Thank you! Your consultation request has been received.');
        form.reset();
      })
      .catch(() => {
        // Client-only fallback: save locally and download CSV row
        saveClientOnly(payload);
        alert('Backend not reachable. Saved locally and downloaded a CSV with the details.');
      });
  });

  form.querySelectorAll('input, select').forEach((el) => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('blur', () => {
      const id = el.id;
      const value = el.value || '';
      if (validators[id] && !validators[id](value)) {
        const msg = id === 'phone' ? 'Please enter at least 10 digits.' : 'Please enter the right input.';
        showError(el, msg);
      }
    });
  });
}


