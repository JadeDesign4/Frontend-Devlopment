const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const modalOverlay = document.getElementById('modalOverlay');
const addBtn = document.getElementById('addBtn');
const closeModal = document.getElementById('closeModal');

// State
let transactions = JSON.parse(localStorage.getItem('pennywise_data')) || [];
let chart = null;

// Theme Initialization
let currentTheme = localStorage.getItem('pennywise_theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('pennywise_theme', currentTheme);
    updateThemeIcon();
    renderChart(); // Re-render chart to update colors
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// Data Handling
function updateSummary() {
    const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => (acc += t.amount), 0)
        .toFixed(2);
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => (acc += t.amount), 0)
        .toFixed(2);

    document.getElementById('totalBalance').innerText = `$${total}`;
    document.getElementById('totalIncome').innerText = `$${income}`;
    document.getElementById('totalExpenses').innerText = `$${expenses}`;
}

function renderTransactions(filter = 'all') {
    transactionList.innerHTML = '';
    
    const filtered = transactions.filter(t => filter === 'all' || t.type === filter);
    
    filtered.sort((a, b) => b.id - a.id).forEach(t => {
        const item = document.createElement('div');
        item.className = 't-item';
        
        const icons = {
            Food: 'fa-utensils',
            Shopping: 'fa-bag-shopping',
            Housing: 'fa-house',
            Transport: 'fa-car',
            Entertainment: 'fa-gamepad',
            Work: 'fa-briefcase',
            Other: 'fa-circle-question'
        };

        item.innerHTML = `
            <div class="t-icon" style="background: ${t.type === 'income' ? 'rgba(0,184,148,0.1)' : 'rgba(214,48,49,0.1)'}; color: ${t.type === 'income' ? '#00b894' : '#d63031'}">
                <i class="fa-solid ${icons[t.category] || 'fa-dollar-sign'}"></i>
            </div>
            <div class="t-info">
                <h4>${t.desc}</h4>
                <p>${t.category} • ${new Date(t.id).toLocaleDateString()}</p>
            </div>
            <div class="t-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            </div>
        `;
        transactionList.appendChild(item);
    });
}

function renderChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    // Aggregate by category
    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chart) chart.destroy();

    const isDark = currentTheme === 'dark';

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#55efc4', '#81ecec', '#74b9ff', '#a29bfe', '#fab1a0', '#ffeaa7', '#fd79a8'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDark ? '#f8fafc' : '#2d3436',
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Event Listeners
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTransaction = {
        id: Date.now(),
        desc: document.getElementById('desc').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.querySelector('input[name="type"]:checked').value,
        category: document.getElementById('category').value
    };

    transactions.push(newTransaction);
    localStorage.setItem('pennywise_data', JSON.stringify(transactions));
    
    updateSummary();
    renderTransactions();
    renderChart();
    
    modalOverlay.style.display = 'none';
    transactionForm.reset();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTransactions(btn.dataset.filter);
    });
});

addBtn.addEventListener('click', () => modalOverlay.style.display = 'flex');
closeModal.addEventListener('click', () => modalOverlay.style.display = 'none');

// Initialize
function init() {
    updateSummary();
    renderTransactions();
    renderChart();
}

init();
