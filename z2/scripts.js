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

    let table = document.createElement("table");
    table.className = "table table-bordered table-striped table-hover";

    let tr = document.createElement("tr");
    let headers = ["Title", "Description", "Category", "Due Date", "Place"];

    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    headers.forEach(header => {
        let th = document.createElement("th");
        th.textContent = header;
        tr.appendChild(th);
    })

    thead.appendChild(tr);
    table.appendChild(thead);

    let filterInput = document.getElementById("inputSearch");
    let fromDateInput = document.getElementById("fromDate");
    let toDateInput = document.getElementById("toDate");

    let searchBarText = filterInput ? (filterInput.value || "").trim().toLowerCase() : "";
    let fDate = fromDateInput && fromDateInput.value ? fromDateInput.value : null;
    let tDate = toDateInput && toDateInput.value ? toDateInput.value : null;

    let filteredTasks = todoList.filter(task => {
        let taskTitle = (task.title || "").toLowerCase();
        let taskDescription = (task.description || "").toLowerCase();
        let matchesText = !searchBarText || taskTitle.includes(searchBarText) || taskDescription.includes(searchBarText);

        let taskDate = (task.dueDate || "").substring(0, 10); // "YYYY-MM-DD"

        let matchesFrom = !fDate || taskDate >= fDate;
        let matchesTo   = !tDate || taskDate <= tDate;

        return matchesText && matchesFrom && matchesTo;
    });



    if (filteredTasks && filteredTasks.length > 0) {

        for (let i = 0; i < filteredTasks.length; i++) {
            let row = document.createElement("tr");

            let content = [filteredTasks[i].title, filteredTasks[i].description, filteredTasks[i].category, filteredTasks[i].dueDate, filteredTasks[i].place];

            content.forEach(cell => {
                let td = document.createElement("td");
                td.textContent = cell;
                row.appendChild(td);
            })

            let deleteContent = document.createElement("td");
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.className = "btn btn-danger";
            deleteButton.addEventListener("click", function () {
                deleteTodo(i);
            });

            deleteContent.appendChild(deleteButton);
            row.appendChild(deleteContent);
            tbody.appendChild(row);
        }
    } else {
        let infoRow = document.createElement("tr");
        let tdRow = document.createElement("td");
        tdRow.textContent = "No tasks found, add some new.";
        infoRow.appendChild(tdRow);
        tbody.appendChild(infoRow);
    }

    table.appendChild(tbody);
    todoListDiv.appendChild(table);
};

setInterval(updateTodoList, 1000);

let deleteTodo = function (index) {
    todoList.splice(index, 1);

    if (todoList.length == 0) {
        window.localStorage.removeItem("todos");
    } else {
        window.localStorage.setItem("todos", JSON.stringify(todoList));
    }

    updateTodoList();
    updateJSONbin();
}

let addTodo = async function () {
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

    if (!newDate || !newTitle || !newDescription || !newPlace || !newDate) {
        //console.log("Missing values, cannot add a new task");
        alert("Missing values, cannot add a new task");
        return;
    }

    let category = await groqCategory(newTitle, newDescription);

    //create new item
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        category: category,
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

// tak w dokumentacji jest sugetowane zeby zrobic jako async function
async function groqCategory(title, description) {
    let prompt = `Na podstawie podanego tytułu "${title}" i opisu zadania "${description}", dopasuj je do jednej z kategorii spośród: 'Study', 'Work', 'Hobby', 'Other'. Odpowiedz jednym słowem zaczynając z wielkiej litery.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.GROQ_KEY}`
        },
        body: JSON.stringify({
            model: env.GROQ_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        })
    });

    const data = await response.json();
    const category = data.choices[0]?.message?.content?.trim();
    return category;
}
