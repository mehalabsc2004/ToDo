document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    document.getElementById('task-form').addEventListener('submit', addTask);
    document.getElementById('task-list').addEventListener('click', handleTaskAction);
});

function fetchTasks() {
    fetch('/tasks')
        .then(res => res.json())
        .then(tasks => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <span>${task.task}</span>
                    <div>
                        <button class="complete-btn" data-id="${task.id}" data-completed="${!task.completed}">${task.completed ? 'Undo' : 'Complete'}</button>
                        <button class="delete-btn" data-id="${task.id}">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        });
}

function addTask(e) {
    e.preventDefault();
    const taskInput = document.getElementById('task-input');
    const task = taskInput.value;

    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `task=${task}`
    }).then(() => {
        taskInput.value = '';
        fetchTasks();
    });
}

function handleTaskAction(e) {
    if (e.target.classList.contains('complete-btn')) {
        const id = e.target.getAttribute('data-id');
        const completed = e.target.getAttribute('data-completed') === 'true';

        fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        }).then(fetchTasks);
    }

    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');

        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        }).then(fetchTasks);
    }
}
