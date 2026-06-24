const state = {
    currency: 'USD',
    exchangeRate: 731,
    balances: {
        USD: 0.21,
        NGN: 154,
    },
};

const balanceAmount = document.getElementById('balance-title');
const currencyToggle = document.getElementById('currencyToggle');
const currencyButtons = document.querySelectorAll('.currency-item');
const actionButtons = document.querySelectorAll('[data-action]');
const footerButtons = document.querySelectorAll('.footer-action');
const toast = document.getElementById('toast');
const viewMoreButton = document.getElementById('viewMore');
const depositNowButton = document.getElementById('depositNow');
let toastTimeout = null;

function formatBalance(currency) {
    const value = state.balances[currency];
    if (currency === 'USD') {
        return `$${value.toFixed(2)}`;
    }
    return `₦${value.toLocaleString('en-NG')}`;
}

function updateBalanceDisplay() {
    balanceAmount.textContent = formatBalance(state.currency);
    currencyButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.currency === state.currency);
    });
    currencyToggle.setAttribute('aria-pressed', String(state.currency === 'NGN'));
}

function syncBalances() {
    state.balances.NGN = Math.round(state.balances.USD * state.exchangeRate);
}

function setCurrency(currency) {
    if (state.currency === currency) return;
    state.currency = currency;
    updateBalanceDisplay();
    showToast(`Switched to ${currency}`);
}

function toggleCurrency() {
    const nextCurrency = state.currency === 'USD' ? 'NGN' : 'USD';
    setCurrency(nextCurrency);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toast.classList.remove('visible');
    }, 2600);
}

function handleAction(action) {
    const amount = action === 'deposit' ? 0.08 : -0.06;
    state.balances.USD = Math.max(0, state.balances.USD + amount);
    syncBalances();
    updateBalanceDisplay();
    const verb = action === 'deposit' ? 'Deposited' : 'Withdrawn';
    showToast(`${verb} funds successfully.`);
}

function handleFooterSelection(navKey) {
    footerButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.nav === navKey);
    });
    showToast(`Opening ${navKey.charAt(0).toUpperCase() + navKey.slice(1)}`);
}

function initEventListeners() {
    currencyToggle.addEventListener('click', toggleCurrency);

    currencyButtons.forEach((button) => {
        button.addEventListener('click', () => setCurrency(button.dataset.currency));
    });

    actionButtons.forEach((button) => {
        button.addEventListener('click', () => handleAction(button.dataset.action));
    });

    footerButtons.forEach((button) => {
        button.addEventListener('click', () => handleFooterSelection(button.dataset.nav));
    });

    viewMoreButton.addEventListener('click', () => showToast('Loading more activity...'));
    depositNowButton.addEventListener('click', () => handleAction('deposit'));
}

function init() {
    syncBalances();
    updateBalanceDisplay();
    initEventListeners();
}

init();
