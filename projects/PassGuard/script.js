const modalOverlay = document.getElementById('modalOverlay');
const addBtn = document.getElementById('addBtn');
const closeModal = document.getElementById('closeModal');
const passwordForm = document.getElementById('passwordForm');
const passwordGrid = document.getElementById('passwordGrid');
const searchInput = document.getElementById('searchInput');
const itemCount = document.getElementById('itemCount');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const passwordInput = document.getElementById('password');
const togglePass = document.getElementById('togglePass');

let passwords = JSON.parse(localStorage.getItem('passguard_data')) || [];

// Initialize
function init() {
    renderPasswords(passwords);
}

// Render Cards
function renderPasswords(data) {
    passwordGrid.innerHTML = '';
    itemCount.innerText = `${data.length} Items`;

    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'pass-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="service-icon">${item.service[0].toUpperCase()}</div>
                <div class="card-actions">
                    <button class="icon-btn" onclick="copyToClipboard('${item.password}', this)"><i class="fa-solid fa-copy"></i></button>
                    <button class="icon-btn" onclick="deletePassword(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="service-name">${item.service}</div>
            <div class="user-email">${item.username}</div>
            <div class="pass-display">
                <span>${'*'.repeat(10)}</span>
                <button class="icon-btn" onclick="toggleVisibility(this, '${item.password}')"><i class="fa-solid fa-eye"></i></button>
            </div>
        `;
        passwordGrid.appendChild(card);
    });
}

// Modal Toggle
addBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    passwordForm.reset();
    resetStrengthMeter();
});

// Add New Password
passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newEntry = {
        service: document.getElementById('serviceName').value,
        username: document.getElementById('username').value,
        password: passwordInput.value
    };

    passwords.push(newEntry);
    localStorage.setItem('passguard_data', JSON.stringify(passwords));
    
    renderPasswords(passwords);
    modalOverlay.style.display = 'none';
    passwordForm.reset();
    resetStrengthMeter();
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = passwords.filter(item => 
        item.service.toLowerCase().includes(term) || 
        item.username.toLowerCase().includes(term)
    );
    renderPasswords(filtered);
});

// Helper Functions
window.deletePassword = (index) => {
    passwords.splice(index, 1);
    localStorage.setItem('passguard_data', JSON.stringify(passwords));
    renderPasswords(passwords);
};

window.copyToClipboard = (text, btn) => {
    navigator.clipboard.writeText(text).then(() => {
        const icon = btn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        icon.style.color = '#4caf50';
        setTimeout(() => {
            icon.className = 'fa-solid fa-copy';
            icon.style.color = '';
        }, 2000);
    });
};

window.toggleVisibility = (btn, realPass) => {
    const span = btn.previousElementSibling;
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('fa-eye')) {
        span.innerText = realPass;
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        span.innerText = '*'.repeat(10);
        icon.className = 'fa-solid fa-eye';
    }
};

// Password Strength Meter
passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let strength = 0;
    
    if (val.length > 6) strength++;
    if (val.length > 10) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    const colors = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#009688'];
    const text = ['Very Weak', 'Weak', 'Good', 'Strong', 'Very Secure'];
    
    if (val.length === 0) {
        resetStrengthMeter();
    } else {
        const level = Math.min(strength, 4);
        strengthBar.style.width = ((level + 1) * 20) + '%';
        strengthBar.style.background = colors[level];
        strengthText.innerText = text[level];
        strengthText.style.color = colors[level];
    }
});

function resetStrengthMeter() {
    strengthBar.style.width = '0%';
    strengthText.innerText = 'Enter password';
    strengthText.style.color = '';
}

togglePass.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePass.querySelector('i').classList.toggle('fa-eye-slash');
});

init();
