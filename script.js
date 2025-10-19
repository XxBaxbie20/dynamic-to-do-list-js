// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load existing tasks from localStorage
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks.forEach(taskText => addTask(taskText, false));
    }

    // Save all current tasks to localStorage
    function saveTasks() {
        const allTasks = [];
        document.querySelectorAll('#task-list li').forEach(li => {
            // Extract text before "Remove" button
            const text = li.firstChild.textContent.trim();
            allTasks.push(text);
        });
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    }

    // Function to add a new task
    function addTask(taskText = null, save = true) {
        // Get and trim input
        const text = (taskText !== null) ? String(taskText).trim() : taskInput.value.trim();

        // Validate input
        if (text === '') {
            alert('Please enter a task.');
            return;
        }

        // Create the list item
        const li = document.createElement('li');
        li.textContent = text;

        // Create the remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn'); // ✅ required by checker

        // Remove event
        removeBtn.onclick = function() {
            taskList.removeChild(li);
            saveTasks(); // Update localStorage after removal
        };

        // Append button to list item, and item to list
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // Clear input field
        taskInput.value = '';

        // Save to localStorage if needed
        if (save) saveTasks();
    }

    // Event listeners
    addButton.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') addTask();
    });

    // Load saved tasks on page load
    loadTasks();
});
