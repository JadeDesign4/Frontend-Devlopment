import re
from pathlib import Path

q = chr(34)
root = Path('/home/user/uploads')
html = root / 'index.html'
text = html.read_text()

# 1. Add notification dropdown after the bell button
dropdown = '''<div class='notification-dropdown hidden' id='notification-dropdown' role='region' aria-label='Notifications'>
    <article class='notification-item unread'>
        <p><strong>Reward received</strong> — You earned $0.01 cashback.</p>
        <time datetime='2026-07-08'>Just now</time>
    </article>
    <article class='notification-item unread'>
        <p><strong>Security tip</strong> — Enable biometric unlock for faster access.</p>
        <time datetime='2026-07-07'>1 hour ago</time>
    </article>
    <article class='notification-item'>
        <p><strong>Referral bonus</strong> — A friend joined using your code.</p>
        <time datetime='2026-07-06'>Yesterday</time>
    </article>
</div>'''
text = re.sub(r'(<button class=[^>]+notification-button[^>]*>.*?</button>)', '\1\n' + dropdown, text, flags=re.DOTALL, count=1)

# 2. Add network switch after the copy-id button
network = '''<button class='network-switch' type='button' id='network-switch' aria-label='Switch network'>
                        <span class='network-label'>Network</span>
                        <span class='network-value' id='network-value'>Celo</span>
                        <span class='network-icon' aria-hidden='true'>🌐</span>
                    </button>'''
text = re.sub(r'(<button class=[^>]+copy-id[^>]*>.*?</button>)', '\1\n' + network, text, flags=re.DOTALL, count=1)

# 3. Update activity controls: add type + date filters
new_selects = '''<div class='select-wrapper'>
                            <label for='transaction-filter' class='visually-hidden'>Filter transactions</label>
                            <select id='transaction-filter'>
                                <option value='all'>All types</option>
                                <option value='reward'>Rewards</option>
                                <option value='bonus'>Bonuses</option>
                                <option value='cashback'>Cashback</option>
                                <option value='send'>Sent</option>
                                <option value='deposit'>Deposits</option>
                                <option value='withdraw'>Withdrawals</option>
                            </select>
                        </div>
                        <div class='select-wrapper'>
                            <label for='transaction-date' class='visually-hidden'>Filter by date</label>
                            <select id='transaction-date'>
                                <option value='all'>All time</option>
                                <option value='today'>Today</option>
                                <option value='week'>This week</option>
                                <option value='month'>This month</option>
                            </select>
                        </div>'''
text = re.sub(r'(<div class=[^>]+select-wrapper>\s*<label for=transaction-filter[^>]*>.*?</label>\s*<select id=transaction-filter>.*?</select>\s*</div>)', new_selects, text, flags=re.DOTALL, count=1)

# 4. Add data-date to transaction items
text = re.sub(r"<article class=[^>]+transaction-item[^>]+data-type=reward[^>]+data-amount=0\.01>", "<article class='transaction-item' data-type='reward' data-amount='0.01' data-date='2026-07-08'>", text, count=1)
text = re.sub(r"<article class=[^>]+transaction-item[^>]+data-type=bonus[^>]+data-amount=0\.01>", "<article class='transaction-item' data-type='bonus' data-amount='0.01' data-date='2026-07-08'>", text, count=1)
text = re.sub(r"<article class=[^>]+transaction-item[^>]+data-type=cashback[^>]+data-amount=0\.01>", "<article class='transaction-item' data-type='cashback' data-amount='0.01' data-date='2026-07-07'>", text, count=1)
text = re.sub(r"<article class=[^>]+transaction-item[^>]+data-type=bonus[^>]+data-amount=0\.01>", "<article class='transaction-item' data-type='bonus' data-amount='0.01' data-date='2026-07-06'>", text, count=1)

# 5. Fix/update time tags
text = text.replace('<time datetime=' + q + '2026-06-15' + q + '>Today</time>', '<time datetime=' + q + '2026-07-08' + q + '>Today</time>')
text = text.replace('<p>9 hours ago · Shared successfully</p>', '<p><time datetime=' + q + '2026-07-08' + q + '>9 hours ago</time> · Shared successfully</p>')
text = text.replace('<p>Yesterday · Online purchase</p>', '<p><time datetime=' + q + '2026-07-07' + q + '>Yesterday</time> · Online purchase</p>')
text = text.replace('<p>2 days ago · Activity reward</p>', '<p><time datetime=' + q + '2026-07-06' + q + '>2 days ago</time> · Activity reward</p>')

