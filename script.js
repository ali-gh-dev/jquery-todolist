let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let form1 = document.querySelector('form');
let submit_btn = document.querySelector('form button[type="submit"]');
let old_task = '';

// Functions
function refresh_tasks() {
    // hide/show "search field" & "clear all button"
    if (tasks.length === 0) {
        document.getElementById('search').style.display = 'none';
        document.getElementById('clear-all').style.display = 'none';
    } else {
        document.getElementById('search').style.display = 'block';
        document.getElementById('clear-all').style.display = 'block';
    }

    let tasks_tag = document.querySelector('#tasks');
    tasks_tag.innerHTML = "";
    for (let task of tasks) {
        let new_tag = `
                <div class="col">
                    <div class="card text-bg-info">
                        <div class="card-body">
                            <p class="card-text">${task}</p>
                        </div>
                        <div class="d-flex justify-content-evenly mb-1">
                            <a class="text-danger fw-bold fs-3 delete-task"><i class="bi bi-x"></i></a>
                            <a class="text-secondary fw-bold fs-4 edit-task"><i class="bi bi-pencil"></i></a>
                        </div>
                    </div>
                </div> `;
        tasks_tag.innerHTML += new_tag;
    }

}

function create_task(ev) {
    ev.preventDefault();
    // let task_text = new FormData(form1).get('task-text').trim();
    let task_text = document.querySelector('#task-text').value.trim();


    if (task_text.length === 0) {
        document.querySelector('#input-invalid').textContent = 'کادر خالی است';
    } else if (tasks.includes(task_text)) {
        document.querySelector('#input-invalid').textContent = 'متن وارد شده تکراری است';
    } else {

        if (submit_btn.classList.contains('edit-btn')) {
            // edit task
            document.querySelector('#input-invalid').textContent = '';
            let index = tasks.indexOf(old_task);
            tasks[index] = task_text;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            document.querySelector('#task-text').value = '';
            refresh_tasks();
            location.reload();

        } else {
            // create new task
            document.querySelector('#input-invalid').textContent = '';
            tasks.push(task_text);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            document.querySelector('#task-text').value = '';
            refresh_tasks();
            location.reload();
        }

    }

}

function delete_task(ev) {
    if (ev.target.classList.contains('bi-x')) {

        let task_text = ev.target.parentElement.parentElement.previousElementSibling.firstElementChild.textContent.trim();
        tasks.splice(tasks.indexOf(task_text), 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        refresh_tasks();
        location.reload();
    }

}

function clear_all() {
    // tasks = [];
    // localStorage.setItem('tasks', JSON.stringify(tasks));
    // refresh_tasks();

    localStorage.removeItem('tasks');
    location.reload();
}

// function filter(ev) {
//     if (ev.key === 'Enter') {
//         let searched_txt = ev.target.value;
//
//         if (searched_txt.length === 0) {
//             location.reload();
//         } else {
//             let filtered_tasks = [];
//             for (let task of tasks) {
//                 if (task.length >= searched_txt.length && task.substring(0, searched_txt.length) === searched_txt) {
//                     filtered_tasks.push(task);
//                 }
//             }
//             if (filtered_tasks.length === 0) {
//                 document.getElementById('not-found').innerText = 'موردی یافت نشد !!!';
//             } else {
//                 document.getElementById('not-found').innerText = '';
//                 tasks = filtered_tasks;
//                 refresh_tasks();
//             }
//         }
//     }
// }

function filter2(ev) {
    let searched_txt = ev.target.value.toLowerCase();

    if (searched_txt.length === 0) {
        location.reload();
    } else {

        let filtered_tasks = [];

        for (let task of tasks) {
            if (task.toLowerCase().includes(searched_txt)) {
                filtered_tasks.push(task);
            }
        }

        if (filtered_tasks.length === 0) {
            document.getElementById('tasks').innerHTML = "";
            document.getElementById('not-found').innerText = 'موردی یافت نشد !!!';
        } else {
            document.getElementById('not-found').innerText = '';
            tasks = filtered_tasks;
            refresh_tasks();
        }
    }

}

function edit_task(ev) {
    if (ev.target.classList.contains('bi-pencil')) {
        let old, task_input, current_card, other_cards;

        old = ev.target.parentElement.parentElement.previousElementSibling.textContent.trim();

        old_task = old;

        task_input = document.getElementById('task-text');
        task_input.value = old;
        task_input.select();

        other_cards = document.querySelectorAll('#tasks .card');
        other_cards.forEach(card => card.classList.remove('edit-mode'));
        current_card = ev.target.parentElement.parentElement.parentElement;
        current_card.classList.add('edit-mode');

        submit_btn.innerText = 'ویرایش';
        submit_btn.classList.replace('btn-success', 'btn-warning');
        submit_btn.classList.add('edit-btn');
    }
}


// Events
document.addEventListener('DOMContentLoaded', refresh_tasks);
form1.addEventListener('submit', create_task);
document.querySelector('#tasks').addEventListener('click', delete_task);
document.getElementById('clear-all').addEventListener('click', clear_all);
// document.getElementById('search').addEventListener('keydown', filter);
document.getElementById('search').addEventListener('input', filter2);
document.querySelector('#tasks').addEventListener('click', edit_task);
