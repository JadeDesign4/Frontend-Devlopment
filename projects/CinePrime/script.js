// Configuration
const API_KEY = ''; // ADD YOUR TMDB API KEY HERE
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY + '&query=';
const TRENDING_URL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=' + API_KEY;

// DOM Elements
const movieGrid = document.getElementById('movieGrid');
const movieSearch = document.getElementById('movieSearch');
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const sectionTitle = document.getElementById('sectionTitle');

// Fallback Mock Data (if no API key)
const mockMovies = [
    { id: 1, title: "Interstellar", vote_average: 8.7, release_date: "2014-11-05", poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=500", overview: "The future of Earth is riddled with disasters, famines, and droughts. There is only one way to ensure mankind's survival: Interstellar travel." },
    { id: 2, title: "The Dark Knight", vote_average: 9.0, release_date: "2008-07-18", poster_path: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=500", overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham." },
    { id: 3, title: "Inception", vote_average: 8.8, release_date: "2010-07-16", poster_path: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=500", overview: "A thief who steals corporate secrets through the use of dream-sharing technology." },
    { id: 4, title: "Blade Runner 2049", vote_average: 8.0, release_date: "2017-10-06", poster_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=500", overview: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard." },
    { id: 5, title: "Dune", vote_average: 8.1, release_date: "2021-10-22", poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=500", overview: "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset." }
];

// Initialize
function init() {
    if (API_KEY) {
        getMovies(TRENDING_URL);
    } else {
        renderMovies(mockMovies);
        console.warn("CinePrime: No TMDB API Key found. Using mock data. Add your key in script.js to see live movies!");
    }
}

// Fetch Movies
async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderMovies(data.results);
    } catch (error) {
        console.error("Error fetching movies:", error);
        renderMovies(mockMovies);
    }
}

// Render Movies
function renderMovies(movies) {
    movieGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const { title, poster_path, vote_average, release_date } = movie;
        const imgUrl = API_KEY && poster_path ? IMG_PATH + poster_path : (poster_path.startsWith('http') ? poster_path : 'https://via.placeholder.com/500x750?text=No+Poster');
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => showDetail(movie);
        
        card.innerHTML = `
            <div class="poster-wrap">
                <img src="${imgUrl}" alt="${title}">
                <div class="rating-badge"><i class="fa-solid fa-star"></i> ${vote_average.toFixed(1)}</div>
            </div>
            <div class="movie-info">
                <h3>${title}</h3>
                <p>${new Date(release_date).getFullYear() || 'N/A'}</p>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}

// Search
movieSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const term = movieSearch.value;
        if (term && term !== '') {
            if (API_KEY) {
                sectionTitle.innerText = `Search results for "${term}"`;
                getMovies(SEARCH_URL + term);
            } else {
                const filtered = mockMovies.filter(m => m.title.toLowerCase().includes(term.toLowerCase()));
                sectionTitle.innerText = `Search results for "${term}" (Mock)`;
                renderMovies(filtered);
            }
        } else {
            init();
        }
    }
});

// Modal Logic
function showDetail(movie) {
    const { title, poster_path, overview, vote_average, release_date, backdrop_path } = movie;
    const imgUrl = API_KEY && poster_path ? IMG_PATH + poster_path : (poster_path.startsWith('http') ? poster_path : 'https://via.placeholder.com/500x750?text=No+Poster');
    const backdropUrl = API_KEY && backdrop_path ? 'https://image.tmdb.org/t/p/original' + backdrop_path : imgUrl;

    modalContent.innerHTML = `
        <div class="modal-body" style="display: flex; flex-direction: column;">
            <div style="height: 350px; background: url('${backdropUrl}') center/cover; position: relative;">
                <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, var(--bg-main), transparent);"></div>
            </div>
            <div style="padding: 40px; margin-top: -100px; position: relative; display: flex; gap: 30px;">
                <img src="${imgUrl}" style="width: 200px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div style="flex: 1;">
                    <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 10px;">${title}</h2>
                    <div style="display: flex; gap: 20px; color: var(--text-muted); margin-bottom: 20px;">
                        <span><i class="fa-solid fa-calendar"></i> ${release_date}</span>
                        <span style="color: #ffc107;"><i class="fa-solid fa-star"></i> ${vote_average} Rating</span>
                    </div>
                    <p style="font-size: 18px; line-height: 1.6; color: var(--text-muted); margin-bottom: 30px;">${overview}</p>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-play" style="padding: 12px 25px;"><i class="fa-solid fa-play"></i> Watch Trailer</button>
                        <button class="btn-info" style="padding: 12px 25px;"><i class="fa-solid fa-plus"></i> Add to Watchlist</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    modalOverlay.style.display = 'flex';
}

closeModal.onclick = () => modalOverlay.style.display = 'none';
window.onclick = (e) => { if (e.target === modalOverlay) modalOverlay.style.display = 'none'; };

// Theme Toggle
let currentTheme = localStorage.getItem('cineprime_theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeUI();

themeToggle.onclick = () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('cineprime_theme', currentTheme);
    updateThemeUI();
};

function updateThemeUI() {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    if (currentTheme === 'light') {
        icon.className = 'fa-solid fa-moon';
        text.innerText = 'Dark Mode';
    } else {
        icon.className = 'fa-solid fa-sun';
        text.innerText = 'Light Mode';
    }
}

// Sidebar Navigation
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        const view = link.dataset.view;
        sectionTitle.innerText = link.innerText;
        // In a real app, you'd fetch different endpoints here (e.g., /top_rated)
        if (API_KEY) {
            const endpoints = {
                home: TRENDING_URL,
                trending: TRENDING_URL,
                toprated: 'https://api.themoviedb.org/3/movie/top_rated?api_key=' + API_KEY,
                watchlist: TRENDING_URL // Just as a placeholder
            };
            getMovies(endpoints[view]);
        }
    };
});

init();
