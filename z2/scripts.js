"use strict"
let todoList = []; //declares a new array for Your todo list

const apiKey = env.API_KEY
const jsonURL = env.JSON_URL

let initList = function () {
    let savedList = window.localStorage.getItem("todos");
    if (savedList != null)
        todoList = JSON.parse(savedList);
    else
        //code creating a default list with 2 items

        todoList.push(
            {
                title: "Learn JS",
                description: "Create a demo application for my TODO's",
                place: "445",
                category: '',
                dueDate: new Date(2024, 10, 16)
            },
            {
                title: "Lecture test",
                description: "Quick test from the first three lectures",
                place: "F6",
                category: '',
                dueDate: new Date(2024, 10, 17)
            }
        );
}

initList();

let req = new XMLHttpRequest();

req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        console.log(req.responseText);

        // jak zobaczymy na przegladarce w konsoli, to z bina obiekt zawiera
        // record (taski) i metadane, zatem musimy dostac sie do części record
        // bo inaczej robiąc addTodo(JSON.parse(req.responseText) dodadzą się 2 puste taski
        let tasks = JSON.parse(req.responseText);
        todoList = tasks.record;
        updateTodoList();
    }
};

req.open("GET", jsonURL, true);
req.setRequestHeader("X-Master-Key", apiKey);
req.send();

let updateTodoList = function () {
    let todoListDiv =
        document.getElementById("todoListView");

    //remove all elements
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    //add all elements
    let filterInput = document.getElementById("inputSearch");
    for (let todo in todoList) {
        if (
            (filterInput.value == "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value))
        ) {
            let newElement = document.createElement("p");
            let newContent = document.createTextNode(todoList[todo].title + " " +
                todoList[todo].description);

            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";
            newDeleteButton.addEventListener("click",
                function () {
                    deleteTodo(todo);
                });

            newElement.appendChild(newContent);
            newElement.appendChild(newDeleteButton);
            todoListDiv.appendChild(newElement);
        }
    }
}

setInterval(updateTodoList, 1000);

let deleteTodo = function (index) {
    todoList.splice(index, 1);
    updateTodoList();
    updateJSONbin();
}

let addTodo = function () {
    //get the elements in the form
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");

    //get the values from the form
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);

    //create new item
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        category: '',
        dueDate: newDate
    };

    //add item to the list
    todoList.push(newTodo);
    window.localStorage.setItem("todos", JSON.stringify(todoList));
    updateJSONbin();
}

let updateJSONbin = function () {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
    };

    req.open("PUT", jsonURL, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", apiKey);
    let updatedTodoList = JSON.stringify(todoList);
    req.send(updatedTodoList);
}