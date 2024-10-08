import * as taskMaster from "./task-master";
import { changeListener } from "./sub-to-changes";
import { visualCues } from "./display-assist";

const processDateObjs = {
  updateDomWithDates: function () {
    this.bindToDom();
  },
  bindToDom: function () {
    const todayDiv = document.querySelector(".today");
    const soonDiv = document.querySelector(".soon");
    const overdueDiv = document.querySelector(".overdue");
    const anytimeDiv = document.querySelector(".anytime");

    todayDiv.addEventListener("click", this.todayToDom);
    soonDiv.addEventListener("click", this.soonToDom);
    overdueDiv.addEventListener("click", this.overdueToDom);
    anytimeDiv.addEventListener("click", this.anytimeToDom);
  },
  todayToDom: function () {
    domMain.taskIndex *= 0;
    domMain.displayTasks(taskMaster.dateObjs.today, ": due by today");
    dateDomManager.currentDateType = "today";
    visualCues.currentDateType = "today";
  },
  soonToDom: function () {
    domMain.taskIndex *= 0;
    domMain.displayTasks(taskMaster.dateObjs.soonArray, ": due soon");
    dateDomManager.currentDateType = "soonArray";
    visualCues.currentDateType = "soonArray";
  },
  overdueToDom: function () {
    domMain.taskIndex *= 0;
    domMain.displayTasks(taskMaster.dateObjs.overdueArray, ": overdue");
    dateDomManager.currentDateType = "overdueArray";
    visualCues.currentDateType = "overdueArray";
  },
  anytimeToDom: function () {
    domMain.taskIndex *= 0;
    domMain.displayTasks(taskMaster.dateObjs.anytimeArray, ": due anytime");
    dateDomManager.currentDateType = "anytimeArray";
    //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA  THIS WAS SUCH A PAIN TO TRACE THIS
    visualCues.currentDateType = "anytimeArray";
  },
  checkType: function (type) {
    if (type === "normal") {
      return;
    } else {
      this.changeCatDisplay(type);
    }
  },
  changeCatDisplay: function (type) {
    const catDiv = document.querySelector(".cat");
    const catDescriptionDiv = document.querySelector(".cat-description");

    catDescriptionDiv.textContent = "";
    catDiv.innerHTML = `These tasks are <span id="date-type">${type} </span>`;

    //Ru class name for time, to avoid conflict with user-set cat titles
    catDiv.setAttribute("id", "obyect-vremeni");

    this.hideAddTaskOption();
  },
  hideAddTaskOption: function () {
    const addTask = document.querySelector(".add-task");

    addTask.style.visibility = "hidden";
  },
  showAddTaskOption: function () {
    const addTask = document.querySelector(".add-task");

    addTask.style.visibility = "visible";
  },
  processDateFormat: function (date) {
    const processedDate = changeListener.pubUnprocessedDates(date);
    return processedDate;
  },
};

