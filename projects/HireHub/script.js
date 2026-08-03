const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const jobList = document.getElementById('jobList');
const resultsCount = document.getElementById('resultsCount');
const savedCountBadge = document.getElementById('savedCount');
const findJobsBtn = document.getElementById('findJobsBtn');
const savedJobsBtn = document.getElementById('savedJobsBtn');
const listingsTitle = document.getElementById('listingsTitle');

const jobTitleSearch = document.getElementById('jobTitleSearch');
const locationSearch = document.getElementById('locationSearch');
const searchBtn = document.getElementById('searchBtn');

const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');

// Mock Data
const jobs = [
    { id: 1, title: "Senior Frontend Engineer", company: "TechFlow", location: "San Francisco, CA", type: "Full-time", salary: 140000, exp: "Senior", logo: "TF", posted: "2d ago", desc: "We are looking for a senior frontend engineer with expert knowledge in React and CSS..." },
    { id: 2, title: "Product Designer", company: "Creative Minds", location: "Remote", type: "Remote", salary: 95000, exp: "Mid", logo: "CM", posted: "1d ago", desc: "Join our remote team to shape the future of digital products. Experience in Figma required." },
    { id: 3, title: "Junior Web Developer", company: "StartupX", location: "New York, NY", type: "Full-time", salary: 65000, exp: "Junior", logo: "SX", posted: "5h ago", desc: "Great opportunity for a junior developer to learn from the best. Knowledge of HTML/CSS/JS is a must." },
    { id: 4, title: "Backend Architect", company: "DataNode", location: "Remote", type: "Remote", salary: 160000, exp: "Senior", logo: "DN", posted: "3d ago", desc: "Help us build scalable backend services using Node.js and AWS." },
    { id: 5, title: "Marketing Intern", company: "Growthify", location: "Austin, TX", type: "Internship", salary: 30000, exp: "Junior", logo: "GY", posted: "1w ago", desc: "Learn the ropes of digital marketing in a fast-paced environment." },
    { id: 6, title: "Fullstack Developer", company: "Nexus", location: "Seattle, WA", type: "Contract", salary: 110000, exp: "Mid", logo: "NX", posted: "4d ago", desc: "6-month contract for a fullstack wizard." }
];

let savedJobs = JSON.parse(localStorage.getItem('hirehub_saved')) || [];
let currentView = 'find'; // 'find' or 'saved'

// Initialization
function init() {
    renderJobs(jobs);
    updateSavedCount();
}

