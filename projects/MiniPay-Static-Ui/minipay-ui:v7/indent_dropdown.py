import re
from pathlib import Path

html = Path('/home/user/uploads/index.html')
text = html.read_text()

indented_dropdown = '''                    <div class='notification-dropdown hidden' id='notification-dropdown' role='region' aria-label='Notifications'>
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
text = re.sub(r"(<button class=[^>]+notification-button[^>]*>.*?</button>)\s*<div class='notification-dropdown hidden'[^>]*>.*?</div>", '\\1\n' + indented_dropdown, text, flags=re.DOTALL, count=1)

indented_network = '''                    <button class='network-switch' type='button' id='network-switch' aria-label='Switch network'>
                        <span class='network-label'>Network</span>
                        <span class='network-value' id='network-value'>Celo</span>
                        <span class='network-icon' aria-hidden='true'>🌐</span>
                    </button>'''
text = re.sub(r"(<button class=[^>]+copy-id[^>]*>.*?</button>)\s*<button class='network-switch'[^>]*>.*?</button>", '\\1\n' + indented_network, text, flags=re.DOTALL, count=1)

html.write_text(text)
print('dropdown and network switch indented')
