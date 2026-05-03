/* ========================================
   MY GALEREY — Main Application Logic
   ======================================== */

// ===== APP STATE =====
const MG_App = {
  currentUser: null,
  currentTheme: localStorage.getItem('mg_theme') || 'black-red',
  currentLang: localStorage.getItem('mg_lang') || 'en',
  currentChat: null,
  isRecording: false,
  mediaRecorder: null,
  audioChunks: [],
  contextTarget: null,

  init() {
    this.loadTheme();
    this.loadUser();
    this.initRipple();
    this.initTooltips();
    MG_applyTranslations();
  },

  loadTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  },

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mg_theme', theme);
    // Update active state in settings
    document.querySelectorAll('.theme-option').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === theme);
    });
    MG_showToast(MG_t('theme_changed'), 'success');
  },

  loadUser() {
    const user = localStorage.getItem('mg_user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  },

  saveUser(user) {
    this.currentUser = user;
    localStorage.setItem('mg_user', JSON.stringify(user));
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  requireAuth(redirectPage = 'login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = redirectPage;
      return false;
    }
    return true;
  },

  // ===== RIPPLE EFFECT =====
  initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn, .nav-btn, .bottom-nav-item');
      if (!btn) return;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  },

  initTooltips() {
    // Simple tooltip system
  },

  // ===== NAVIGATION =====
  navigate(page) {
    window.location.href = page;
  },

  // ===== BOTTOM NAV =====
  setActiveNav(page) {
    const navMap = {
      'home': 0, 'feed': 0,
      'explore': 1, 'search': 1,
      'chat': 2, 'parents-chat': 2, 'classmates-chat': 2,
      'reels': 3,
      'profile': 4, 'edit-profile': 4, 'settings': 4
    };
    const idx = navMap[page];
    if (idx !== undefined) {
      document.querySelectorAll('.bottom-nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === idx);
      });
    }
  },

  // ===== TOAST =====
  showToast(message, type = 'info') {
    MG_showToast(message, type);
  }
};

// ===== GLOBAL TOAST =====
function MG_showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== UTILITY FUNCTIONS =====
function MG_escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function MG_formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MG_formatDate(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return MG_t('today');
  if (d.toDateString() === yesterday.toDateString()) return MG_t('yesterday');
  return d.toLocaleDateString();
}

function MG_formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function MG_getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    pdf: 'fas fa-file-pdf', doc: 'fas fa-file-word', docx: 'fas fa-file-word',
    xls: 'fas fa-file-excel', xlsx: 'fas fa-file-excel',
    ppt: 'fas fa-file-powerpoint', pptx: 'fas fa-file-powerpoint',
    zip: 'fas fa-file-archive', rar: 'fas fa-file-archive',
    mp3: 'fas fa-file-audio', wav: 'fas fa-file-audio',
    mp4: 'fas fa-file-video', avi: 'fas fa-file-video',
    jpg: 'fas fa-file-image', jpeg: 'fas fa-file-image', png: 'fas fa-file-image',
    gif: 'fas fa-file-image', svg: 'fas fa-file-image',
    txt: 'fas fa-file-alt', csv: 'fas fa-file-csv',
    js: 'fas fa-file-code', html: 'fas fa-file-code', css: 'fas fa-file-code'
  };
  return map[ext] || 'fas fa-file';
}

function MG_generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  MG_App.init();
});