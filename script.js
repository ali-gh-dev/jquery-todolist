let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let tasks_tag = $('#tasks');
let form1 = $('form');
let submit_btn = $('form button[type="submit"]');
let old_task = '';

// Functions
function refresh_tasks() {
    // hide/show "search field" & "clear all button"
    if (tasks.length === 0) {
        $('#search, #clear-all').css('display','none');
    } else {
        $('#search, #clear-all').css('display','block');
    }


    tasks_tag.html("");
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
        tasks_tag.append(new_tag);
    }

}

function create_task(ev) {
    ev.preventDefault();
    // let task_text = new FormData(form1).get('task-text').trim();
    let task_text = $('#task-text').val().trim();


    if (task_text.length === 0) {
        $('#input-invalid').text('کادر خالی است');
    } else if (tasks.includes(task_text)) {
        $('#input-invalid').text('متن وارد شده تکراری است');
    } else {

        if (submit_btn.hasClass('edit-btn')) {
            // edit task
            $('#input-invalid').text("");
            let index = tasks.indexOf(old_task);
            tasks[index] = task_text;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            $('#task-text').val("");
            refresh_tasks();
            location.reload();

        } else {
            // create new task
            $('#input-invalid').text("");
            tasks.push(task_text);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            $('#task-text').val("");
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


function filter2(ev) {
    let searched_txt = $(ev.target).val().toLowerCase();

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
            $('#tasks').html("");
            $('#not-found').text('موردی یافت نشد !!!');
        } else {
            $('#not-found').text('');
            tasks = filtered_tasks;
            refresh_tasks();
        }
    }

}

function edit_task(ev) {
    if ($(ev.target).hasClass('bi-pencil')) {
        let old, task_input, current_card, other_cards;

        old = $(ev.target).parents('.card').find('.card-text').text().trim();

        old_task = old;

        task_input = $('#task-text');
        task_input.val(old);
        task_input.select();

        other_cards = $('#tasks .card');
        other_cards.removeClass('edit-mode');
        current_card = $(ev.target).parents('.card');
        current_card.addClass('edit-mode');

        submit_btn.text('ویرایش');
        submit_btn.removeClass('btn-success').addClass('btn-warning edit-btn');
    }
}


// Events
$(document).ready(refresh_tasks);
form1.submit(create_task);
tasks_tag.click(function (ev){
    delete_task(ev);
    edit_task(ev);
});
$('#clear-all').click(clear_all);
// document.getElementById('search').addEventListener('input', filter2);
$('#search').change(filter2);
