// Theme Management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

let currentTheme = localStorage.getItem('lumina_theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('lumina_theme', currentTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target); // Reveal once
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.75rem 0';
        navbar.style.background = currentTheme === 'dark' ? 'rgba(10, 10, 11, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.padding = '1.25rem 0';
        navbar.style.background = currentTheme === 'dark' ? 'rgba(10, 10, 11, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    }
});

// Smooth scroll for nav links (handled by CSS, but good to have fallback/control)
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
