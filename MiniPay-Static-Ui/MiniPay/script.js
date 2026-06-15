document.addEventListener('DOMContentLoaded', () => {
    const mobileButton = document.querySelector('.mobile-menu-button');
    const navItems = document.querySelector('.nav-items');
    if (mobileButton && navItems) {
        mobileButton.addEventListener('click', () => {
            navItems.classList.toggle('open');
            const expanded = navItems.classList.contains('open');
            mobileButton.setAttribute('aria-expanded', expanded.toString());
        });
    }

    const currencySwitch = document.querySelector('.currency-switch');
    const balanceValue = document.querySelector('.balance-value');
    const currencyLabel = document.querySelector('.currency-label');
    const balanceTarget = document.querySelector('.currency-target');

    const currencyMap = {
        USD: { amount: '$0.04', target: 'NGN' },
        NGN: { amount: '₦35.00', target: 'USD' }
    };

    if (currencySwitch && balanceValue && currencyLabel && balanceTarget) {
        currencySwitch.addEventListener('click', () => {
            const current = currencySwitch.dataset.currency === 'USD' ? 'NGN' : 'USD';
            currencySwitch.dataset.currency = current;
            balanceValue.textContent = currencyMap[current].amount;
            currencyLabel.textContent = current;
            balanceTarget.textContent = currencyMap[current].target;
            currencySwitch.setAttribute('aria-label', `Switch to ${currencyMap[current].target}`);
        });
    }

    const actionButtons = document.querySelectorAll('.action-button');
    const actionMessage = document.querySelector('.action-message');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            actionButtons.forEach(btn => btn.classList.remove('action-button--active'));
            button.classList.add('action-button--active');
            if (actionMessage) {
                actionMessage.textContent = button.dataset.message || 'Action selected.';
            }
        });
    });

    const viewMoreButton = document.querySelector('#view-more-transactions');
    const moreTransactions = document.querySelector('.transaction-more');
    if (viewMoreButton && moreTransactions) {
        viewMoreButton.addEventListener('click', () => {
            moreTransactions.classList.toggle('hidden');
            viewMoreButton.textContent = moreTransactions.classList.contains('hidden') ? 'View more' : 'View less';
        });
    }

    const featureCards = document.querySelectorAll('.feature-card, .share-card, .crypto-card');
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            if (!action) return;
            if (action.startsWith('http')) {
                window.open(action, '_blank', 'noopener noreferrer');
            } else {
                window.alert(action);
            }
        });
    });
});