const dateDomManager = {
  currentDateType: null,
  currentSubtaskPath: null,
  currentTaskPath: null,
  currentSubtaskIndex: null,
  currentTaskIndex: null,
  popupSubtaskDate: function (subtaskIndex, taskIndex, location) {
    const modal = document.createElement("dialog");
    const taskPath = taskMaster.dateObjs[this.currentDateType][taskIndex];
    const subtaskPath = taskPath.subtasks[subtaskIndex];
    const subtask = subtaskPath.details;

    //more sane way of not relying on DOM id's and classes for positions
    this.currentSubtaskPath = subtaskPath;
    this.currentTaskPath = taskPath;
    this.currentSubtaskIndex = subtaskIndex;

    modal.innerHTML = "";

    const template = `
            <div class="clear-modal">x</div>
            <div class="subtask-container">
                <div class="popup-subtask-details">
                    <label for="edit-subtask-details">Edit Subtask:</label>
                    <textarea name="edit-subtasks-details" id="edit-subtask-details" maxlength="45" required>${subtask}</textarea>
                </div>
                <div class="error-handler"></div>
                <div class="subtask-buttons">
                    <button type="submit" id="edit-subtask-button">Submit Changes</button>
                    <button type="submit" id="clear-subtask">Clear</button>
                    <button type="submit" id="delete-subtask-button">Delete Subtask</button>
                </div>
            </div>
        `;

    modal.classList.add("subtask-editor");
    location.appendChild(modal);

    editors.activateTemplate(modal, template);
    this.activateSubtaskButtons();
  },
  popupTaskDate: function (path, location, taskIndex) {
    const modal = document.createElement("dialog");
    const taskDescription = path.description;
    const taskTitle = path.title;

    dateDomManager.currentTaskPath = path;
    dateDomManager.currentTaskIndex = taskIndex;

    modal.innerHTML = "";

    const template = `
        <div class="clear-modal">x</div>
            <div class="task-modal-container">
                <div class="popup-task-title">
                <label for="task-input-title">Task title: </label>
                <input name="task-input-title" id="task-input-title" maxlength="45" required value="${taskTitle}"/>
            </div>
            <div class="popup-task-description">
                <label for="edit-task-description">Task Description:</label>
                <textarea name="edit-task-description" id="edit-task-description" maxlength="150" required>${taskDescription}</textarea>
            </div>
            <div class="error-handler"></div>
            <div class="task-buttons">
                <button type="submit" id="submit-task-button">Submit Changes</button>
                <button type="submit" id="clear-task">Clear</button>
            </div>
        </div>
        `;

    modal.classList.add("task-editor");
    location.appendChild(modal);

    editors.activateTemplate(modal, template);
    this.activateTaskButtons();
  },
  editTask: function (e) {
    const target = e.target.getAttribute("id").split("task-index")[1];
    const taskPath =
      taskMaster.dateObjs[dateDomManager.currentDateType][target];
    const location = e.target.parentElement;

    this.popupTaskDate(taskPath, location, target);
  },
  activateSubtaskButtons: function () {
    const clearModalButton = document.querySelector(".clear-modal");
    const submitChangesButton = document.querySelector("#edit-subtask-button");
    const clearSubtaskButton = document.querySelector("#clear-subtask");
    const deleteSubtask = document.querySelector("#delete-subtask-button");

    clearSubtaskButton.addEventListener("click", editors.clearSubtask);
    clearModalButton.addEventListener("click", editors.clearSubtaskModal);
    deleteSubtask.addEventListener("click", this.deleteSubtask);
    submitChangesButton.addEventListener("click", this.submitSubtaskChanges);
  },
  activateTaskButtons: function () {
    const clearModalButton = document.querySelector(".clear-modal");
    const submitChangesButton = document.querySelector("#submit-task-button");
    const clearTaskButton = document.querySelector("#clear-task");

    clearTaskButton.addEventListener("click", editors.clearTask);
    clearModalButton.addEventListener("click", editors.clearTaskModal);
    submitChangesButton.addEventListener("click", this.submitTaskChanges);
  },
  deleteSubtask: function (e) {
    e.preventDefault;

    dateDomManager.currentTaskPath.subtasks.splice(
      dateDomManager.currentSubtaskIndex,
      1
    );

    dateDomManager.defaultLoad();
  },
  submitSubtaskChanges: function (e) {
    e.preventDefault();

    let newSubtask = editors.getSubtaskInput();

    dateDomManager.currentSubtaskPath.details = newSubtask;
    dateDomManager.defaultLoad();
  },
  submitTaskChanges: function (e) {
    e.preventDefault();
    const newTaskDescription = editors.getTaskDescription();
    const newTaskTitle = editors.getTaskTitle();

    dateDomManager.currentTaskPath.description = newTaskDescription;
    dateDomManager.currentTaskPath.title = newTaskTitle;
    dateDomManager.defaultLoad();
  },
  addNewSubtask: function (e) {
    const location = e.target.parentElement;
    const taskIndex = editors.getTaskIndex(e.target);

    dateDomManager.currentTaskIndex = taskIndex;

    const modal = document.createElement("dialog");
    const subtaskPath =
      taskMaster.dateObjs[dateDomManager.currentDateType][taskIndex].subtasks;

    dateDomManager.currentSubtaskPath = subtaskPath;
    modal.innerHTML = "";

    const template = `
        <div class="clear-modal">x</div>
        <div class="subtask-container">
        <div class="subtask-location">This subtask will be under <span> Upcoming Tasks > ${
          taskMaster.dateObjs[dateDomManager.currentDateType][taskIndex].title
        }</span></div>
            <div class="popup-subtask-details">
                <label for="create-subtask-details">Create a new Subtask:</label>
                <textarea name="create-subtasks-details" id="create-subtask-details" maxlength="150" minlength="5" placeholder ="Add details here" required></textarea>
            </div>
            <div class="error-handler"></div>
            <div class="subtask-buttons">
                <button type="submit" id="create-subtask-button">Submit Changes</button>
            </div>
        </div>
    `;

    modal.classList.add("subtask-editor");
    location.appendChild(modal);

    editors.activateTemplate(modal, template);
    dateDomManager.activateNewSubtaskButtons();
  },
  activateNewSubtaskButtons: function () {
    const clearModalButton = document.querySelector(".clear-modal");
    const createSubtask = document.querySelector("#create-subtask-button");

    createSubtask.addEventListener("click", this.submitNewSubtask);
    clearModalButton.addEventListener("click", editors.clearSubtaskModal);
  },
  submitNewSubtask: function (e) {
    e.preventDefault();

    let path =
      taskMaster.dateObjs[dateDomManager.currentDateType][
        dateDomManager.currentTaskIndex
      ].subtasks;
    let newSubtaskDetails = editors.getNewSubtaskInput();
    let subtask = new taskMaster.Subtask(newSubtaskDetails);

    path.push(subtask);
    dateDomManager.defaultLoad();
  },
  defaultLoad: function () {
    changeListener.saveChanges();
    if (this.currentDateType === "today") {
      processDateObjs.todayToDom();
    } else if (this.currentDateType === "soonArray") {
      processDateObjs.soonToDom();
    } else if (this.currentDateType === "overdueArray") {
      processDateObjs.overdueToDom();
    } else {
      processDateObjs.anytimeToDom();
    }
  },
};
//can't change domManager name now - couldn't use "this." due to context issues
const domManager = {
  findDom: function () {
    const addCategoryButton = document.querySelector(".add-cat");
    const clearLocal = document.querySelector(".clear-local");

    addCategoryButton.addEventListener("click", this.categoryPopup);
    clearLocal.addEventListener("click", this.clearLocalStorage);

    this.addTaskButton();
  },
  clearLocalStorage: function () {
    changeListener.clearAll();
    taskMaster.exampleTasksObj.addExampleTasks(taskMaster.workCat);
    changeListener.loadChanges();
    domSidebar.pubCats();
    const cat = editors.getCat();
    domMain.defaultLoad(cat);
  },
  bindAttributes: function (target, pointer) {
    Object.keys(pointer).forEach((attr) => {
      target.setAttribute(attr, pointer[attr]);
    });
  },
  addTaskButton: function () {
    const main = document.querySelector(".main");
    const addTask = document.createElement("div");

    addTask.textContent = "Add a task";
    addTask.classList.add("add-task");

    main.appendChild(addTask);
    addTask.addEventListener("click", domMain.taskPopup);
  },
  attributes: {
    catTitle: {
      name: "cat-title",
      type: "text",
      id: "cat-title",
      required: "",
    },
    catTitleLabel: {
      for: "cat-title",
    },
    catDescription: {
      name: "cat-description",
      type: "text",
      id: "cat-description",
      required: "",
      maxlength: "45",
    },
    catDescriptionLabel: {
      for: "cat-description",
    },
    closeModal: {
      id: "close-modal",
    },
  },
  conditions: {
    notNull: (input) => input !== null,
    notEmpty: (input) => input !== "",
    notUndefined: (input) => input !== undefined,
    maxlength: (input) => input.length <= 45,
  },
  categoryPopup: function () {
    const modalSpace = document.querySelector(".modal-space");
    const popup = document.createElement("dialog");
    const form = document.createElement("form");
    const formDescription = document.createElement("p");
    const catTitleContainer = document.createElement("div");
    const catTitleLabel = document.createElement("label");
    const catTitle = document.createElement("input");
    const catDescriptionContainer = document.createElement("div");
    const catDescriptionLabel = document.createElement("label");
    const catDescription = document.createElement("textarea");
    const catSubmitButton = document.createElement("button");
    const closeModalButton = document.createElement("span");

    //The way to prevent multiple modals from being created
    modalSpace.innerHTML = "";

    modalSpace.appendChild(popup);
    popup.appendChild(form);
    form.appendChild(closeModalButton);
    form.appendChild(formDescription);
    form.appendChild(catTitleContainer);
    catTitleContainer.appendChild(catTitleLabel);
    catTitleContainer.appendChild(catTitle);
    form.appendChild(catDescriptionContainer);
    catDescriptionContainer.appendChild(catDescriptionLabel);
    catDescriptionContainer.appendChild(catDescription);
    form.appendChild(catSubmitButton);

    domManager.bindAttributes(catTitle, domManager.attributes.catTitle);
    domManager.bindAttributes(
      catDescription,
      domManager.attributes.catDescription
    );
    domManager.bindAttributes(
      catDescriptionLabel,
      domManager.attributes.catDescriptionLabel
    );
    domManager.bindAttributes(
      catTitleLabel,
      domManager.attributes.catTitleLabel
    );
    domManager.bindAttributes(
      closeModalButton,
      domManager.attributes.closeModal
    );
    catSubmitButton.setAttribute("id", "submit-cats");

    formDescription.textContent = "Please fill in the categories and text";
    catTitleLabel.textContent = "Enter the Category title:";
    catDescriptionLabel.textContent = "Please describe the Task Category:";
    closeModalButton.textContent = "x";
    catSubmitButton.textContent = "Submit";

    popup.showModal();

    closeModalButton.addEventListener("click", domManager.clearModal);
    catSubmitButton.addEventListener("click", domManager.createCat);
  },
  clearModal: function () {
    const modalSpace = document.querySelector(".modal-space");
    modalSpace.innerHTML = "";
  },
  createCat: function (e) {
    e.preventDefault();

    const catTitle = document.querySelector("#cat-title").value;
    const catDescription = document.querySelector("#cat-description").value;

    taskMaster.taskManager.addCat(catTitle, catDescription);
    domManager.clearModal();
    changeListener.saveChanges();
    domSidebar.pubCats();
  },
  checkValidity: function (operand) {
    const isValid = Object.values(domManager.conditions).every((condition) =>
      condition(operand)
    );
    return isValid;
  },
};

