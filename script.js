document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Load initial tasks
    renderTasks();

    // Add new task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());

    function addTask() {
        const text = taskInput.value.trim();
        const priority = document.getElementById('prioritySelect').value;
        
        if (text) {
            tasks.push({
                id: Date.now(),
                text: text,
                priority: priority,
                completed: false
            });
            taskInput.value = '';
            saveAndRender();
        }
    }

    // Toggle task completion
    function toggleTask(id) {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;
        saveAndRender();
    }

    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }

    // Save and render tasks
    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Display tasks
    function renderTasks() {
        taskList.innerHTML = tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <span class="task-priority priority-${task.priority}">
                    ${task.priority.toUpperCase()}
                </span>
                <button onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
    }

    // Clear buttons functionality
    document.getElementById('clearCompletedBtn').addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveAndRender();
    });

    document.getElementById('clearAllBtn').addEventListener('click', () => {
        if (confirm('Clear all tasks?')) {
            tasks = [];
            saveAndRender();
        }
    });

    document.getElementById('saveAllBtn').addEventListener('click', () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        alert('Tasks saved!');
    });
});

// Add inline CSS for simplicity
const style = document.createElement('style');
style.textContent = `
    .task-item { 
        display: flex; 
        align-items: center;
        padding: 10px;
        margin: 5px 0;
        background: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .task-priority {
        padding: 2px 8px;
        border-radius: 10px;
        color: white;
        font-size: 0.8em;
    }
    .priority-high { background: #ff5252; }
    .priority-medium { background: #ffb74d; }
    .priority-low { background: #66bb6a; }
    .completed { opacity: 0.6; text-decoration: line-through; }
`;
document.head.appendChild(style);
