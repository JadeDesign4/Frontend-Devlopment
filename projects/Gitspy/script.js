// DOM Elements
const userInput = document.getElementById('userInput');
const searchBtn = document.getElementById('searchBtn');
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const profileSection = document.getElementById('profileSection');
const repoSection = document.getElementById('repoSection');
const loader = document.getElementById('loader');
const errorState = document.getElementById('errorState');
const emptyState = document.getElementById('emptyState');
const repoList = document.getElementById('repoList');

// Theme Management
let currentTheme = localStorage.getItem('gitspy_theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeUI();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('gitspy_theme', currentTheme);
    updateThemeUI();
});

function updateThemeUI() {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// Search Logic
searchBtn.addEventListener('click', () => {
    const username = userInput.value.trim();
    if (username) {
        fetchUserData(username);
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const username = userInput.value.trim();
        if (username) fetchUserData(username);
    }
});

async function fetchUserData(username) {
    // UI reset
    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');
    profileSection.classList.add('hidden');
    repoSection.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        
        if (!userRes.ok) throw new Error('User not found');
        
        const userData = await userRes.json();
        
        const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repoData = await repoRes.json();

        displayUser(userData);
        displayRepos(repoData);

        loader.classList.add('hidden');
        profileSection.classList.remove('hidden');
        repoSection.classList.remove('hidden');

    } catch (err) {
        loader.classList.add('hidden');
        errorState.classList.remove('hidden');
    }
}

function displayUser(user) {
    document.getElementById('avatar').src = user.avatar_url;
    document.getElementById('name').innerText = user.name || user.login;
    document.getElementById('username').innerText = `@${user.login}`;
    document.getElementById('username').href = user.html_url;
    document.getElementById('bio').innerText = user.bio || 'This profile has no bio.';
    
    document.getElementById('location').innerText = user.location || 'Not Available';
    
    const blog = document.getElementById('blog');
    if (user.blog) {
        blog.innerText = user.blog;
        blog.href = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
        blog.parentElement.style.display = 'flex';
    } else {
        blog.parentElement.style.display = 'none';
    }

    const twitter = document.getElementById('twitter');
    if (user.twitter_username) {
        twitter.innerText = `@${user.twitter_username}`;
        twitter.href = `https://twitter.com/${user.twitter_username}`;
        twitter.parentElement.style.display = 'flex';
    } else {
        twitter.parentElement.style.display = 'none';
    }

    document.getElementById('reposCount').innerText = user.public_repos;
    document.getElementById('followersCount').innerText = user.followers;
    document.getElementById('followingCount').innerText = user.following;
}

function displayRepos(repos) {
    repoList.innerHTML = '';
    
    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `
            <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
            <p>${repo.description || 'No description provided for this repository.'}</p>
            <div class="repo-meta">
                <span><i class="fa-solid fa-code"></i> ${repo.language || 'Plain Text'}</span>
                <span><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
            </div>
        `;
        repoList.appendChild(card);
    });
}