const domSidebar = {
  pubCats: function () {
    changeListener.loadChanges();
    //local storage implemented but now date objs dont work - and ticked off stuff also dont
    updateListener(taskMaster.projects);
    const catsContainer = document.querySelector(".cats");
    //prevents duplications
    domMain.taskIndex = 0;
    catsContainer.innerHTML = "";
    Object.keys(taskMaster.projects).forEach((key) => {
      let cat = document.createElement("div");
      cat.textContent = taskMaster.projects[key].catTitle;
      cat.setAttribute("class", taskMaster.projects[key].catTitle);
      catsContainer.appendChild(cat);
      cat.addEventListener("click", domMain.renderCat);
    });
  },
};

const domMain = {
  //depends on what cat user selects, the tasks get displayed
  renderCat: function (e) {
    domMain.taskIndex *= 0;
    //communicate with domMain to show tasks
    let catTitle = e.target.getAttribute("class");
    let catDescription = taskMaster.projects[catTitle].catDescription;
    domMain.displayCat(catTitle, catDescription);

    processDateObjs.showAddTaskOption();
  },
  defaultLoad: function (cat) {
    changeListener.saveChanges();
    domMain.taskIndex *= 0;
    let catTitle = taskMaster.projects[cat].catTitle;
    let catDescription = taskMaster.projects[cat].catDescription;
    domMain.displayCat(catTitle, catDescription);

    updateListener(taskMaster.projects);
    processDateObjs.showAddTaskOption();
  },
  displayCat: function (catTitle, catDescription) {
    const cat = document.querySelector(".cat");
    cat.textContent = catTitle;
    //subtle but important, helps to identify which cat does a task belong to later down the code
    cat.setAttribute("id", catTitle);

    //After a while, I concluded this is the best place to put this function:

    const catDetails = document.querySelector(".cat-description");
    catDetails.textContent = catDescription;

    domMain.createToolbar(catDetails, "cat");
    domMain.renderTasks(catTitle);
  },
  renderTasks: function (catTitle) {
    const taskArray = taskMaster.projects[catTitle].tasks;
    domMain.displayTasks(taskArray, "normal");
  },
  displayTasks: function (taskArray, type) {
    const taskContainer = document.querySelector(".task-container");

    taskContainer.innerHTML = "";
    editors.taskTracker *= 0;

    processDateObjs.checkType(type);

    taskArray.forEach((element) => {
      let taskTitle = document.createElement("span");
      let taskDescription = document.createElement("div");
      let detailsContainer = document.createElement("div");

      taskTitle.innerHTML = `
                <span class="due-display">${processDateObjs.processDateFormat(
                  element.due
                )}</span>
                ${element.title}
            `;

      taskDescription.textContent = `${
        element.description
      } ${visualCues.getUrgency(element.priority)}`;

      taskContainer.appendChild(taskTitle);
      taskContainer.appendChild(detailsContainer);
      detailsContainer.appendChild(taskDescription);

      taskTitle.setAttribute("class", "task-title");
      taskDescription.classList.add("task-description");
      taskDescription.classList.add(`${element.priority}`);
      detailsContainer.setAttribute("class", "details-container");

      if (type === "normal") {
        domMain.renderSubtasks(element.subtasks, detailsContainer);
        //if you ever wonder why index starts at 3, follow this path
        domMain.createToolbar(taskDescription, "tasks");
        this.createSubSection();
      } else {
        domMain.renderSubtasks(element.subtasks, detailsContainer);
        domMain.createToolbar(taskDescription, "tasks");
        this.createSubSection();
        return;
      }
    });
  },
  renderSubtasks: function (subtaskArray, location) {
    let subtaskContainer = document.createElement("div");

    location.appendChild(subtaskContainer);

    subtaskContainer.classList.add(`subtask-container${domMain.taskIndex}`);
    subtaskContainer.setAttribute("id", `${domMain.taskIndex}`);
    //unique identifier of finding subtask within a task
    let indexOfSubtask = 0;

    subtaskArray.forEach((element) => {
      let subtaskDetailsContainer = document.createElement("div");
      let subtaskDetails = document.createElement("div");

      subtaskDetails.textContent = element.details;

      subtaskContainer.appendChild(subtaskDetailsContainer);
      subtaskDetailsContainer.appendChild(subtaskDetails);

      subtaskDetailsContainer.classList.add("subtask-details-container");
      subtaskDetails.classList.add("subtask-details");
      subtaskDetails.classList.add(`index${editors.subtaskTracker}`);
      subtaskDetails.classList.add(`subtask${indexOfSubtask}`);
      subtaskDetails.classList.add(`${element.status}`);

      //subtask Details Container separates the toolbar and the subtask
      domMain.createToolbar(subtaskDetailsContainer, "subtasks");
      visualCues.addToggleListener(subtaskDetails);

      indexOfSubtask += 1;
    });
  },
  createSubSection: function () {
    const taskContainer = document.querySelector(
      `.subtask-container${domMain.taskIndex}`
    );

    const addSubtask = document.createElement("div");

    addSubtask.textContent = "+ Add a subtask";

    addSubtask.classList.add("add-subtask");

    taskContainer.appendChild(addSubtask);
    domMain.taskIndex += 1;

    addSubtask.addEventListener("click", editors.precheckType);
  },
  taskIndex: 0,
  taskPopup: function () {
    const modalSpace = document.querySelector(".modal-space-tasks");
    //templating is just so much easier:
    const modal = document.createElement("dialog");
    const modalTemplate = `
        <form action="" method="">
            <span id="clear-task-modal">x</span>
            <div class="task-title-container">
                <label for="task-title">Enter the task: </label>
                <input name="task-title" id="task-title" maxlength="45" required/>
            </div>
            <div class="task-description-container">
                <label for="task-description">Please describe the task: </label>
                <textarea id="task-description" name="task-description" required maxlength="150"></textarea>
            </div>
            <div class="due-date-container">
                <label for="due-date">(Optional) Please enter a due date:</label>
                <input type="date" id="due-date" name="due-date"></input>
            </div>
            <div class="priority-container">
                <label for="priority">Priority:</label>
                <div id="priority" class="normal">Click me to toggle</div>
            </div>
            <button type='submit' id='submit-tasks'>Submit</button>
        </form>
        `;
    domMain.clearModal(modalSpace);
    modalSpace.appendChild(modal);
    modal.innerHTML = modalTemplate;
    modal.showModal();

    const closeModal = document.querySelector("#clear-task-modal");
    const submitTasksButton = document.querySelector("#submit-tasks");
    const priority = document.querySelector("#priority");

    closeModal.addEventListener("click", domMain.clearModal);
    submitTasksButton.addEventListener("click", domMain.createTask);
    priority.addEventListener("click", priorityHandler.togglePriority);
  },
  clearModal: function () {
    const taskSpace = document.querySelector(".modal-space-tasks");
    taskSpace.innerHTML = "";
  },
  createTask: function (e) {
    e.preventDefault();

    const taskTitle = document.querySelector("#task-title").value;
    const taskDescription = document.querySelector("#task-description").value;
    const taskDue = document.querySelector("#due-date").value;
    const taskPriority = document.querySelector("#priority").className;

    const check1 = domManager.checkValidity(taskTitle);
    const check2 = domManager.checkValidity(taskDescription);

    if (check1 == true && check2 == true) {
      let catTitle = domMain.findOwnerCat();
      taskMaster.taskManager.addTask(
        catTitle,
        taskTitle,
        taskDescription,
        taskDue,
        taskPriority
      );
      domMain.clearModal();
      //prevents error 732
      domMain.taskIndex = 0;
      //ABSOLUTE MISTAKE TO MESS WITH THIS LINE, I TRIED TO MAKE IT MORE MODULAR AND IT STOPPED ME FROM BEING ABLE TO MAKE TASKS WHEN I CREATE A NEW CAT -- do not, DO NOT USE UPDATE LISTENER HERE
      changeListener.saveChanges();
      changeListener.pubChangesToDates(taskMaster.projects);
      domMain.renderTasks(catTitle);
    }
  },
  findOwnerCat: function () {
    const cat = document.querySelector(".cat");
    return cat.getAttribute("id");
  },
  createToolbar: function (parentElement, type) {
    const options = document.createElement("span");

    parentElement.appendChild(options);

    options.classList.add("options-on-hover");
    options.classList.add(type);
    options.addEventListener("click", editors.render);

    domMain.trackToolbar(options, type);

    if (type === "subtasks") {
      options.textContent = "[edit]";
    } else {
      options.textContent = "...";
    }
  },
  //associateToolbar: tracks where it belongs
  trackToolbar: function (container, type) {
    if (type === "subtasks") {
      container.setAttribute("id", `index${editors.subtaskTracker}`);
      editors.indexTracker(type);
    } else if (type === "tasks") {
      container.setAttribute("id", `task-index${editors.taskTracker}`);
      editors.indexTracker(type);
    }
  },
};

