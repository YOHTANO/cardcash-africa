/**
 * CardCash Africa - Main Application Script
 * Handles screen navigation, form interactions, and UI state management
 */

// ========================================
// SCREEN NAVIGATION
// ========================================

/**
 * Navigate to a specific screen
 * @param {string} screenId - The ID of the screen to navigate to
 */
function goToScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) {
    console.warn(`Screen with ID "${screenId}" not found`);
    return;
  }

  screens.forEach((screen) => {
    screen.classList.remove('active');
  });

  targetScreen.classList.add('active');
}

/**
 * Initialize screen navigation via data-screen attributes
 */
function initScreenNavigation() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-screen]');
    if (button) {
      const screenId = button.getAttribute('data-screen');
      goToScreen(screenId);
    }
  });
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds (default: 2500)
 */
function showToast(message = '3 notifications non lues', duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ========================================
// AMOUNT SELECTION
// ========================================

/**
 * Initialize amount chip selection
 */
function initAmountSelection() {
  const amountChips = document.querySelectorAll('.amount-chip');

  amountChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      // Remove active class from all chips
      amountChips.forEach((c) => c.classList.remove('active'));
      // Add active class to clicked chip
      chip.classList.add('active');
    });
  });
}

// ========================================
// METHOD SELECTION
// ========================================

/**
 * Initialize withdrawal method selection
 */
function initMethodSelection() {
  const methodItems = document.querySelectorAll('.method-item');

  methodItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      
      // Remove active class from all items
      methodItems.forEach((m) => m.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');

      // Ensure check mark exists
      let checkMark = item.querySelector('.method-check');
      if (!checkMark) {
        checkMark = document.createElement('div');
        checkMark.className = 'method-check';
        checkMark.innerHTML =
          '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 5l2.5 2.5 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>';
        item.appendChild(checkMark);
      }
    });
  });
}

// ========================================
// FORM HANDLING
// ========================================

/**
 * Initialize form handlers
 */
function initFormHandlers() {
  // Auth form
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
  }

  // Sell form
  const sellForm = document.getElementById('sellForm');
  if (sellForm) {
    initSellFormHandlers(sellForm);
  }

  // Withdraw form
  const withdrawForm = document.getElementById('withdrawForm');
  if (withdrawForm) {
    withdrawForm.addEventListener('submit', handleWithdrawSubmit);
  }

  // Support button
  const supportBtn = document.getElementById('supportBtn');
  if (supportBtn) {
    supportBtn.addEventListener('click', () => {
      showToast('Message envoyé au support ✓');
    });
  }

  // More cards button
  const moreCards = document.getElementById('moreCards');
  if (moreCards) {
    moreCards.addEventListener('click', () => {
      showToast('Bientôt disponible!');
    });
  }

  // Confirm withdraw button
  const confirmWithdraw = document.getElementById('confirmWithdraw');
  if (confirmWithdraw) {
    confirmWithdraw.addEventListener('click', handleWithdrawClick);
  }
}

/**
 * Handle authentication form submission
 * @param {Event} event - The form event
 */
function handleAuthSubmit(event) {
  event.preventDefault();
  const phoneEmail = document.getElementById('phoneEmail').value;
  const password = document.getElementById('password').value;

  if (phoneEmail && password) {
    console.log('Auth attempt:', { phoneEmail, password: '****' });
    // In a real app, send to backend
  }
}

/**
 * Initialize sell form handlers
 * @param {HTMLFormElement} form - The sell form element
 */
function initSellFormHandlers(form) {
  const uploadArea = document.querySelector('.upload-area');
  if (uploadArea) {
    uploadArea.addEventListener('click', handleUploadClick);
    uploadArea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleUploadClick();
      }
    });
  }
}

/**
 * Handle upload area click
 */
function handleUploadClick() {
  console.log('Upload area clicked - In production, open file picker');
  showToast('Sélectionnez vos images');
}

/**
 * Handle withdrawal form submission
 * @param {Event} event - The form event
 */
function handleWithdrawSubmit(event) {
  event.preventDefault();
  const phoneNumber = document.getElementById('phoneNumber').value;
  const withdrawAmount = document.getElementById('withdrawAmount').value;

  if (phoneNumber && withdrawAmount) {
    console.log('Withdraw request:', { phoneNumber, amount: withdrawAmount });
  }
}

/**
 * Handle confirm withdraw button click
 */
function handleWithdrawClick() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const withdrawAmount = document.getElementById('withdrawAmount').value;

  if (!phoneNumber || !withdrawAmount) {
    showToast('Veuillez remplir tous les champs');
    return;
  }

  if (parseInt(withdrawAmount) < 1000) {
    showToast('Montant minimum: 1000 FCFA');
    return;
  }

  showToast('Demande de retrait envoyée ✓');
  
  // Reset form after success
  setTimeout(() => {
    document.getElementById('withdrawForm').reset();
    goToScreen('dashboard');
  }, 1500);
}

// ========================================
// FOCUS MANAGEMENT
// ========================================

/**
 * Update navigation item active state on screen change
 */
function updateNavigation() {
  const screens = document.querySelectorAll('.screen');
  const navItems = document.querySelectorAll('.nav-item');

  screens.forEach((screen) => {
    screen.addEventListener('transitionend', () => {
      if (screen.classList.contains('active')) {
        // Determine which nav item should be active
        const screenId = screen.id;
        navItems.forEach((item) => {
          item.classList.remove('active');
          if (item.getAttribute('data-screen') === screenId) {
            item.classList.add('active');
          }
        });
      }
    });
  });
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize all app features
 */
function initializeApp() {
  console.log('CardCash Africa app initializing...');

  // Initialize navigation
  initScreenNavigation();

  // Initialize form handlers
  initFormHandlers();

  // Initialize amount selection
  initAmountSelection();

  // Initialize method selection
  initMethodSelection();

  // Initialize navigation updates
  updateNavigation();

  console.log('CardCash Africa app ready');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