// Theme Management
let currentTheme = localStorage.getItem('hirehub_theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('hirehub_theme', currentTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// Rendering
function renderJobs(data) {
    jobList.innerHTML = '';
    resultsCount.innerText = `${data.length} jobs found`;

    if (data.length === 0) {
        jobList.innerHTML = '<p style="text-align:center; padding: 2rem; color: var(--text-muted);">No jobs found matching your criteria.</p>';
        return;
    }

    data.forEach(job => {
        const isSaved = savedJobs.some(s => s.id === job.id);
        const card = document.createElement('div');
        card.className = 'job-card';
        card.onclick = () => showJobDetail(job);
        
        card.innerHTML = `
            <div class="card-top">
                <div class="comp-info">
                    <div class="comp-logo">${job.logo}</div>
                    <div>
                        <div class="job-title">${job.title}</div>
                        <div class="comp-name">${job.company} • ${job.location}</div>
                    </div>
                </div>
                <button class="btn-save ${isSaved ? 'saved' : ''}" onclick="toggleSave(event, ${job.id})">
                    <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
                </button>
            </div>
            <div class="job-tags">
                <span class="tag">${job.type}</span>
                <span class="tag">${job.exp}</span>
                <span class="tag">${job.company}</span>
            </div>
            <div class="card-bottom">
                <div class="salary">$${job.salary.toLocaleString()}/yr</div>
                <div class="posted-date">Posted ${job.posted}</div>
            </div>
        `;
        jobList.appendChild(card);
    });
}

// Search and Filter Logic
function applyFilters() {
    const titleTerm = jobTitleSearch.value.toLowerCase();
    const locTerm = locationSearch.value.toLowerCase();
    
    const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
    const minSalary = document.getElementById('salaryFilter').value;
    const expLevel = document.getElementById('expFilter').value;

    let sourceData = currentView === 'find' ? jobs : savedJobs;

    const filtered = sourceData.filter(job => {
        const matchesTitle = job.title.toLowerCase().includes(titleTerm) || job.company.toLowerCase().includes(titleTerm);
        const matchesLoc = job.location.toLowerCase().includes(locTerm);
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
        const matchesSalary = minSalary === 'all' || job.salary >= parseInt(minSalary);
        const matchesExp = expLevel === 'all' || job.exp === expLevel;

        return matchesTitle && matchesLoc && matchesType && matchesSalary && matchesExp;
    });

    renderJobs(filtered);
}

searchBtn.addEventListener('click', applyFilters);
document.querySelectorAll('.type-filter, #salaryFilter, #expFilter').forEach(el => {
    el.addEventListener('change', applyFilters);
});

// Save Functionality
function toggleSave(e, id) {
    e.stopPropagation();
    const job = jobs.find(j => j.id === id);
    const index = savedJobs.findIndex(s => s.id === id);

    if (index === -1) {
        savedJobs.push(job);
    } else {
        savedJobs.splice(index, 1);
    }

    localStorage.setItem('hirehub_saved', JSON.stringify(savedJobs));
    updateSavedCount();
    
    if (currentView === 'saved') {
        renderJobs(savedJobs);
    } else {
        // Just re-render to update the icon
        const btn = e.currentTarget;
        const icon = btn.querySelector('i');
        btn.classList.toggle('saved');
        icon.classList.toggle('solid');
        icon.classList.toggle('regular');
    }
}

function updateSavedCount() {
    savedCountBadge.innerText = savedJobs.length;
}

// Tab Switching
findJobsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentView = 'find';
    findJobsBtn.classList.add('active');
    savedJobsBtn.classList.remove('active');
    listingsTitle.innerText = "Featured Jobs";
    renderJobs(jobs);
});

savedJobsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentView = 'saved';
    savedJobsBtn.classList.add('active');
    findJobsBtn.classList.remove('active');
    listingsTitle.innerText = "Saved Jobs";
    renderJobs(savedJobs);
});

// Modal
function showJobDetail(job) {
    modalContent.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:2rem;">
            <div style="display:flex; gap:1.5rem; align-items:center;">
                <div class="comp-logo" style="width:64px; height:64px; font-size:1.5rem;">${job.logo}</div>
                <div>
                    <h2 style="font-size:1.8rem; margin-bottom:0.5rem;">${job.title}</h2>
                    <p style="color:var(--text-muted); font-size:1.1rem;">${job.company} • ${job.location}</p>
                </div>
            </div>
            <button onclick="closeModalFunc()" style="background:none; border:none; font-size:2rem; cursor:pointer; color:var(--text-muted);">&times;</button>
        </div>
        <div style="display:flex; gap:1rem; margin-bottom:2rem;">
            <span class="tag" style="font-size:0.9rem; padding:8px 16px;">${job.type}</span>
            <span class="tag" style="font-size:0.9rem; padding:8px 16px;">${job.exp} Level</span>
            <span class="tag" style="font-size:0.9rem; padding:8px 16px; background:var(--primary); color:white;">$${job.salary.toLocaleString()}</span>
        </div>
        <div style="margin-bottom:2.5rem;">
            <h3 style="margin-bottom:1rem;">Description</h3>
            <p style="line-height:1.7; color:var(--text-muted);">${job.desc} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <button class="btn-primary" style="width:100%; padding:1.2rem; font-size:1.1rem;" onclick="alert('Application Sent!')">Apply Now</button>
    `;
    modalOverlay.style.display = 'flex';
}

window.closeModalFunc = () => {
    modalOverlay.style.display = 'none';
};

window.onclick = (e) => {
    if (e.target === modalOverlay) closeModalFunc();
};

init();