const priorityHandler = {
  i: 0,
  indexTracker: function () {
    if (this.i == this.priorities.length - 1) {
      this.i = 0;
    } else {
      this.i += 1;
    }
  },
  togglePriority: function (e) {
    e.target.setAttribute(
      "class",
      priorityHandler.priorities[priorityHandler.i]
    );
    e.target.textContent = priorityHandler.priorities[priorityHandler.i];

    priorityHandler.indexTracker();
  },
  priorities: ["urgent", "completed", "normal"],
};

const editors = {
  //tracker to track which subtasks is edited
  subtaskTracker: 0,
  taskTracker: 0,
  indexTracker: function (type) {
    if (type === "subtasks") {
      this.subtaskTracker += 1;
    } else if (type == "tasks") {
      this.taskTracker += 1;
    }
  },
  render: function (e) {
    let classArray = e.target.classList;
    editors.checkType(classArray, e);
  },
  checkType: function (classArray, e) {
    if (classArray.contains("subtasks")) {
      editors.editSubtask(e);
    } else if (classArray.contains("tasks")) {
      editors.checkTaskType(e);
    } else {
      editors.editCat(e);
    }
  },
  checkTaskType: function (e) {
    let cat = this.getCat();
    if (cat === "obyect-vremeni") {
      dateDomManager.editTask(e);
    } else {
      editors.editTask(e);
    }
  },
  editSubtask: function (e) {
    let targetIndex = e.target.getAttribute("id");
    let targetSubtask = document.querySelector(`.${targetIndex}`);

    editors.processElements(targetSubtask);
  },
  editTask: function (e) {
    const target = e.target.getAttribute("id").split("task-index")[1];
    const cat = this.getCat();
    const taskPath = taskMaster.projects[cat].tasks[target];
    const location = e.target.parentElement;

    editors.popupTask(taskPath, location, target);
  },
  editCat: function (e) {
    const cat = editors.getCat();
    const catPath = taskMaster.projects[cat];

    const location = e.target.parentElement;

    editors.popupCat(catPath, location);
  },
  processElements: function (target) {
    let subtaskIndex = this.getSubtaskIndex(target);
    let taskIndex = this.getTaskIndexForEditing(target);
    let cat = this.getCat();
    let location = document.querySelector(".modal-space-tasks");

    if (cat === "obyect-vremeni") {
      dateDomManager.popupSubtaskDate(subtaskIndex, taskIndex, location);
    } else {
      this.popupSubtask(cat, subtaskIndex, taskIndex, location);
    }
  },
  getSubtaskIndex: function (target) {
    let subtaskIndex = target.classList[2].split("subtask")[1];
    return subtaskIndex;
  },
  getTaskIndexForEditing: function (target) {
    let taskIndex = target.parentNode.parentNode.getAttribute("id");
    return taskIndex;
  },
  getTaskIndex: function (target) {
    let taskIndex = target.parentNode.getAttribute("id");
    return taskIndex;
  },
  getCat: function () {
    let cat = document.querySelector(".cat");
    let catId = cat.getAttribute("id");
    return catId;
  },
  //overlooked the modularization chance - this is applied for the task too
  currentSubtaskPath: (function () {
    let currentPath;
    let taskPath;
    let subtaskIndex;
    function setSubtaskPath(path) {
      currentPath = path;
    }
    function getSubtaskPath() {
      return currentPath;
    }
    function setTaskPath(path) {
      taskPath = path;
    }
    function getTaskPath() {
      return taskPath;
    }
    function setIndex(index) {
      subtaskIndex = index;
    }
    function getIndex() {
      return subtaskIndex;
    }
    return {
      setSubtaskPath,
      getSubtaskPath,
      setTaskPath,
      getTaskPath,
      setIndex,
      getIndex,
    };
  })(),
  popupSubtask: function (cat, subtaskIndex, taskIndex, location) {
    const modal = document.createElement("dialog");
    const subtaskPath =
      taskMaster.projects[cat].tasks[taskIndex].subtasks[subtaskIndex];
    const taskPath = taskMaster.projects[cat].tasks[taskIndex];
    const subtask = subtaskPath.details;

    this.currentSubtaskPath.setSubtaskPath(subtaskPath);
    this.currentSubtaskPath.setTaskPath(taskPath);
    this.currentSubtaskPath.setIndex(subtaskIndex);

    modal.innerHTML = "";

    const template = `
            <div class="clear-modal">x</div>
            <div class="subtask-container">
                <div class="popup-subtask-details">
                    <label for="edit-subtask-details">Edit Subtask:</label>
                    <textarea name="edit-subtasks-details" id="edit-subtask-details" maxlength="45" required>${subtask}</textarea>
                </div>
                <div class="error-handler"></div>
                <div class="subtask-buttons">
                    <button type="submit" id="edit-subtask-button">Submit Changes</button>
                    <button type="submit" id="clear-subtask">Clear</button>
                    <button type="submit" id="delete-subtask-button">Delete Subtask</button>
                </div>
            </div>
        `;

    modal.classList.add("subtask-editor");
    location.appendChild(modal);

    this.activateTemplate(modal, template);
    this.activateButtons();
  },
  popupTask: function (path, location, taskIndex) {
    const modal = document.createElement("dialog");
    const taskDescription = path.description;
    const taskTitle = path.title;

    editors.currentSubtaskPath.setTaskPath(path);
    editors.currentSubtaskPath.setIndex(taskIndex);

    modal.innerHTML = "";

    const template = `
            <div class="clear-modal">x</div>
                <div class="task-modal-container">
                    <div class="popup-task-title">
                    <label for="task-input-title">Task title: </label>
                    <input name="task-input-title" id="task-input-title" maxlength="45" required value="${taskTitle}"/>
                </div>
                <div class="popup-task-description">
                    <label for="edit-task-description">Task Description:</label>
                    <textarea name="edit-task-description" id="edit-task-description" maxlength="150" required>${taskDescription}</textarea>
                </div>
                <div class="due-date-container">
                <label for="due-date">(Optional) Change due date, current is ${processDateObjs.processDateFormat(
                  path.due
                )}</label>
                <input type="date" id="due-date" name="due-date"></input>
                </div>
                <div class="priority-container">
                <label for="priority">Priority:</label>
                <div id="priority" class="${
                  path.priority
                }">Click to toggle. Current Priority is ${path.priority}</div>
                </div>
                <div class="error-handler"></div>
                <div class="task-buttons">
                    <button type="submit" id="submit-task-button">Submit Changes</button>
                    <button type="submit" id="clear-task">Clear</button>
                    <button type="submit" id="delete-task-button">Delete Task</button>
                </div>
            </div>
        `;

    modal.classList.add("task-editor");
    location.appendChild(modal);

    this.activateTemplate(modal, template);
    this.activateTaskButtons();
  },
  popupCat: function (path, location) {
    const modal = document.createElement("dialog");
    const catTitle = path.catTitle;
    const catDescription = path.catDescription;

    modal.innerHTML = "";

    const template = `
            <div class="clear-modal">x</div>
                <div class="cat-modal-container">
                    <div class="popup-cat-title">
                    <label for="cat-input-title">Category title: </label>
                    <input name="cat-input-title" id="cat-input-title" maxlength="45" required value="${catTitle}"/>
                </div>
                <div class="popup-cat-description">
                    <label for="edit-cat-description">Category Description:</label>
                    <textarea name="edit-cat-description" id="edit-cat-description" maxlength="150" required>${catDescription}</textarea>
                </div>
                <div class="error-handler"></div>
                <div class="cat-buttons">
                    <button type="submit" id="submit-cat-button">Submit Changes</button>
                    <button type="submit" id="clear-cat">Clear</button>
                </div>
            </div>
        `;

    modal.classList.add("cat-editor");
    location.appendChild(modal);

    this.activateTemplate(modal, template);
    this.activateCatButtons();
  },
  activateTemplate: function (modal, template) {
    const form = document.createElement("form");
    modal.appendChild(form);
    form.innerHTML = template;
    modal.showModal();
  },
  activateTaskButtons: function () {
    const clearModalButton = document.querySelector(".clear-modal");
    const submitChangesButton = document.querySelector("#submit-task-button");
    const clearTaskButton = document.querySelector("#clear-task");
    const deleteTaskButton = document.querySelector("#delete-task-button");
    const priority = document.querySelector("#priority");

    clearTaskButton.addEventListener("click", this.clearTask);
    submitChangesButton.addEventListener("click", this.submitTaskChanges);
    clearModalButton.addEventListener("click", this.clearTaskModal);
    deleteTaskButton.addEventListener("click", this.deleteTask);
    priority.addEventListener("click", priorityHandler.togglePriority);
  },
  activateButtons: function () {
    const clearModalButton = document.querySelector(".clear-modal");
    const submitChangesButton = document.querySelector("#edit-subtask-button");
    const clearSubtaskButton = document.querySelector("#clear-subtask");
    const deleteSubtask = document.querySelector("#delete-subtask-button");

    clearSubtaskButton.addEventListener("click", this.clearSubtask);
    submitChangesButton.addEventListener("click", this.submitSubtaskChanges);
    clearModalButton.addEventListener("click", this.clearSubtaskModal);
    deleteSubtask.addEventListener("click", this.deleteSubtask);
  },
  activateCatButtons: function () {
    const clearModalButton = document.querySelector(".clear-modal");
    const submitChangesButton = document.querySelector("#submit-cat-button");
    const clearCatButton = document.querySelector("#clear-cat");

    clearCatButton.addEventListener("click", this.clearCat);
    submitChangesButton.addEventListener("click", this.submitCatChanges);
    clearModalButton.addEventListener("click", this.clearCatModal);
  },
  clearSubtaskModal: function () {
    const subtaskEditor = document.querySelector(".subtask-editor");
    subtaskEditor.remove();
  },
  clearTaskModal: function () {
    const taskEditor = document.querySelector(".task-editor");
    taskEditor.remove();
  },
  clearCatModal: function () {
    const catEditor = document.querySelector(".cat-editor");
    catEditor.remove();
  },
  clearSubtask: function (e) {
    e.preventDefault();
    const subtask = document.querySelector("#edit-subtask-details");
    subtask.textContent = "";
  },
  clearTask: function (e) {
    e.preventDefault();
    const taskDescription = document.querySelector("#edit-task-description");
    taskDescription.textContent = "";
  },
  clearCat: function (e) {
    e.preventDefault();
    const catDescription = document.querySelector("#edit-cat-description");
    catDescription.textContent = "";
  },
  deleteSubtask: function (e) {
    e.preventDefault();
    let cat = domMain.findOwnerCat();
    let taskPath = editors.currentSubtaskPath.getTaskPath();
    let subtaskIndex = editors.currentSubtaskPath.getIndex();

    taskPath.subtasks.splice([subtaskIndex], 1);

    editors.clearSubtaskModal();
    domMain.defaultLoad(cat);
  },
  deleteTask: function (e) {
    e.preventDefault();
    let cat = domMain.findOwnerCat();
    let taskIndex = editors.currentSubtaskPath.getIndex();

    taskMaster.projects[cat].tasks.splice([taskIndex], 1);

    domMain.defaultLoad(cat);
  },
  submitSubtaskChanges: function (e) {
    e.preventDefault();
    let currentSubtaskPath = editors.currentSubtaskPath.getSubtaskPath();
    let cat = domMain.findOwnerCat();

    let newSubtask = editors.getSubtaskInput();

    let validity = this.checkValidity(newSubtask);

    if (validity === true) {
      currentSubtaskPath.details = newSubtask;
      editors.clearSubtaskModal();
      domMain.defaultLoad(cat);
    } else {
      errorHandler.editorError();
    }
  },
  submitTaskChanges: function (e) {
    e.preventDefault();
    const newTaskDescription = editors.getTaskDescription();
    const newTaskTitle = editors.getTaskTitle();
    const newTaskDue = document.querySelector("#due-date").value;
    const taskPriority = document.querySelector("#priority").className;
    const currentPath = editors.currentSubtaskPath.getTaskPath();
    let cat = domMain.findOwnerCat();

    currentPath.description = newTaskDescription;
    currentPath.title = newTaskTitle;
    currentPath.priority = taskPriority;

    //fixes annoying bug where empty date crashes the full app
    if (newTaskDue == "") {
      domMain.defaultLoad(cat);
    } else {
      currentPath.due = newTaskDue;
      domMain.defaultLoad(cat);
    }
  },
  submitCatChanges: function (e) {
    e.preventDefault();
    const cat = domMain.findOwnerCat();
    const catPath = taskMaster.projects[cat];
    const newCatTitle = document.querySelector("#cat-input-title").value;
    const newCatDescription = document.querySelector(
      "#edit-cat-description"
    ).value;

    if (newCatTitle === cat) {
      //prevent things from blowing up
      catPath.catDescription = newCatDescription;
      //re-render main
      domMain.defaultLoad(cat);
    } else {
      catPath.catTitle = newCatTitle;
      catPath.catDescription = newCatDescription;
      //make a copy, to get a new obj key
      taskMaster.projects[newCatTitle] = catPath;
      //delete the old key
      delete taskMaster.projects[cat];
      //re-render everything
      domMain.defaultLoad(newCatTitle);
      domSidebar.pubCats();
    }
  },
  getTaskDescription: function () {
    const taskDescription = document.querySelector(
      "#edit-task-description"
    ).value;
    return taskDescription;
  },
  getTaskTitle: function () {
    const taskTitle = document.querySelector("#task-input-title").value;
    return taskTitle;
  },
  getSubtaskInput: function () {
    const subtask = document.querySelector("#edit-subtask-details").value;
    return subtask;
  },
  getNewSubtaskInput: function () {
    const subtask = document.querySelector("#create-subtask-details").value;
    return subtask;
  },
  checkValidity: function (operand) {
    const isValid = Object.values(domManager.conditions).every((condition) =>
      condition(operand)
    );
    return isValid;
  },
  precheckType: function (e) {
    let cat = editors.getCat();
    if (cat === "obyect-vremeni") {
      dateDomManager.addNewSubtask(e);
    } else {
      editors.addNewSubtask(e);
    }
  },
  addNewSubtask: function (e) {
    let location = e.target.parentElement;
    let taskIndex = editors.getTaskIndex(e.target);
    let cat = editors.getCat();

    //this is communicating with line 225
    const modal = document.createElement("dialog");
    const subtaskPath = taskMaster.projects[cat].tasks[taskIndex].subtasks;

    editors.currentSubtaskPath.setSubtaskPath(subtaskPath);
    modal.innerHTML = "";

    const template = `
            <div class="clear-modal">x</div>
            <div class="subtask-container">
            <div class="subtask-location">This subtask is under <span>${cat} > ${taskMaster.projects[cat].tasks[taskIndex].title}</span></div>
                <div class="popup-subtask-details">
                    <label for="create-subtask-details">Create a new Subtask:</label>
                    <textarea name="create-subtasks-details" id="create-subtask-details" maxlength="150" minlength="5" placeholder ="Add details here" required></textarea>
                </div>
                <div class="error-handler"></div>
                <div class="subtask-buttons">
                    <button type="submit" id="create-subtask-button">Submit Changes</button>
                </div>
            </div>
        `;

    modal.classList.add("subtask-editor");
    location.appendChild(modal);

    editors.activateTemplate(modal, template);
    editors.activateNewSubtaskButtons();
  },
  activateNewSubtaskButtons: function () {
    const clearModalButton = document.querySelector(".clear-modal");
    const createSubtask = document.querySelector("#create-subtask-button");

    createSubtask.addEventListener("click", this.submitNewSubtask);
    clearModalButton.addEventListener("click", this.clearSubtaskModal);
  },
  submitNewSubtask: function (e) {
    e.preventDefault();
    //this leads to target task's subtask array
    let currentSubtaskPath = editors.currentSubtaskPath.getSubtaskPath();
    let cat = domMain.findOwnerCat();
    let newSubtaskDetails = editors.getNewSubtaskInput();
    let subtask = new taskMaster.Subtask(newSubtaskDetails);

    currentSubtaskPath.push(subtask);
    domMain.defaultLoad(cat);
  },
};

const errorHandler = {
  //DONT TOUCH OR IMPLEMENT.
  editorError: function () {
    const errorHandler = document.querySelector(".error-handler");

    errorHandler.textContent =
      "Please don't leave fields blank, or exceed the 45 character limit.";
  },
};

//This was so confusing to look at, I regret not documenting this. For future me: This just initiates the datesObj - but it is never re-used despite being perfectly modular
function updateListener(cats) {
  changeListener.pubChangesToDates(cats);
  //prevents circular dependencies
  processDateObjs.updateDomWithDates();
}

updateListener(taskMaster.projects);

domSidebar.pubCats();
export { domManager, domMain };
