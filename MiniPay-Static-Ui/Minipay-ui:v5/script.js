/* -------------------------------------------------------------------------- */
/*  MiniPay site-wide interactivity                                            */
/* -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
    const storage = {
        get: (key, fallback) => {
            try {
                const value = localStorage.getItem(key);
                return value === null ? fallback : JSON.parse(value);
            } catch {
                return fallback;
            }
        },
        set: (key, value) => {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
        }
    };

    /* ---------------------------------------------------------------------- */
    /*  Toast notifications                                                   */
    /* ---------------------------------------------------------------------- */
    const toastContainer = $('#toast-container') || document.createElement('div');
    if (!$('#toast-container')) {
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        toastContainer.setAttribute('aria-atomic', 'true');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    function showToast(message, icon = '✅', duration = 3500) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${escapeHtml(icon)}</span><span>${escapeHtml(message)}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast--out');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        }, duration);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /* ---------------------------------------------------------------------- */
    /*  Dark / light theme                                                    */
    /* ---------------------------------------------------------------------- */
    const themeToggle = $('#theme-toggle');
    const themeColorMeta = $('meta[name="theme-color"]');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const isDark = theme === 'dark';
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', isDark ? '#22c55e' : '#22c55e');
        }
        storage.set('minipay-theme', theme);
    }

    function initTheme() {
        const saved = storage.get('minipay-theme', null);
        if (saved === 'dark' || saved === 'light') {
            applyTheme(saved);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    initTheme();

    themeToggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const saved = storage.get('minipay-theme', null);
        if (!saved) applyTheme(e.matches ? 'dark' : 'light');
    });

    /* ---------------------------------------------------------------------- */
    /*  Mobile navigation                                                     */
    /* ---------------------------------------------------------------------- */
    const mobileButton = $('.mobile-menu-button');
    const navItems = $('.nav-items');
    if (mobileButton && navItems) {
        mobileButton.addEventListener('click', () => {
            const isOpen = navItems.classList.toggle('open');
            mobileButton.setAttribute('aria-expanded', String(isOpen));
            mobileButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        $$('.nav-link', navItems).forEach(link => {
            link.addEventListener('click', () => {
                navItems.classList.remove('open');
                mobileButton.setAttribute('aria-expanded', 'false');
                mobileButton.setAttribute('aria-label', 'Open navigation menu');
            });
        });
    }

    /* ---------------------------------------------------------------------- */
    /*  Notification bell                                                     */
    /* ---------------------------------------------------------------------- */
    const notificationButton = $('#notification-button');
    if (notificationButton) {
        notificationButton.addEventListener('click', () => {
            const badge = notificationButton.querySelector('.notification-badge');
            if (badge) badge.remove();
            showToast('You have no new notifications', '🔔', 3000);
            notificationButton.setAttribute('aria-expanded', 'false');
        });
    }

    /* ---------------------------------------------------------------------- */
    /*  Live greeting & clock                                                 */
    /* ---------------------------------------------------------------------- */
    const greetingTitle = $('#greeting-title');
    const currentTime = $('#current-time');

    function updateGreeting() {
        if (!greetingTitle) return;
        const hour = new Date().getHours();
        let greeting = 'Hello! Welcome to MiniPay!';
        if (hour < 12) greeting = 'Good morning! Welcome to MiniPay!';
        else if (hour < 17) greeting = 'Good afternoon! Welcome to MiniPay!';
        else greeting = 'Good evening! Welcome to MiniPay!';
        greetingTitle.textContent = greeting;
    }

    function updateTime() {
        if (!currentTime) return;
        const now = new Date();
        currentTime.textContent = now.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    updateGreeting();
    updateTime();
    setInterval(updateTime, 1000);

    /* ---------------------------------------------------------------------- */
    /*  Wallet balance & currency (index page)                                */
    /* ---------------------------------------------------------------------- */
    const currencySwitch = $('#currency-switch');
    const balanceValue = $('#balance-value');
    const balanceLabel = $('#balance-label');
    const currencyLabel = $('.currency-label', currencySwitch);
    const balanceTarget = $('.currency-target', currencySwitch);
    const amountCurrency = $('#amount-currency');
    const modalAmountCurrency = $('#modal-amount-currency');
    const statIn = $('#stat-in');
    const statOut = $('#stat-out');
    const statRewards = $('#stat-rewards');
    const balanceChange = $('#balance-change');
    const balanceToggle = $('#balance-toggle');

    const currencyMap = {
        USD: { target: 'NGN', symbol: '$', rate: 1 },
        NGN: { target: 'USD', symbol: '₦', rate: 875 }
    };

    let balanceUSD = 0.04;
    let totalInUSD = 0.04;
    let totalOutUSD = 0.00;
    let rewardsUSD = 0.04;
    let isBalanceHidden = storage.get('minipay-balance-hidden', false);

    function formatCurrency(value, currency) {
        const symbol = currencyMap[currency].symbol;
        const converted = currency === 'USD' ? value : value * currencyMap.NGN.rate;
        return `${symbol}${converted.toFixed(2)}`;
    }

    function renderBalance(currency) {
        if (!balanceValue) return;
        const formatted = formatCurrency(balanceUSD, currency);
        balanceValue.dataset.currencyValue = formatted;

        if (isBalanceHidden) {
            balanceValue.textContent = '••••';
            if (balanceLabel) balanceLabel.textContent = 'Balance hidden';
        } else {
            balanceValue.textContent = formatted;
            if (balanceLabel) balanceLabel.textContent = 'Available balance';
        }
    }

    function updateDashboard(currency) {
        if (!currencySwitch) return;
        renderBalance(currency);
        if (currencyLabel) currencyLabel.textContent = currency;
        if (balanceTarget) balanceTarget.textContent = currencyMap[currency].target;
        currencySwitch.setAttribute('aria-label', `Switch currency to ${currencyMap[currency].target}`);
        if (amountCurrency) amountCurrency.textContent = currencyMap[currency].symbol;
        if (modalAmountCurrency) modalAmountCurrency.textContent = currencyMap[currency].symbol;
        if (statIn) statIn.textContent = formatCurrency(totalInUSD, currency);
        if (statOut) statOut.textContent = formatCurrency(totalOutUSD, currency);
        if (statRewards) statRewards.textContent = formatCurrency(rewardsUSD, currency);
        if (balanceChange) balanceChange.textContent = `+${formatCurrency(totalInUSD - totalOutUSD, currency)} this week`;
        updateTransactionValues(currency);
    }

    function setBalanceHidden(hidden) {
        isBalanceHidden = hidden;
        if (balanceToggle) {
            balanceToggle.setAttribute('aria-pressed', String(hidden));
            balanceToggle.setAttribute('aria-label', hidden ? 'Show balance' : 'Hide balance');
        }
        const currency = currencySwitch?.dataset.currency || 'USD';
        renderBalance(currency);
        storage.set('minipay-balance-hidden', hidden);
    }

    const savedCurrency = storage.get('minipay-currency', 'USD');
    if (currencySwitch) currencySwitch.dataset.currency = savedCurrency;
    setBalanceHidden(isBalanceHidden);
    updateDashboard(savedCurrency);

    if (currencySwitch) {
        currencySwitch.addEventListener('click', () => {
            const current = currencySwitch.dataset.currency === 'USD' ? 'NGN' : 'USD';
            currencySwitch.dataset.currency = current;
            updateDashboard(current);
            showToast(`Switched to ${current}`, '💱', 2500);
        });
    }

    if (balanceToggle) {
        balanceToggle.addEventListener('click', () => {
            setBalanceHidden(!isBalanceHidden);
            showToast(isBalanceHidden ? 'Balance hidden' : 'Balance visible', '👁', 2000);
        });
    }

    /* ---------------------------------------------------------------------- */
    /*  Action buttons & modal (deposit / withdraw)                             */
    /* ---------------------------------------------------------------------- */
    const actionButtons = $$('.action-button');
    const actionMessage = $('#action-message');
    let activeAction = 'deposit';

    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            actionButtons.forEach(btn => btn.classList.remove('action-button--active'));
            button.classList.add('action-button--active');
            activeAction = button.dataset.action || 'deposit';
            if (actionMessage) actionMessage.textContent = button.dataset.message || 'Action selected.';
        });
    });

    const modal = $('#action-modal');
    const modalTitle = $('#modal-title');
    const modalMessage = $('#modal-message');
    const modalAmount = $('#modal-amount');
    const modalAmountGroup = $('#modal-amount-group');
    const modalBackdrop = $('#modal-backdrop');
    const modalClose = $('#modal-close');
    const modalCancel = $('#modal-cancel');
    const modalConfirm = $('#modal-confirm');
    const openActionModal = $('#open-action-modal');

    const actionTitles = {
        deposit: 'Deposit funds',
        withdraw: 'Withdraw funds',
        send: 'Send funds'
    };

    const actionPrompts = {
        deposit: 'Enter the amount you want to deposit.',
        withdraw: 'Enter the amount you want to withdraw.',
        send: 'Use the quick send form to transfer funds to another wallet.'
    };

    function openModal() {
        if (!modal || !modalTitle || !modalMessage) return;
        modalTitle.textContent = actionTitles[activeAction] || 'Action';
        modalMessage.textContent = actionPrompts[activeAction] || 'Proceed with the selected action.';
        modal.setAttribute('aria-hidden', 'false');
        if (modalAmount) {
            modalAmount.value = '';
            modalAmountGroup?.classList.remove('has-error');
            setTimeout(() => modalAmount.focus(), 50);
        }
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (openActionModal) openActionModal.focus();
    }

    if (openActionModal) {
        openActionModal.addEventListener('click', () => {
            if (activeAction === 'send') {
                $('#recipient')?.focus();
                showToast('Enter recipient details in the Quick send form', '✉️', 2500);
                return;
            }
            openModal();
        });
    }

    [modalBackdrop, modalClose, modalCancel].forEach(el => {
        el?.addEventListener('click', closeModal);
    });

    modalConfirm?.addEventListener('click', () => {
        const amount = parseFloat(modalAmount?.value);
        if (!amount || amount <= 0) {
            modalAmountGroup?.classList.add('has-error');
            return;
        }
        modalAmountGroup?.classList.remove('has-error');

        const currency = currencySwitch?.dataset.currency || 'USD';
        const symbol = currencyMap[currency].symbol;

        if (activeAction === 'deposit') {
            balanceUSD += amount;
            totalInUSD += amount;
            addTransaction('deposit', amount, 'Deposit', 'Just now · Wallet top-up');
            showToast(`Deposited ${symbol}${amount.toFixed(2)}`, '💰', 3000);
        } else if (activeAction === 'withdraw') {
            if (amount > balanceUSD) {
                showToast('Insufficient balance for this withdrawal', '⚠️', 3000);
                return;
            }
            balanceUSD -= amount;
            totalOutUSD += amount;
            addTransaction('withdraw', amount, 'Withdrawal', 'Just now · Wallet payout');
            showToast(`Withdrew ${symbol}${amount.toFixed(2)}`, '💵', 3000);
        }

        updateDashboard(currency);
        closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    /* ---------------------------------------------------------------------- */
    /*  Copy wallet ID                                                        */
    /* ---------------------------------------------------------------------- */
    const copyIdButton = $('#copy-id');
    const walletId = $('#wallet-id');
    if (copyIdButton && walletId) {
        copyIdButton.addEventListener('click', async () => {
            const id = walletId.textContent;
            try {
                await navigator.clipboard.writeText(id);
                showToast(`Wallet ID ${id} copied to clipboard`, '📋', 3000);
            } catch {
                showToast('Unable to copy wallet ID', '⚠️', 3000);
            }
        });
    }

    /* ---------------------------------------------------------------------- */
    /*  View more / less transactions                                           */
    /* ---------------------------------------------------------------------- */
    const viewMoreButton = $('#view-more-transactions');
    const moreTransactions = $('#transaction-more');
    if (viewMoreButton && moreTransactions) {
        viewMoreButton.addEventListener('click', () => {
            const isHidden = moreTransactions.classList.toggle('hidden');
            viewMoreButton.textContent = isHidden ? 'View more' : 'View less';
            viewMoreButton.setAttribute('aria-expanded', String(!isHidden));
        });
    }

    /* ---------------------------------------------------------------------- */
    /*  Transaction search & filter                                             */
    /* ---------------------------------------------------------------------- */
    const transactionSearch = $('#transaction-search');
    const transactionFilter = $('#transaction-filter');
    const emptyState = $('#empty-state');
    const allTransactions = $$('.transaction-item');
    const transactionList = $('#transaction-list');

    function updateTransactionValues(currency) {
        $$('.transaction-item').forEach(item => {
            const amount = parseFloat(item.dataset.amount) || 0;
            const type = item.dataset.type || '';
            const isOut = type === 'send' || type === 'withdraw';
            const valueEl = item.querySelector('.transaction-value');
            const sign = isOut ? '-' : '+';
            if (valueEl) valueEl.textContent = `${sign}${formatCurrency(amount, currency)}`;
        });
    }

    function addTransaction(type, amountUSD, title, description) {
        if (!transactionList) return;
        const currency = currencySwitch?.dataset.currency || 'USD';
        const isOut = type === 'send' || type === 'withdraw';
        const sign = isOut ? '-' : '+';
        const icon = isOut ? '−' : '+';
        const iconClass = isOut ? 'transaction-icon--out' : 'transaction-icon--in';

        const newTx = document.createElement('article');
        newTx.className = 'transaction-item';
        newTx.dataset.type = type;
        newTx.dataset.amount = amountUSD.toFixed(2);
        newTx.innerHTML = `
            <div class="transaction-icon ${iconClass}" aria-hidden="true">${icon}</div>
            <div class="transaction-copy">
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(description)}</p>
            </div>
            <div class="transaction-value">${sign}${formatCurrency(amountUSD, currency)}</div>
        `;
        transactionList.insertBefore(newTx, transactionList.firstChild);
        allTransactions.unshift(newTx);
    }

    function filterTransactions() {
        const query = transactionSearch?.value.toLowerCase().trim() || '';
        const type = transactionFilter?.value || 'all';
        let visibleCount = 0;

        allTransactions.forEach(item => {
            const itemType = item.dataset.type || '';
            const text = item.textContent.toLowerCase();
            const matchesQuery = !query || text.includes(query);
            const matchesType = type === 'all' || itemType === type;

            if (matchesQuery && matchesType) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('hidden', visibleCount > 0);
        }
    }

    transactionSearch?.addEventListener('input', filterTransactions);
    transactionFilter?.addEventListener('change', filterTransactions);

    /* ---------------------------------------------------------------------- */
    /*  Quick send form                                                        */
    /* ---------------------------------------------------------------------- */
    const sendForm = $('#send-form');

    function showFieldError(field, show) {
        const group = field?.closest('.form-group');
        if (!group) return;
        group.classList.toggle('has-error', show);
    }

    function validateWalletId(value) {
        return /^MP-[A-Z0-9]{4}-[A-Z0-9]{3}$/.test(value.trim());
    }

    if (sendForm) {
        const recipient = $('#recipient');
        const amount = $('#amount');

        recipient?.addEventListener('blur', () => showFieldError(recipient, !validateWalletId(recipient.value)));
        recipient?.addEventListener('input', () => showFieldError(recipient, false));
        amount?.addEventListener('input', () => showFieldError(amount, false));

        sendForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            if (!validateWalletId(recipient.value)) {
                showFieldError(recipient, true);
                valid = false;
            }

            const amountValue = parseFloat(amount.value);
            if (!amountValue || amountValue <= 0) {
                showFieldError(amount, true);
                valid = false;
            }

            if (!valid) {
                showToast('Please fix the errors in the form', '⚠️', 3000);
                return;
            }

            if (amountValue > balanceUSD) {
                showToast('Insufficient balance for this transfer', '⚠️', 3000);
                return;
            }

            const currency = currencySwitch?.dataset.currency || 'USD';
            const symbol = currencyMap[currency].symbol;
            const note = $('#note')?.value.trim();
            const displayAmount = `${symbol}${amountValue.toFixed(2)}`;

            balanceUSD -= amountValue;
            totalOutUSD += amountValue;
            addTransaction('send', amountValue, `Sent to ${recipient.value.toUpperCase()}`, `Just now${note ? ' · ' + note : ''}`);
            updateDashboard(currency);
            showToast(`Sent ${displayAmount} to ${recipient.value.toUpperCase()}`, '💸', 4000);

            sendForm.reset();
            showFieldError(recipient, false);
            showFieldError(amount, false);
        });
    }

    /* ---------------------------------------------------------------------- */
    /*  Referral share                                                          */
    /* ---------------------------------------------------------------------- */
    const shareReferral = $('#share-referral');
    if (shareReferral) {
        shareReferral.addEventListener('click', async () => {
            const text = 'Join me on MiniPay and we both earn rewards! Use my referral code MP-8X2K-91Q.';
            try {
                if (navigator.share) {
                    await navigator.share({ title: 'MiniPay referral', text });
                } else {
                    await navigator.clipboard.writeText(text);
                    showToast('Referral message copied to clipboard', '🔗', 3000);
                }
            } catch {
                showToast('Sharing cancelled', 'ℹ️', 2000);
            }
        });
    }

    /* ---------------------------------------------------------------------- */
    /*  Footer year                                                             */
    /* ---------------------------------------------------------------------- */
    const yearSpan = $('#year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    /* ---------------------------------------------------------------------- */
    /*  Feature / share / crypto card clicks (card, share, more pages)          */
    /* ---------------------------------------------------------------------- */
    $$('.feature-card, .share-card, .crypto-card, .feature-item').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            const action = card.dataset.action;
            if (!action) return;
            if (action.startsWith('http')) {
                window.open(action, '_blank', 'noopener noreferrer');
            } else {
                showToast(action, 'ℹ️', 3000);
            }
        });
    });

    /* ---------------------------------------------------------------------- */
    /*  "Create my virtual card" button (card page)                           */
    /* ---------------------------------------------------------------------- */
    const createCardButton = $('.primary-button');
    if (createCardButton && !$('#send-form')) {
        createCardButton.addEventListener('click', () => {
            const originalText = createCardButton.textContent;
            createCardButton.disabled = true;
            createCardButton.textContent = 'Creating card...';
            setTimeout(() => {
                createCardButton.disabled = false;
                createCardButton.textContent = originalText;
                showToast('Your virtual card has been created!', '💳', 4000);
            }, 1500);
        });
    }
});
