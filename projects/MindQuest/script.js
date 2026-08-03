// DOM Elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const optionsContainer = document.getElementById('optionsContainer');
const questionText = document.getElementById('questionText');
const currentQuestionNum = document.getElementById('currentQuestionNum');
const progressBar = document.getElementById('progressBar');
const timerText = document.getElementById('timer');
const finalScore = document.getElementById('finalScore');
const themeToggle = document.getElementById('themeToggle');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const leaderboardList = document.getElementById('leaderboardList');
const saveScoreBtn = document.getElementById('saveScoreBtn');

// State
let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let canAnswer = true;

// --- Theme Management ---
const html = document.documentElement;
let currentTheme = localStorage.getItem('mindquest_theme') || 'light';

function updateTheme() {
    html.setAttribute('data-theme', currentTheme);
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('mindquest_theme', currentTheme);
    updateTheme();
});

// Initial Theme apply
updateTheme();

// --- Quiz Logic ---
startBtn.onclick = startQuiz;
restartBtn.onclick = () => location.reload();
leaderboardBtn.onclick = openLeaderboard;
closeModal.onclick = () => modalOverlay.style.display = 'none';
saveScoreBtn.onclick = saveScore;

async function startQuiz() {
    const category = document.getElementById('categorySelect').value;
    startBtn.innerText = "Loading Questions...";
    startBtn.disabled = true;

    try {
        const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`);
        const data = await res.json();
        questions = data.results;
        
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        showQuestion();
    } catch (err) {
        alert("Failed to load questions. Please try again.");
        startBtn.innerText = "Start Quest";
        startBtn.disabled = false;
    }
}

function showQuestion() {
    resetState();
    const q = questions[currentIndex];
    
    // Decode HTML entities
    const decodedQ = decodeHTML(q.question);
    questionText.innerText = decodedQ;
    currentQuestionNum.innerText = currentIndex + 1;
    progressBar.style.width = `${((currentIndex + 1) / 10) * 100}%`;

    // Mix correct and incorrect answers
    const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = decodeHTML(answer);
        btn.onclick = () => selectAnswer(btn, answer === q.correct_answer);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function resetState() {
    canAnswer = true;
    timeLeft = 15;
    timerText.innerText = timeLeft;
    optionsContainer.innerHTML = '';
    clearInterval(timer);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoNext();
        }
    }, 1000);
}

function selectAnswer(btn, isCorrect) {
    if (!canAnswer) return;
    canAnswer = false;
    clearInterval(timer);

    const q = questions[currentIndex];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');

    if (isCorrect) {
        btn.classList.add('correct');
        score += (timeLeft * 10) + 100; // Bonus for speed
    } else {
        btn.classList.add('wrong');
        // Highlight correct one
        allBtns.forEach(b => {
            if (b.innerText === decodeHTML(q.correct_answer)) b.classList.add('correct');
        });
    }

    allBtns.forEach(b => b.classList.add('disabled'));

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function autoNext() {
    canAnswer = false;
    const q = questions[currentIndex];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    
    allBtns.forEach(b => {
        if (b.innerText === decodeHTML(q.correct_answer)) b.classList.add('correct');
        b.classList.add('disabled');
    });

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScore.innerText = score;
    
    const msg = score > 1500 ? "Mastermind! Unstoppable knowledge." : 
                score > 800 ? "Great job! You're a true scholar." : "Nice try! Keep questing.";
    document.getElementById('resultMsg').innerText = msg;
}

// Helpers
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function saveScore() {
    const nickname = prompt("Enter a nickname for the leaderboard:");
    if (!nickname) return;

    const history = JSON.parse(localStorage.getItem('mindquest_scores')) || [];
    history.push({ name: nickname, score: score, date: new Date().toLocaleDateString() });
    history.sort((a, b) => b.score - a.score);
    localStorage.setItem('mindquest_scores', JSON.stringify(history.slice(0, 5))); // Keep top 5
    
    saveScoreBtn.disabled = true;
    saveScoreBtn.innerText = "Saved!";
    openLeaderboard();
}

function openLeaderboard() {
    const history = JSON.parse(localStorage.getItem('mindquest_scores')) || [];
    leaderboardList.innerHTML = history.length ? '' : '<p style="text-align:center; color:var(--text-muted);">No scores yet!</p>';
    
    history.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'leaderboard-item';
        el.innerHTML = `<span>#${index+1} ${item.name}</span> <span>${item.score}</span>`;
        leaderboardList.appendChild(el);
    });
    
    modalOverlay.style.display = 'flex';
}

window.onclick = (e) => { if (e.target === modalOverlay) modalOverlay.style.display = 'none'; };
