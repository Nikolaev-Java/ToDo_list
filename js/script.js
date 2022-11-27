'use strict'
let taskList;
const buttonAddTask = document.querySelector(".insert-task__button");
const inputInsertTask = document.querySelector(".insert-task__input");
const buttonTrashTask = document.getElementsByClassName(".task__button-trash");
const fieldTask = document.querySelector(".task_list");
const saveButton = document.querySelector('.save__button');
const changeButton = document.querySelector(".task__button-edit");
let idTask;
const nameStorage = "tasks";
if (localStorage.getItem(nameStorage)) {
	taskList = getTaskForStorage();
	idTask = taskList.size;
	firstRenderfromSave(taskList);
} else {
	taskList = new Map();
	idTask = 0;
}
buttonAddTask.addEventListener("click", () => {
	const textTask = inputInsertTask.value;
	inputInsertTask.value = "";
	addTaskToForm(textTask, idTask);
	addTask(textTask);
});
inputInsertTask.addEventListener("keydown", (e) => {
	if (e.keyCode == 13) {
		const textTask = inputInsertTask.value;
		inputInsertTask.value = "";
		addTaskToForm(textTask, idTask);
		addTask(textTask);
	}
});
fieldTask.addEventListener("click", (e) => {
	if (e.target.closest(".task__button-trash")) {
		deleteTask(e.target);
	}
	if (e.target.closest('.task__button-edit')) {
		changeTaskOpen(e.target);
	}
});
saveButton.addEventListener('click', (e) => {
	saveTaskinStorage(taskList);
});

fieldTask.addEventListener("change", (e) => {
	if (e.target.closest(".task__input")) {
		changeCheckedFromTask(e.target);
	}
});
function addTask(text) {
	let checkbox = document.getElementById(`task-checkbox${idTask}`);
	let checked = checkbox.checked;
	taskList.set(idTask, [text, checked]);
	idTask++;
};
function addTaskToForm(text, idTask, check = false) {
	let htmlCode = `<li id = "${idTask}">
								<input type="checkbox" value="comleted" name="task-checkbox" id="task-checkbox${idTask}" class="task__input">
								<label for="task-checkbox${idTask}" class="task__label"><span>${text}</span></label>
								<input type="text" id="task-change" class="task__change">
								<i class="fa-solid fa-pen-to-square task__button-edit"></i>
								<i class="fa-solid fa-trash-can task__button-trash"></i>
						</li>`;
	const toPlace = document.querySelector('.task_list');
	toPlace.insertAdjacentHTML("afterbegin", htmlCode);
	document.getElementById(`task-checkbox${idTask}`).checked = check;
}
function changeCheckedFromTask(checkbox) {
	let id = +checkbox.closest("li").getAttribute('id');
	taskList.get(id)[1] = checkbox.checked;
	saveTaskinStorage(taskList);
}
function deleteTask(element) {
	let task = element.closest("li");
	task.remove();
	taskList.delete(+task.getAttribute('id'));
	clearStorage(nameStorage);
	saveTaskinStorage(taskList);
};
function changeTaskOpen(element) {
	let task = element.closest("li");
	task.classList.toggle("_active");
	let changeInput = task.querySelector('.task__change');
	let label = task.querySelector(`.task__label > span`);
	changeInput.focus();
	changeInput.value = label.textContent;
	changeInput.onblur = function () {
		label.textContent = this.value;
		task.classList.remove("_active");
	}
	changeInput.addEventListener("keydown", (e) => {
		if (e.keyCode == 13) {
			label.textContent = changeInput.value;
			task.classList.remove("_active");
		}
	})
};
function saveTaskinStorage(entries) {
	let entriesObject = Object.fromEntries(entries);
	localStorage.setItem(nameStorage, JSON.stringify(entriesObject));
};
function clearStorage(name) {
	localStorage.removeItem(name);
};
function getTaskForStorage() {
	let tasks = JSON.parse(localStorage.getItem(nameStorage));
	let map = new Map();
	for (const key in tasks) {
		map.set(+key, tasks[key]);
	}
	return map;
};
function firstRenderfromSave(textList) {
	textList.forEach((value, key) => {
		addTaskToForm(value[0], key, value[1]);
	});
};