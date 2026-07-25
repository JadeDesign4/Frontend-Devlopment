from pathlib import Path

style = Path('/home/user/uploads/style.css')
text = style.read_text()

replacements = [
    (
        '  --border: rgba(15, 23, 42, 0.08);\n  --shadow: 0 24px 70px rgba(0, 0, 0, 0.08);',
        '  --border: rgba(15, 23, 42, 0.08);\n  --surface-elevated: #f1f5f9;\n  --surface-elevated-hover: #e2e8f0;\n  --shadow: 0 24px 70px rgba(0, 0, 0, 0.08);'
    ),
    (
        '  --border: rgba(255, 255, 255, 0.06);\n  --shadow: 0 24px 70px rgba(0, 0, 0, 0.35);',
        '  --border: rgba(255, 255, 255, 0.06);\n  --surface-elevated: rgba(255, 255, 255, 0.04);\n  --surface-elevated-hover: rgba(255, 255, 255, 0.08);\n  --shadow: 0 24px 70px rgba(0, 0, 0, 0.35);'
    ),
    (
        '.secondary-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid var(--border);\n  border-radius: 999px;\n  padding: 0.85rem 1.4rem;\n  background: rgba(255, 255, 255, 0.08);\n  color: var(--text);\n  font-weight: 700;\n  transition: background var(--transition), border-color var(--transition), transform var(--transition);\n}\n\n.secondary-button:hover,\n.secondary-button:focus-visible {\n  background: rgba(255, 255, 255, 0.12);\n  border-color: var(--primary);\n  transform: translateY(-2px);\n  outline: none;\n}',
        '.secondary-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid var(--border);\n  border-radius: 999px;\n  padding: 0.85rem 1.4rem;\n  background: var(--surface-elevated);\n  color: var(--text);\n  font-weight: 700;\n  transition: background var(--transition), border-color var(--transition), transform var(--transition);\n}\n\n.secondary-button:hover,\n.secondary-button:focus-visible {\n  background: var(--surface-elevated-hover);\n  border-color: var(--primary);\n  transform: translateY(-2px);\n  outline: none;\n}'
    ),
    (
        '.form-group input,\n.form-group select,\n.amount-input {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-xs);\n  padding: 0.95rem 1rem;\n  background: rgba(255, 255, 255, 0.04);\n  color: var(--text);\n  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);\n}',
        '.form-group input,\n.form-group select,\n.amount-input {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-xs);\n  padding: 0.95rem 1rem;\n  background: var(--surface-elevated);\n  color: var(--text);\n  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);\n}'
    ),
    (
        '.form-group input:hover,\n.form-group input:focus,\n.form-group select:hover,\n.form-group select:focus,\n.amount-input:focus-within {\n  border-color: var(--primary);\n  background: rgba(255, 255, 255, 0.08);\n  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);\n  outline: none;\n}',
        '.form-group input:hover,\n.form-group input:focus,\n.form-group select:hover,\n.form-group select:focus,\n.amount-input:focus-within {\n  border-color: var(--primary);\n  background: var(--surface-elevated-hover);\n  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);\n  outline: none;\n}'
    ),
    (
        '.search-box input {\n  border: 1px solid var(--border);\n  border-radius: 999px;\n  padding: 0.85rem 1rem 0.85rem 2.5rem;\n  background: rgba(255, 255, 255, 0.04);\n  min-width: 200px;\n  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);\n}',
        '.search-box input {\n  border: 1px solid var(--border);\n  border-radius: 999px;\n  padding: 0.85rem 1rem 0.85rem 2.5rem;\n  background: var(--surface-elevated);\n  min-width: 200px;\n  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);\n}'
    ),
    (
        '.search-box input:hover,\n.search-box input:focus {\n  border-color: var(--primary);\n  background: rgba(255, 255, 255, 0.08);\n  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);\n  outline: none;\n}',
        '.search-box input:hover,\n.search-box input:focus {\n  border-color: var(--primary);\n  background: var(--surface-elevated-hover);\n  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);\n  outline: none;\n}'
    ),
    (
        '.select-wrapper select {\n  appearance: none;\n  border: 1px solid var(--border);\n  border-radius: 999px;\n  padding: 0.85rem 2.2rem 0.85rem 1rem;\n  background: rgba(255, 255, 255, 0.04);\n  cursor: pointer;\n  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);\n}',
        '.select-wrapper select {\n  appearance: none;\n  border: 1px solid var(--border);\n  border-radius: 999px;\n  padding: 0.85rem 2.2rem 0.85rem 1rem;\n  background: var(--surface-elevated);\n  cursor: pointer;\n  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);\n}'
    ),
    (
        '.select-wrapper select:hover,\n.select-wrapper select:focus {\n  border-color: var(--primary);\n  background: rgba(255, 255, 255, 0.08);\n  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);\n  outline: none;\n}',
        '.select-wrapper select:hover,\n.select-wrapper select:focus {\n  border-color: var(--primary);\n  background: var(--surface-elevated-hover);\n  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);\n  outline: none;\n}'
    ),
    (
        '.transaction-item {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  gap: 1rem;\n  align-items: center;\n  padding: 1.15rem 1.35rem;\n  background: rgba(255, 255, 255, 0.04);\n  border-radius: var(--radius-sm);\n  border: 1px solid var(--border);\n  transition: transform var(--transition), box-shadow var(--transition), background var(--transition);\n}',
        '.transaction-item {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  gap: 1rem;\n  align-items: center;\n  padding: 1.15rem 1.35rem;\n  background: var(--surface-elevated);\n  border-radius: var(--radius-sm);\n  border: 1px solid var(--border);\n  transition: transform var(--transition), box-shadow var(--transition), background var(--transition);\n}'
    ),
    (
        '.transaction-item:hover {\n  background: rgba(255, 255, 255, 0.08);\n  transform: translateY(-2px);\n  box-shadow: var(--shadow-sm);\n}',
        '.transaction-item:hover {\n  background: var(--surface-elevated-hover);\n  transform: translateY(-2px);\n  box-shadow: var(--shadow-sm);\n}'
    ),
    (
        '.empty-state {\n  text-align: center;\n  color: var(--muted);\n  padding: 2rem 1rem;\n  background: rgba(255, 255, 255, 0.04);\n  border-radius: var(--radius-sm);\n  font-weight: 700;\n}',
        '.empty-state {\n  text-align: center;\n  color: var(--muted);\n  padding: 2rem 1rem;\n  background: var(--surface-elevated);\n  border-radius: var(--radius-sm);\n  font-weight: 700;\n}'
    ),
    (
        '.action-button {\n  border: 1px solid var(--border);\n  border-radius: 24px;\n  padding: 1rem 1rem;\n  color: var(--text);\n  background: rgba(255, 255, 255, 0.05);\n  font-weight: 700;\n  transition: background var(--transition), border-color var(--transition), transform var(--transition), color var(--transition);\n}',
        '.action-button {\n  border: 1px solid var(--border);\n  border-radius: 24px;\n  padding: 1rem 1rem;\n  color: var(--text);\n  background: var(--surface-elevated);\n  font-weight: 700;\n  transition: background var(--transition), border-color var(--transition), transform var(--transition), color var(--transition);\n}'
    ),
    (
        '.action-button:hover,\n.action-button:focus-visible {\n  background: rgba(255, 255, 255, 0.1);\n  transform: translateY(-2px);\n  outline: none;\n}',
        '.action-button:hover,\n.action-button:focus-visible {\n  background: var(--surface-elevated-hover);\n  transform: translateY(-2px);\n  outline: none;\n}'
    ),
    (
        '.currency-switch {\n  background: rgba(255, 255, 255, 0.1);\n  color: var(--text);\n  border: 1px solid var(--border);\n}',
        '.currency-switch {\n  background: var(--surface-elevated);\n  color: var(--text);\n  border: 1px solid var(--border);\n}'
    ),
    (
        '.stat-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 16px;\n  display: grid;\n  place-items: center;\n  font-size: 1.1rem;\n  flex-shrink: 0;\n  background: rgba(255, 255, 255, 0.08);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);\n}',
        '.stat-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 16px;\n  display: grid;\n  place-items: center;\n  font-size: 1.1rem;\n  flex-shrink: 0;\n  background: var(--surface-elevated);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);\n}'
    ),
    (
        '.button-row {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 0.75rem;\n}',
        '.button-row {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\n  gap: 0.75rem;\n}'
    ),
    (
        '.header-actions {\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n  flex-shrink: 0;\n  order: 2;\n}',
        '.header-actions {\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n  flex-shrink: 0;\n  order: 2;\n  position: relative;\n}'
    ),
]

