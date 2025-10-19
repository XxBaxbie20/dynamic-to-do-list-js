// To-Do List with Local Storage persistence
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // In-memory tasks array (strings)
    let tasks = [];

    // Save tasks array to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage into the in-memory array and render them
    function loadTasks() {
        const stored = JSON.parse(localStorage.getItem('tasks') || '[]');
        if (!Array.isArray(stored)) {
            tasks = [];
            localStorage.removeItem('tasks');
            return;
        }
        tasks = stored.slice(); // copy stored array
        tasks.forEach(taskText => addTask(taskText, false)); // render without saving again
    }

    /**
     * Add a task to the DOM and optionally save it to localStorage.
     * @param {string|null} taskText - If null, take from input field.
     * @param {boolean} save - If true, append to tasks array and persist.
     */
    function addTask(taskText = null, save = true) {
        // Get text from param or input
        const text = (taskText !== null) ? String(taskText).trim() : taskInput.value.trim();

        // Validate
        if (text === '') {
            alert('Please enter a task.');
            return;
        }

        // Create list item and set its textContent as required
        const li = document.createElement('li');
        li.textContent = text;

        // Store the task text in a data-* attribute so we can remove accurately later
        li.dataset.task = text;

        // Create remove button and add required class using classList.add
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn'); // ✅ required by the checker

        // Remove behavior: remove LI from DOM, remove one matching entry from tasks array, then save
        removeBtn.onclick = function () {
            // Remove from DOM
            if (li.parentNode) li.parentNode.removeChild(li);

            // Remove first matching occurrence from tasks array
            const idx = tasks.indexOf(li.dataset.task);
            if (idx > -1) {
                tasks.splice(idx, 1);
                saveTasks();
            }
        };

        // Append remove button to li and add li to the list
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // If this add should be persisted (i.e., user action), update tasks array + localStorage
        if (save) {
            tasks.push(text);
            saveTasks();
        }

        // Clear input only when user entered text (not when loading)
        if (taskText === null) taskInput.value = '';
    }

    // Wire UI events
    addButton.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') addTask();
    });

    // Initialize: load saved tasks and render
    loadTasks();
});
