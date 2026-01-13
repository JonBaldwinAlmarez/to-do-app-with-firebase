import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
	getDatabase,
	ref,
	push,
	onValue,
	remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
	databaseURL:
		"https://to-do-app-483f0-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const toDoListInDb = ref(database, "toDoList");

const input_field = document.getElementById("input-field");
const add_button = document.getElementById("add-button");
const to_do_list = document.getElementById("todo-list");
const errorMessage = document.getElementById("error-message");

let existingTasks = []; // <-- this will store all task values

onValue(toDoListInDb, function (snapshot) {
	if (snapshot.exists()) {
		let itemsArray = Object.entries(snapshot.val() || {});
		clearToDoList(); // Clear the list before appending items

		existingTasks = []; // reset the array

		for (let i = 0; i < itemsArray.length; i++) {
			let currentItem = itemsArray[i];
			let currentItemKey = currentItem[0];
			let currentItemValue = currentItem[1];

			appendToDoList(currentItem);
			// Add task value to local array
			existingTasks.push(currentItemValue.toLowerCase().trim());
		}
		// console.log(existingTasks);
	} else {
		to_do_list.innerHTML = "No To do";
		existingTasks = []; // reset the array if no tasks
	}
});

add_button.addEventListener("click", () => {
	let inputFieldValue = input_field.value.trim(); // trim whitespace
	let normalizedInput = inputFieldValue.toLowerCase(); // normalize input for comparison

	input_field.classList.remove("error"); // remove error styling
	errorMessage.textContent = ""; // clear previous error message

	if (!inputFieldValue) {
		errorMessage.textContent = "Please enter a task.";
		return;
	}
	if (existingTasks.includes(normalizedInput)) {
		errorMessage.textContent = "This task already exists.";

		input_field.classList.add("error"); // add error styling
		autoClearError();
		clearInputField();

		return;
	}

	push(toDoListInDb, inputFieldValue); // Push the original input value
	clearInputField();

	// Clear any previous error
	errorMessage.textContent = "";
});

function autoClearError() {
	setTimeout(() => {
		errorMessage.textContent = "";
		input_field.classList.remove("error");
	}, 3000); // Clears after 3 seconds
}

function clearToDoList() {
	to_do_list.innerHTML = "";
}

function clearInputField() {
	input_field.value = "";
}

function appendToDoList(item) {
	let itemID = item[0];
	let itemValue = item[1];
	let li = document.createElement("li");
	li.textContent = itemValue;

	li.addEventListener("click", function () {
		let exactLocationOfItemInDb = ref(database, `toDoList/${itemID}`);
		remove(exactLocationOfItemInDb);
	});

	to_do_list.appendChild(li);
}

function deleteItem(itemID) {
	let exactLocationOfItemInDb = ref(database, `toDoList/${itemID}`);
	exactLocationOfItemInDb.addEventListener("dblclick", function () {
		remove(exactLocationOfItemInDb);
	});
}
