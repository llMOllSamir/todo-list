const completeSection = document.querySelector("#completed");
const pendingSection = document.querySelector("#pending");
const progressSection = document.querySelector("#progress");
const formTask = document.querySelector("#taskForm");
const model = document.getElementById("model");
const overlay = document.querySelector("#model > .overlay");
var statuesCode;
(function (statuesCode) {
    statuesCode["pending"] = "pending";
    statuesCode["progress"] = "progress";
    statuesCode["completed"] = "completed";
})(statuesCode || (statuesCode = {}));
// ==================== functions ======================
// get tasks from localStorage
const getTasks = () => {
    const tasks = localStorage.getItem("tasks");
    if (tasks === null) {
        return [];
    }
    else {
        return JSON.parse(tasks);
    }
};
// Create table
const createTable = () => {
    const table = document.createElement("table");
    const headTable = document.createElement("thead");
    const bodyTable = document.createElement("tbody");
    const rowElement = document.createElement("tr");
    const headTitle = document.createElement("th");
    const headDesc = document.createElement("th");
    const headActions = document.createElement("th");
    headTitle.innerText = `Title`;
    headDesc.innerText = `Details`;
    headActions.innerText = `Actions`;
    rowElement.appendChild(headTitle);
    rowElement.appendChild(headDesc);
    rowElement.appendChild(headActions);
    headTable.appendChild(rowElement);
    table.appendChild(headTable);
    return { bodyTable, table };
};
// create Table Rows
const createTaskRows = (bodyTable, task) => {
    const rowElement = document.createElement("tr");
    rowElement.addEventListener("click", (event) => {
        displayOneTask(task);
    });
    const titleEle = document.createElement("td");
    const descEle = document.createElement("td");
    const actionEle = document.createElement("td");
    // handle actions
    const deleteAction = document.createElement("button");
    const editAction = document.createElement("button");
    editAction.addEventListener("click", (event) => {
        event.stopPropagation();
        editForm(task);
        openModel();
    });
    deleteAction.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTask(task);
    });
    editAction.innerText = "Edit";
    editAction.setAttribute("action", "edit");
    deleteAction.setAttribute("action", "delete");
    deleteAction.innerText = "Delete";
    actionEle.appendChild(editAction);
    actionEle.appendChild(deleteAction);
    titleEle.innerText = task.title;
    descEle.innerText = task.details.split("").slice(0, 20).join("") + "...";
    rowElement.appendChild(titleEle);
    rowElement.appendChild(descEle);
    rowElement.appendChild(actionEle);
    bodyTable.appendChild(rowElement);
};
// Render Task Section
const sectionRendering = (sec, array, statues) => {
    if (array.length > 0) {
        sec.innerHTML = `<h2>${statues}</h2>`;
        const { bodyTable, table } = createTable();
        array.forEach((task) => {
            createTaskRows(bodyTable, task);
        });
        table.appendChild(bodyTable);
        sec.appendChild(table);
    }
    else {
        sec.innerHTML = `<h2>${statues}</h2>
    <h4>${"No Tasks To Do Now"}</h4>
    `;
    }
};
// Display Tasks
const displayTasks = () => {
    const pendingTasks = tasks.filter((task) => task.statues === statuesCode.pending);
    const progressTasks = tasks.filter((task) => task.statues === statuesCode.progress);
    const completedTasks = tasks.filter((task) => task.statues === statuesCode.completed);
    // pendingTasks section
    sectionRendering(pendingSection, pendingTasks, statuesCode.pending);
    // progressTasks section
    sectionRendering(progressSection, progressTasks, statuesCode.progress);
    // completedTasks section
    sectionRendering(completeSection, completedTasks, statuesCode.completed);
};
// display One Task
function displayOneTask(task) {
    overlay.innerHTML = "";
    const divSection = document.createElement("div");
    const head2 = document.createElement("h2");
    head2.innerText = task.title;
    const head4 = document.createElement("h4");
    head4.innerText = "Details : " + task.details;
    const p = document.createElement("p");
    p.innerText = "Status : " + task.statues;
    p.classList.add(task.statues);
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.setAttribute("action", "edit");
    editBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        editForm(task);
    });
    const deletedBtn = document.createElement("button");
    deletedBtn.innerText = "Delete";
    deletedBtn.setAttribute("action", "delete");
    deletedBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTask(task);
        closeModel();
    });
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.setAttribute("action", "close");
    closeBtn.addEventListener("click", () => {
        closeModel();
    });
    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deletedBtn);
    divSection.appendChild(head2);
    divSection.appendChild(head4);
    divSection.appendChild(p);
    divSection.appendChild(closeBtn);
    divSection.appendChild(btnGroup);
    overlay.appendChild(divSection);
    openModel();
}
//  create Edit Form
const editForm = (task) => {
    const form = document.createElement("form");
    const head2 = document.createElement("h2");
    head2.innerText = "Edit Task";
    form.appendChild(head2);
    const lableTitle = document.createElement("label");
    lableTitle.setAttribute("for", "title");
    lableTitle.innerText = "Title : ";
    const lableDetails = document.createElement("label");
    lableDetails.setAttribute("for", "details");
    lableDetails.innerText = "Details : ";
    const lableStatus = document.createElement("label");
    lableStatus.setAttribute("for", "status");
    lableStatus.innerText = "Status : ";
    const inputTitle = document.createElement("input");
    const inputDetails = document.createElement("input");
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.setAttribute("action", "close");
    closeBtn.setAttribute("type", "button");
    closeBtn.addEventListener("click", () => {
        closeModel();
    });
    form.appendChild(closeBtn);
    const dataList = document.createElement("select");
    dataList.setAttribute("id", "status");
    dataList.setAttribute("name", "status");
    dataList.innerHTML = `<option ${task.statues === statuesCode.pending && "selected"}  value="${statuesCode.pending}">${statuesCode.pending}</option> 
  <option ${task.statues === statuesCode.progress && "selected"} value="${statuesCode.progress}">${statuesCode.progress}</option>
  <option ${task.statues === statuesCode.completed && "selected"}  value="${statuesCode.completed}">${statuesCode.completed}</option>`;
    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Edit";
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("name", "title");
    inputTitle.setAttribute("value", task.title);
    inputDetails.setAttribute("type", "text");
    inputDetails.setAttribute("name", "details");
    inputDetails.setAttribute("value", task.details);
    submitBtn.setAttribute("type", "submit");
    lableTitle.appendChild(inputTitle);
    lableDetails.appendChild(inputDetails);
    lableStatus.appendChild(dataList);
    form.appendChild(lableTitle);
    form.appendChild(lableDetails);
    form.appendChild(lableStatus);
    form.appendChild(submitBtn);
    overlay.innerHTML = "";
    overlay.appendChild(form);
    // Edit Task
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const title = formData.get("title");
        const details = formData.get("details");
        const statuesValue = formData.get("status");
        const data = {
            title: title.length > 0 ? title : task.title,
            details: details.length > 0 ? details : task.details,
            statues: statuesValue.length > 0 ? statuesValue : task.statues,
        };
        editTask(task, data);
        overlay.innerHTML = "";
        closeModel();
        displayTasks();
    });
};
// get tasks
let tasks = getTasks();
displayTasks();
//  add task
const addTask = (task) => {
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
// Edit Task Function
const editTask = (task, data) => {
    const taskFound = tasks.find((found) => found === task);
    taskFound.title = data.title;
    taskFound.details = data.details;
    taskFound.statues = data.statues;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
};
// Delete Task Function
const deleteTask = (task) => {
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
};
// Submit add Task Function
formTask.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(formTask);
    const title = formData.get("title");
    const details = formData.get("details");
    const data = {
        title,
        details,
        statues: statuesCode.pending,
    };
    addTask(data);
    formTask.reset();
    displayTasks();
});
//  open model
const openModel = () => {
    model.classList.add("flex");
    document.body.style.overflow = "hidden";
};
// close model
const closeModel = () => {
    model.classList.remove("flex");
    document.body.style.overflow = "auto";
};
