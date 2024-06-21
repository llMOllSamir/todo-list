const completeSection: HTMLElement = document.querySelector(
  "#completed"
) as HTMLElement;
const pendingSection: HTMLElement = document.querySelector(
  "#pending"
) as HTMLElement;
const progressSection: HTMLElement = document.querySelector(
  "#progress"
) as HTMLElement;
const formTask: HTMLFormElement = document.querySelector(
  "#taskForm"
) as HTMLFormElement;
const model: HTMLDivElement = document.getElementById(
  "model"
) as HTMLDivElement;
const overlay: HTMLDivElement = document.querySelector(
  "#model > .overlay"
) as HTMLDivElement;
// ===================== types ======================
type Task = {
  title: string;
  details: string;
  statues: Statues;
};
type Statues = "pending" | "progress" | "completed";
enum statuesCode {
  pending = "pending",
  progress = "progress",
  completed = "completed",
}
// ==================== functions ======================
// get tasks from localStorage
const getTasks = (): Task[] => {
  const tasks = localStorage.getItem("tasks");
  if (tasks === null) {
    return [];
  } else {
    return JSON.parse(tasks);
  }
};
type TableOut = {
  bodyTable: HTMLTableSectionElement;
  table: HTMLTableElement;
};
// Create table
const createTable = (): TableOut => {
  const table: HTMLTableElement = document.createElement("table");

  const headTable: HTMLTableSectionElement = document.createElement("thead");
  const bodyTable: HTMLTableSectionElement = document.createElement("tbody");
  const rowElement: HTMLTableRowElement = document.createElement("tr");
  const headTitle: HTMLTableCellElement = document.createElement("th");
  const headDesc: HTMLTableCellElement = document.createElement("th");
  const headActions: HTMLTableCellElement = document.createElement("th");
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
const createTaskRows = (bodyTable: HTMLTableSectionElement, task: Task) => {
  const rowElement: HTMLTableRowElement = document.createElement("tr");
  rowElement.addEventListener("click", (event: MouseEvent) => {
    displayOneTask(task);
  });
  const titleEle: HTMLTableCellElement = document.createElement("td");
  const descEle: HTMLTableCellElement = document.createElement("td");
  const actionEle: HTMLTableCellElement = document.createElement("td");
  // handle actions
  const deleteAction: HTMLButtonElement = document.createElement("button");
  const editAction: HTMLButtonElement = document.createElement("button");
  editAction.addEventListener("click", (event: MouseEvent) => {
    event.stopPropagation();
    editForm(task);
    openModel();
  });
  deleteAction.addEventListener("click", (event: MouseEvent) => {
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
const sectionRendering = (
  sec: HTMLElement,
  array: Task[],
  statues: statuesCode
) => {
  if (array.length > 0) {
    sec.innerHTML = `<h2>${statues}</h2>`;
    const { bodyTable, table } = createTable();
    array.forEach((task) => {
      createTaskRows(bodyTable, task);
    });
    table.appendChild(bodyTable);
    sec.appendChild(table);
  } else {
    sec.innerHTML = `<h2>${statues}</h2>
    <h4>${"No Tasks To Do Now"}</h4>
    `;
  }
};
// Display Tasks
const displayTasks = (): void => {
  const pendingTasks: Task[] = tasks.filter(
    (task) => task.statues === statuesCode.pending
  );
  const progressTasks: Task[] = tasks.filter(
    (task) => task.statues === statuesCode.progress
  );
  const completedTasks: Task[] = tasks.filter(
    (task) => task.statues === statuesCode.completed
  );
  // pendingTasks section
  sectionRendering(pendingSection, pendingTasks, statuesCode.pending);
  // progressTasks section
  sectionRendering(progressSection, progressTasks, statuesCode.progress);
  // completedTasks section
  sectionRendering(completeSection, completedTasks, statuesCode.completed);
};

// display One Task
function displayOneTask(task: Task) {
  overlay.innerHTML = "";
  const divSection: HTMLDivElement = document.createElement("div");
  const head2: HTMLHeadingElement = document.createElement("h2");
  head2.innerText = task.title;
  const head4: HTMLHeadingElement = document.createElement("h4");
  head4.innerText = "Details : " + task.details;
  const p: HTMLParagraphElement = document.createElement("p");
  p.innerText = "Status : " + task.statues;
  p.classList.add(task.statues);
  const editBtn: HTMLButtonElement = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.setAttribute("action", "edit");
  editBtn.addEventListener("click", (event: MouseEvent) => {
    event.stopPropagation();
    editForm(task);
  });
  const deletedBtn: HTMLButtonElement = document.createElement("button");
  deletedBtn.innerText = "Delete";
  deletedBtn.setAttribute("action", "delete");
  deletedBtn.addEventListener("click", (event: MouseEvent) => {
    event.stopPropagation();
    deleteTask(task);
    closeModel();
  });
  const closeBtn: HTMLButtonElement = document.createElement("button");
  closeBtn.innerText = "Close";
  closeBtn.setAttribute("action", "close");
  closeBtn.addEventListener("click", () => {
    closeModel();
  });
  const btnGroup: HTMLDivElement = document.createElement("div");
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
const editForm = (task: Task): void => {
  const form: HTMLFormElement = document.createElement("form");
  const head2: HTMLHeadingElement = document.createElement("h2");
  head2.innerText = "Edit Task";
  form.appendChild(head2);
  const lableTitle: HTMLLabelElement = document.createElement("label");
  lableTitle.setAttribute("for", "title");
  lableTitle.innerText = "Title : ";
  const lableDetails: HTMLLabelElement = document.createElement("label");
  lableDetails.setAttribute("for", "details");
  lableDetails.innerText = "Details : ";
  const lableStatus: HTMLLabelElement = document.createElement("label");
  lableStatus.setAttribute("for", "status");
  lableStatus.innerText = "Status : ";
  const inputTitle: HTMLInputElement = document.createElement("input");
  const inputDetails: HTMLInputElement = document.createElement("input");
  const closeBtn: HTMLButtonElement = document.createElement("button");
  closeBtn.innerText = "Close";
  closeBtn.setAttribute("action", "close");
  closeBtn.setAttribute("type", "button");
  closeBtn.addEventListener("click", () => {
    closeModel();
  });
  form.appendChild(closeBtn);
  const dataList: HTMLSelectElement = document.createElement("select");
  dataList.setAttribute("id", "status");
  dataList.setAttribute("name", "status");
  dataList.innerHTML = `<option ${
    task.statues === statuesCode.pending && "selected"
  }  value="${statuesCode.pending}">${statuesCode.pending}</option> 
  <option ${task.statues === statuesCode.progress && "selected"} value="${
    statuesCode.progress
  }">${statuesCode.progress}</option>
  <option ${task.statues === statuesCode.completed && "selected"}  value="${
    statuesCode.completed
  }">${statuesCode.completed}</option>`;
  const submitBtn: HTMLButtonElement = document.createElement("button");
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
  form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    const formData: FormData = new FormData(form);
    const title = formData.get("title") as string;
    const details = formData.get("details") as string;
    const statuesValue = formData.get("status") as statuesCode;
    const data: Task = {
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
let tasks: Task[] = getTasks();
displayTasks();

//  add task
const addTask = (task: Task): void => {
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Edit Task Function
const editTask = (task: Task, data: Task): void => {
  const taskFound = tasks.find((found: Task) => found === task);
  taskFound.title = data.title;
  taskFound.details = data.details;
  taskFound.statues = data.statues;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
};

// Delete Task Function
const deleteTask = (task: Task): void => {
  const index = tasks.indexOf(task);
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
};

// Submit add Task Function
formTask.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const formData: FormData = new FormData(formTask);
  const title = formData.get("title") as string;
  const details = formData.get("details") as string;
  const data: Task = {
    title,
    details,
    statues: statuesCode.pending,
  };
  addTask(data);
  formTask.reset();
  displayTasks();
});

//  open model
const openModel = (): void => {
  model.classList.add("flex");
  document.body.style.overflow = "hidden";
};
// close model
const closeModel = (): void => {
  model.classList.remove("flex");
  document.body.style.overflow = "auto";
};
