/* -------------------------------------------------------------------------- */
/*  MiniPay Dashboard — enhanced interactivity                                  */
/* -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    /* ---------------------------------------------------------------------- */
    /*  Utility helpers                                                       */
    /* ---------------------------------------------------------------------- */
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
    const toastContainer = $('#toast-container');
    function showToast(message, icon = '✅', duration = 3500) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${icon}</span><span>${escapeHtml(message)}</span>`;
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

        // Close menu when a nav link is clicked (useful on mobile)
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
    /*  Currency switching with localStorage                                  */
    /* ---------------------------------------------------------------------- */
    const currencySwitch = $('#currency-switch');
    const balanceValue = $('#balance-value');
    const currencyLabel = $('.currency-label', currencySwitch);
    const balanceTarget = $('.currency-target', currencySwitch);
    const amountCurrency = $('#amount-currency');
    const statIn = $('#stat-in');
    const statOut = $('#stat-out');
    const statRewards = $('#stat-rewards');
    const balanceChange = $('#balance-change');

    const currencyMap = {
        USD: { amount: '$0.04', target: 'NGN', symbol: '$', rate: 1 },
        NGN: { amount: '₦35.00', target: 'USD', symbol: '₦', rate: 875 }
    };

    const baseUSD = { in: 0.04, out: 0.00, rewards: 0.04, change: 0.02 };

    function formatCurrency(value, currency) {
        const symbol = currencyMap[currency].symbol;
        const converted = currency === 'USD' ? value : value * currencyMap.NGN.rate;
        return `${symbol}${converted.toFixed(2)}`;
    }

    function setCurrency(currency) {
        if (!currencySwitch || !balanceValue) return;
        currencySwitch.dataset.currency = currency;
        balanceValue.textContent = currencyMap[currency].amount;
        if (currencyLabel) currencyLabel.textContent = currency;
        if (balanceTarget) balanceTarget.textContent = currencyMap[currency].target;
        currencySwitch.setAttribute('aria-label', `Switch currency to ${currencyMap[currency].target}`);

        if (amountCurrency) amountCurrency.textContent = currencyMap[currency].symbol;
        if (statIn) statIn.textContent = formatCurrency(baseUSD.in, currency);
        if (statOut) statOut.textContent = formatCurrency(baseUSD.out, currency);
        if (statRewards) statRewards.textContent = formatCurrency(baseUSD.rewards, currency);
        if (balanceChange) balanceChange.textContent = `+${formatCurrency(baseUSD.change, currency)} this week`;

        updateTransactionValues(currency);
        storage.set('minipay-currency', currency);
    }

    const savedCurrency = storage.get('minipay-currency', 'USD');
    setCurrency(savedCurrency);

    if (currencySwitch) {
        currencySwitch.addEventListener('click', () => {
            const current = currencySwitch.dataset.currency === 'USD' ? 'NGN' : 'USD';
            setCurrency(current);
            showToast(`Switched to ${current}`, '💱', 2500);
        });
    }

    /* ---------------------------------------------------------------------- */
    /*  Action buttons & modal                                                */
    /* ---------------------------------------------------------------------- */
    const actionButtons = $$('.action-button');
    const actionMessage = $('#action-message');
    let activeAction = 'deposit';

    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            actionButtons.forEach(btn => btn.classList.remove('action-button--active'));
            button.classList.add('action-button--active');
            activeAction = button.dataset.action || 'deposit';
            if (actionMessage) {
                actionMessage.textContent = button.dataset.message || 'Action selected.';
            }
        });
    });

    const modal = $('#action-modal');
    const modalTitle = $('#modal-title');
    const modalMessage = $('#modal-message');
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

    const actionMessages = {
        deposit: 'Use the MiniPay app to add funds to your wallet.',
        withdraw: 'Confirm your withdrawal destination in the MiniPay app.',
        send: 'Use the quick send form to transfer funds to another wallet.'
    };

    function openModal() {
        if (!modal || !modalTitle || !modalMessage) return;
        modalTitle.textContent = actionTitles[activeAction] || 'Action';
        modalMessage.textContent = actionMessages[activeAction] || 'Proceed with the selected action.';
        modal.setAttribute('aria-hidden', 'false');
        modalClose.focus();
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
        closeModal();
        showToast(`${actionTitles[activeAction]} confirmed!`, '✅', 3000);
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

    function updateTransactionValues(currency) {
        $$('.transaction-item').forEach(item => {
            const amount = parseFloat(item.dataset.amount) || 0;
            const isSend = item.dataset.type === 'send';
            const valueEl = item.querySelector('.transaction-value');
            const sign = isSend ? '-' : '+';
            if (valueEl) valueEl.textContent = `${sign}${formatCurrency(amount, currency)}`;
        });
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
            const parentHidden = item.closest('#transaction-more')?.classList.contains('hidden');

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
    const sendSubmit = $('#send-submit');
    const transactionList = $('#transaction-list');

    function showFieldError(field, show) {
        const group = field.closest('.form-group');
        if (!group) return;
        if (show) group.classList.add('has-error');
        else group.classList.remove('has-error');
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

            const currency = currencySwitch?.dataset.currency || 'USD';
            const symbol = currencyMap[currency].symbol;
            const note = $('#note')?.value.trim();
            const displayAmount = `${symbol}${amountValue.toFixed(2)}`;

            const newTx = document.createElement('article');
            newTx.className = 'transaction-item';
            newTx.dataset.type = 'send';
            newTx.dataset.amount = amountValue.toFixed(2);
            newTx.innerHTML = `
                <div class="transaction-icon transaction-icon--out" aria-hidden="true">−</div>
                <div class="transaction-copy">
                    <h3>Sent to ${escapeHtml(recipient.value.toUpperCase())}</h3>
                    <p>Just now${note ? ' · ' + escapeHtml(note) : ''}</p>
                </div>
                <div class="transaction-value">-${displayAmount}</div>
            `;
            transactionList.insertBefore(newTx, transactionList.firstChild);
            allTransactions.unshift(newTx);

            // Update stats
            baseUSD.out += amountValue;
            if (statOut) statOut.textContent = formatCurrency(baseUSD.out, currency);
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
    /*  Feature card clicks for other pages                                     */
    /* ---------------------------------------------------------------------- */
    $$('.feature-card, .share-card, .crypto-card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            if (!action) return;
            if (action.startsWith('http')) {
                window.open(action, '_blank', 'noopener noreferrer');
            } else {
                showToast(action, 'ℹ️', 3000);
            }
        });
    });
});
