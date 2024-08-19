document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', modifyTask);

function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(taskText));
    li.appendChild(createButton('edit'));
    li.appendChild(createButton('delete'));

    taskList.appendChild(li);
    saveTask(taskText);
    taskInput.value = '';
}

function createButton(type) {
    const button = document.createElement('button');
    button.className = type;
    button.appendChild(document.createTextNode(type.charAt(0).toUpperCase() + type.slice(1)));
    return button;
}

function modifyTask(e) {
    if (e.target.classList.contains('delete')) {
        const li = e.target.parentElement;
        removeTask(li);
        taskList.removeChild(li);
    } else if (e.target.classList.contains('edit')) {
        const li = e.target.parentElement;
        taskInput.value = li.firstChild.textContent;
        removeTask(li);
        taskList.removeChild(li);
    }
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskElement) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== taskElement.firstChild.textContent);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(task));
        li.appendChild(createButton('edit'));
        li.appendChild(createButton('delete'));
        taskList.appendChild(li);
    });
}