for old, new in replacements:
    if old not in text:
        print(f'WARNING: snippet not found: {old[:50]}')
        continue
    text = text.replace(old, new, 1)

# Remove test artifacts from earlier experiments
text = text.replace('.test-middle {\n  color: red;\n}\n', '')
text = text.replace('.test-end {\n  color: red;\n}\n', '')

new_css = '''/* -------------------------------------------------------------------------- */
/*  Modern crypto-wallet components                                           */
/* -------------------------------------------------------------------------- */

/* Network switch button */
.network-switch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  background: var(--surface-elevated);
  color: var(--text);
  border: 1px solid var(--border);
  transition: transform var(--transition), box-shadow var(--transition), background var(--transition);
}

.network-switch:hover,
.network-switch:focus-visible {
  transform: translateY(-2px);
  background: var(--primary-light);
  color: var(--primary);
  outline: none;
}

.network-label {
  font-size: 0.75rem;
  opacity: 0.75;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.network-value {
  font-family: ui-monospace, monospace;
  font-weight: 700;
}

/* Notification dropdown */
.notification-dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  width: min(320px, 90vw);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  z-index: 60;
  padding: 1rem;
  display: grid;
  gap: 0.5rem;
  animation: dropdown-in 0.2s ease;
}

.notification-dropdown.hidden {
  display: none;
}

@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.notification-item {
  display: grid;
  gap: 0.25rem;
  padding: 0.85rem;
  background: var(--surface-elevated);
  border-radius: var(--radius-xs);
  border: 1px solid var(--border);
  transition: background var(--transition);
}

.notification-item:hover {
  background: var(--surface-elevated-hover);
}

.notification-item.unread {
  border-left: 3px solid var(--primary);
}

.notification-item p {
  font-size: 0.9rem;
  color: var(--text);
}

.notification-item time {
  font-size: 0.75rem;
  color: var(--muted);
}

/* Portfolio & tokens */
.portfolio-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.75rem;
  display: grid;
  gap: 1.25rem;
}

.portfolio-total {
  text-align: right;
}

.portfolio-value {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-dark);
}

.portfolio-change {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
}

.portfolio-change.down {
  color: #ef4444;
}

.token-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.token-card {
  display: grid;
  gap: 0.75rem;
  padding: 1.25rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: transform var(--transition), box-shadow var(--transition), background var(--transition);
}

.token-card:hover {
  transform: translateY(-3px);
  background: var(--surface-elevated-hover);
  box-shadow: var(--shadow-sm);
}

.token-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.token-name {
  display: grid;
  gap: 0.1rem;
}

.token-symbol {
  font-weight: 800;
  color: var(--text-dark);
  font-size: 1rem;
}

.token-full {
  font-size: 0.8rem;
  color: var(--muted);
}

.token-balance {
  text-align: right;
}

.token-amount {
  font-weight: 700;
  color: var(--text-dark);
}

.token-value {
  font-size: 0.85rem;
  color: var(--muted);
}

.token-change {
  font-size: 0.8rem;
  font-weight: 700;
}

.token-change.up {
  color: var(--primary);
}

.token-change.down {
  color: #ef4444;
}

.sparkline {
  width: 100%;
  height: 40px;
}

/* Address book */
.address-book,
.staking-card,
.security-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.75rem;
  display: grid;
  gap: 1.25rem;
}

.contact-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.contact-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  font-weight: 700;
  cursor: pointer;
  transition: transform var(--transition), background var(--transition), color var(--transition);
}

.contact-chip:hover,
.contact-chip:focus-visible {
  transform: translateY(-2px);
  background: var(--primary-light);
  color: var(--primary);
  outline: none;
}

.contact-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.9rem;
}

/* Staking */
.staking-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  color: #0f1214;
}

.staking-card .section-title,
.staking-card strong {
  color: #0f1214;
}

.staking-card p {
  color: rgba(15, 18, 20, 0.85);
  max-width: 420px;
}

.staking-card .primary-cta {
  background: #0f1214;
  color: var(--text);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
}

.staking-card .primary-cta:hover {
  background: #181b20;
}

/* Security panel */
.security-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.security-card {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.toggle-info {
  display: grid;
  gap: 0.15rem;
}

.toggle-label {
  font-weight: 700;
  color: var(--text-dark);
}

.toggle-desc {
  font-size: 0.85rem;
  color: var(--muted);
}

.switch {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 999px;
  background: var(--surface-strong);
  border: 1px solid var(--border);
  transition: background var(--transition);
}

.switch[aria-pressed="true"] {
  background: var(--primary);
}

.switch-track {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  position: relative;
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform var(--transition);
}

.switch[aria-pressed="true"] .switch-thumb {
  transform: translateX(20px);
}

/* QR code */
.qr-code {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  background: #fff;
  border-radius: var(--radius-xs);
  padding: 0.75rem;
  display: grid;
  place-items: center;
}

.qr-code svg {
  width: 100%;
  height: 100%;
}

/* Responsive */
@media (max-width: 640px) {
  .token-list {
    grid-template-columns: 1fr;
  }

  .staking-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .staking-card .primary-cta {
    width: 100%;
    justify-content: center;
  }

  .security-panel {
    grid-template-columns: 1fr;
  }
}
'''

text = text.replace('/* -------------------------------------------------------------------------- */\n/*  Utility classes                                                           */\n/* -------------------------------------------------------------------------- */', new_css + '/* -------------------------------------------------------------------------- */\n/*  Utility classes                                                           */\n/* -------------------------------------------------------------------------- */')

style.write_text(text)
print('style.css updated')
