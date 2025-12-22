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

onValue(toDoListInDb, function (snapshot) {
	if (snapshot.exists()) {
		let itemsArray = Object.entries(snapshot.val() || {});
		clearToDoList(); // Clear the list before appending items

		for (let i = 0; i < itemsArray.length; i++) {
			let currentItem = itemsArray[i];
			let currentItemKey = currentItem[0];
			let currentItemValue = currentItem[1];

			appendToDoList(currentItem);
		}
	} else {
		to_do_list.innerHTML = "No To do";
	}
});

add_button.addEventListener("click", () => {
	let inputFieldValue = input_field.value;
	push(toDoListInDb, inputFieldValue);
	clearInputField();
});

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
	exactLocationOfItemInDb.addEventListener("dbclick", function () {
		remove(exactLocationOfItemInDb);
	});
}
