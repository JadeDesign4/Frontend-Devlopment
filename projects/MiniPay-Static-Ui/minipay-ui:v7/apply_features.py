from pathlib import Path

q = chr(34)
root = Path('/home/user/uploads')
js = root / 'script.js'
features = root / 'new_features_block.txt'

text = js.read_text()
new_features = features.read_text()

# Add transaction date filter variable
old_tx_vars = '''    const transactionSearch = $('#transaction-search');
    const transactionFilter = $('#transaction-filter');
    const emptyState = $('#empty-state');'''
new_tx_vars = '''    const transactionSearch = $('#transaction-search');
    const transactionFilter = $('#transaction-filter');
    const transactionDateFilter = $('#transaction-date');
    const emptyState = $('#empty-state');'''
text = text.replace(old_tx_vars, new_tx_vars)

# Add date filter listener
old_listeners = '''    transactionSearch?.addEventListener('input', filterTransactions);
    transactionFilter?.addEventListener('change', filterTransactions);'''
new_listeners = '''    transactionSearch?.addEventListener('input', filterTransactions);
    transactionFilter?.addEventListener('change', filterTransactions);
    transactionDateFilter?.addEventListener('change', filterTransactions);'''
text = text.replace(old_listeners, new_listeners)

# Update openActionModal listener for receive/swap
old_open = '''    if (openActionModal) {
        openActionModal.addEventListener('click', () => {
            if (activeAction === 'send') {
                $('#recipient')?.focus();
                showToast('Enter recipient details in the Quick send form', '✉️', 2500);
                return;
            }
            openModal();
        });
    }'''
new_open = '''    if (openActionModal) {
        openActionModal.addEventListener('click', () => {
            if (activeAction === 'send') {
                $('#recipient')?.focus();
                showToast('Enter recipient details in the Quick send form', '✉️', 2500);
                return;
            }
            if (activeAction === 'receive') {
                openReceiveModal();
                return;
            }
            if (activeAction === 'swap') {
                openSwapModal();
                return;
            }
            openModal();
        });
    }'''
text = text.replace(old_open, new_open)

# Replace filterTransactions to include date filter
old_filter = '''    function filterTransactions() {
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
    }'''
new_filter = '''    function filterTransactions() {
        const query = transactionSearch?.value.toLowerCase().trim() || '';
        const type = transactionFilter?.value || 'all';
        const dateFilter = transactionDateFilter?.value || 'all';
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let visibleCount = 0;

        allTransactions.forEach(item => {
            const itemType = item.dataset.type || '';
            const text = item.textContent.toLowerCase();
            const matchesQuery = !query || text.includes(query);
            const matchesType = type === 'all' || itemType === type;

            let matchesDate = true;
            const dateAttr = item.dataset.date;
            if (dateFilter !== 'all' && dateAttr) {
                const itemDate = new Date(dateAttr);
                const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
                const diffDays = (today - itemDay) / (1000 * 60 * 60 * 24);
                if (dateFilter === 'today' && diffDays !== 0) matchesDate = false;
                if (dateFilter === 'week' && diffDays > 6) matchesDate = false;
                if (dateFilter === 'month' && (itemDay.getMonth() !== today.getMonth() || itemDay.getFullYear() !== today.getFullYear())) matchesDate = false;
            }

            if (matchesQuery && matchesType && matchesDate) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('hidden', visibleCount > 0);
        }
    }'''
text = text.replace(old_filter, new_filter)

# Replace old createCardButton block with new features + fixed button
old_end = '''    /* ---------------------------------------------------------------------- */
    /*  ''' + q + '''Create my virtual card''' + q + ''' button (card page)                           */
    /* ---------------------------------------------------------------------- */
    const createCardButton = $('.primary-button');
    if (createCardButton) {
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
});'''
text = text.replace(old_end, new_features + '\n});')

js.write_text(text)
print('script.js updated')