# 6. Insert new sections before the promo banner
new_sections = '''            <section class='portfolio-card' aria-label='Token portfolio'>
                <div class='card-header'>
                    <div>
                        <h2 class='section-title'>Portfolio</h2>
                        <p class='small-text'>Your crypto balances and 24h trends.</p>
                    </div>
                    <div class='portfolio-total'>
                        <span class='portfolio-value' id='portfolio-value'>$0.00</span>
                        <span class='portfolio-change' id='portfolio-change'>+0.0%</span>
                    </div>
                </div>
                <div class='token-list' id='token-list'></div>
            </section>

            <section class='address-book' aria-label='Quick contacts'>
                <h2 class='section-title'>Quick send</h2>
                <p class='small-text'>Tap a contact to auto-fill the send form.</p>
                <div class='contact-list' id='contact-list'></div>
            </section>

            <section class='staking-card' aria-label='Earn and stake'>
                <div class='staking-copy'>
                    <h2 class='section-title'>Earn</h2>
                    <p>Stake your stablecoins and earn up to <strong>5.2% APY</strong> paid weekly. No lock-up period.</p>
                </div>
                <button class='primary-cta' type='button' id='stake-cta'>Start earning</button>
            </section>

            <section class='security-panel' aria-label='Security and network'>
                <div class='security-card'>
                    <h2 class='section-title'>Security</h2>
                    <div class='toggle-row'>
                        <div class='toggle-info'>
                            <span class='toggle-label'>Biometric unlock</span>
                            <span class='toggle-desc'>Use fingerprint or face recognition</span>
                        </div>
                        <button class='switch' type='button' id='biometric-toggle' aria-pressed='false' aria-label='Toggle biometric unlock'>
                            <span class='switch-track'><span class='switch-thumb'></span></span>
                        </button>
                    </div>
                    <button class='secondary-button' type='button' id='backup-seed'>Backup seed phrase</button>
                </div>
                <div class='security-card'>
                    <h2 class='section-title'>Network</h2>
                    <p class='small-text'>Switch between supported chains. Currently on <strong id='security-network'>Celo</strong>.</p>
                    <button class='secondary-button' type='button' id='network-cycle'>Cycle network</button>
                </div>
            </section>'''
text = re.sub(r'(<section class=[^>]+promo-banner)', new_sections + '\n\n            \1', text, count=1)

# 7. Insert receive + swap modals before the script tag
modals = '''    <div class='modal' id='receive-modal' role='dialog' aria-modal='true' aria-labelledby='receive-title' aria-hidden='true'>
        <div class='modal-backdrop' id='receive-modal-backdrop'></div>
        <div class='modal-content'>
            <div class='modal-header'>
                <h2 id='receive-title'>Receive funds</h2>
                <button class='modal-close' type='button' id='receive-modal-close' aria-label='Close modal'>✕</button>
            </div>
            <div class='modal-body'>
                <p>Share your wallet address or QR code to receive funds.</p>
                <div class='qr-code' id='qr-code' aria-label='QR code for wallet address'></div>
                <button class='copy-id' type='button' id='copy-receive-id' aria-label='Copy wallet address'>
                    <span class='copy-label'>Wallet ID</span>
                    <span class='copy-value' id='receive-wallet-id'>MP-8X2K-91Q</span>
                    <span class='copy-icon' aria-hidden='true'>📋</span>
                </button>
                <div class='modal-actions'>
                    <button class='secondary-button' type='button' id='receive-modal-done'>Done</button>
                </div>
            </div>
        </div>
    </div>

    <div class='modal' id='swap-modal' role='dialog' aria-modal='true' aria-labelledby='swap-title' aria-hidden='true'>
        <div class='modal-backdrop' id='swap-modal-backdrop'></div>
        <div class='modal-content'>
            <div class='modal-header'>
                <h2 id='swap-title'>Swap tokens</h2>
                <button class='modal-close' type='button' id='swap-modal-close' aria-label='Close modal'>✕</button>
            </div>
            <div class='modal-body'>
                <p>Preview an exchange between tokens in your wallet.</p>
                <div class='form-group'>
                    <label for='swap-from'>From</label>
                    <select id='swap-from'>
                        <option value='cUSD'>cUSD</option>
                        <option value='CELO'>CELO</option>
                    </select>
                </div>
                <div class='form-group'>
                    <label for='swap-amount'>Amount</label>
                    <div class='amount-input'>
                        <span class='amount-currency' id='swap-currency'>$</span>
                        <input type='number' id='swap-amount' min='0.01' step='0.01' placeholder='0.00'>
                    </div>
                    <span class='error-message' id='swap-amount-error'>Please enter an amount greater than 0.</span>
                </div>
                <div class='form-group'>
                    <label for='swap-to'>To</label>
                    <select id='swap-to'>
                        <option value='CELO'>CELO</option>
                        <option value='cUSD'>cUSD</option>
                    </select>
                </div>
                <div class='modal-actions'>
                    <button class='secondary-button' type='button' id='swap-cancel'>Cancel</button>
                    <button class='primary-cta' type='button' id='swap-confirm'>Preview swap</button>
                </div>
            </div>
        </div>
    </div>'''
text = re.sub(r'(<script src=[^>]+script\.js[^>]*>)', modals + '\n\n    \1', text, count=1)

html.write_text(text)
print('index.html updated')
