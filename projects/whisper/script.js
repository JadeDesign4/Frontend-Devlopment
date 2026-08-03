const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messagesContainer');

// Theme Management
let currentTheme = localStorage.getItem('whisper_theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('whisper_theme', currentTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// Message Logic
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    
    if (text) {
        addMessage(text, 'sent');
        messageInput.value = '';
        
        // Auto-reply simulation
        setTimeout(() => {
            simulateReply(text);
        }, 1500);
    }
});

function addMessage(text, type) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    
    msgDiv.innerHTML = `
        <div class="bubble">${text}</div>
        <div class="msg-time">${time}</div>
    `;
    
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function simulateReply(userMsg) {
    const replies = [
        "That sounds interesting!",
        "Could you tell me more about it?",
        "I was thinking the exact same thing.",
        "Let's discuss this later today.",
        "Great point, I'll look into it.",
        "Whisper's new theme looks clean, doesn't it?"
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    addMessage(randomReply, 'received');
}

// Simple Chat Item Switching UI
document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
        document.body.classList.add('chat-active'); // Add mobile toggle
        document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const name = item.querySelector('.chat-name').innerText;
        document.querySelector('.active-name').innerText = name;
        document.querySelector('.active-user .avatar').innerText = item.querySelector('.avatar').innerText;
        
        // Clear and add welcome message
        messagesContainer.innerHTML = '';
        addMessage(`Welcome to your conversation with ${name}!`, 'received');
    });
});
