const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModal = document.getElementById('closeModal');
const taskForm = document.getElementById('taskForm');

// Columns
const columns = {
    todo: document.getElementById('todo-list'),
    inprogress: document.getElementById('inprogress-list'),
    done: document.getElementById('done-list')
};

const counts = {
    todo: document.getElementById('todo-count'),
    inprogress: document.getElementById('inprogress-count'),
    done: document.getElementById('done-count')
};

let tasks = JSON.parse(localStorage.getItem('taskflow_data')) || [];

// Initialize
function init() {
    renderTasks();
}

// Render all tasks from local storage
function renderTasks() {
    // Clear lists
    Object.values(columns).forEach(list => list.innerHTML = '');
    
    // Group and render
    const statusCounts = { todo: 0, inprogress: 0, done: 0 };
    
    tasks.forEach(task => {
        const taskEl = createTaskElement(task);
        columns[task.status].appendChild(taskEl);
        statusCounts[task.status]++;
    });

    // Update counts
    Object.keys(counts).forEach(key => {
        counts[key].innerText = statusCounts[key];
    });
}

function createTaskElement(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.id = `task-${task.id}`;
    card.dataset.id = task.id;

    card.innerHTML = `
        <div class="task-header">
            <span class="priority-tag priority-${task.priority}">${task.priority}</span>
            <button class="btn-delete" onclick="deleteTask(${task.id})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
        <h3>${task.title}</h3>
        <p>${task.desc || ''}</p>
    `;

    // Drag events
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    return card;
}

// Drag & Drop Logic
window.allowDrop = (e) => {
    e.preventDefault();
};

window.drop = (e) => {
    e.preventDefault();
    const draggingCard = document.querySelector('.dragging');
    const taskId = draggingCard.dataset.id;
    const newStatus = e.currentTarget.id; // e.g., 'todo', 'inprogress'

    // Update state
    const taskIndex = tasks.findIndex(t => t.id == taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        saveAndRender();
    }
};

// Task Operations
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTask = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        desc: document.getElementById('taskDesc').value,
        priority: document.getElementById('taskPriority').value,
        status: 'todo'
    };

    tasks.push(newTask);
    saveAndRender();
    
    modalOverlay.style.display = 'none';
    taskForm.reset();
});

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
};

function saveAndRender() {
    localStorage.setItem('taskflow_data', JSON.stringify(tasks));
    renderTasks();
}

// Modal Toggle
openModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    taskForm.reset();
});

window.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
        taskForm.reset();
    }
});

init();
