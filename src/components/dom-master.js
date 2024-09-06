import * as taskMaster from "./task-master";
import { changeListener } from "./sub-to-changes";

//make it sleek - move it down after finishing
function updateListener(cats){
    changeListener.pubChangesToDates(cats);
    //prevents circular dependencies
    processDateObjs.updateDomWithDates();
};



const processDateObjs = {
    updateDomWithDates: function(){
        console.log(taskMaster.dateObjs)
        this.bindToDom();
    },
    bindToDom: function(){
        const todayDiv = document.querySelector(".today");
        const soonDiv = document.querySelector(".soon");
        const overdueDiv = document.querySelector(".overdue");
        const anytimeDiv = document.querySelector(".anytime");

        todayDiv.addEventListener("click", this.todayToDom)
        soonDiv.addEventListener("click", this.soonToDom);
        overdueDiv.addEventListener("click", this.overdueToDom);
        anytimeDiv.addEventListener("click", this.anytimeToDom)
    },
    todayToDom: function(){
        domMain.displayTasks(taskMaster.dateObjs.today, 'date');
    },
    soonToDom: function(){
        domMain.displayTasks(taskMaster.dateObjs.soonArray, 'date');
    },
    overdueToDom: function(){
        domMain.displayTasks(taskMaster.dateObjs.overdueArray, 'date')
    },
    anytimeToDom: function(){
        domMain.displayTasks(taskMaster.dateObjs.anytimeArray, 'date')
    }
    //functions are not done, continue on line 254 to make tasks editable. This is just the MVP, we need a better implementation where you can change stuff from the date Objs themselves;

    //make the line 252 callback to here so we can generate subtasks and toolbar but in our own way that will be applicable for date arrays. 
}


//can't change domManager name now - couldn't use "this." due to context issues
const domManager = {
    findDom: function(){
        const addCategoryButton = document.querySelector(".add-cat");

        addCategoryButton.addEventListener("click", this.categoryPopup)

        this.addTaskButton();
    },
    bindAttributes: function (target, pointer){
        Object.keys(pointer).forEach(attr => {
            target.setAttribute(attr, pointer[attr]);
        })
    },
    addTaskButton: function(){
        const main = document.querySelector(".main");
        const addTask = document.createElement("button");

        addTask.textContent = "Add Tasks"
        addTask.classList.add("add-task")

        main.appendChild(addTask);
        addTask.addEventListener("click", domMain.taskPopup);
    },
    attributes: {
        catTitle: {
            name: 'cat-title',
            type: 'text',
            id: 'cat-title',
            required: '',
        },
        catTitleLabel: {
            for: 'cat-title'
        },
        catDescription: {
            name: 'cat-description',
            type: 'text',
            id: 'cat-description',
            required: '',
            maxlength: '45'
        },
        catDescriptionLabel: {
            for: 'cat-description'
        },
        closeModal: {
            id: 'close-modal',
        }
    },
    conditions: {
        notNull: (input) => input !== null,
        notEmpty: (input) => input !== '',
        notUndefined: (input) => input !== undefined,
        maxlength: (input) => input.length <= 45
    },
    categoryPopup: function(){
        const modalSpace = document.querySelector(".modal-space");
        const popup = document.createElement("dialog");
        const form = document.createElement("form");
        const formDescription = document.createElement("p");
        const catTitleContainer = document.createElement("div")
        const catTitleLabel = document.createElement('label');
        const catTitle = document.createElement('input')
        const catDescriptionContainer = document.createElement("div");
        const catDescriptionLabel = document.createElement("label");
        const catDescription = document.createElement("textarea");
        const catSubmitButton = document.createElement("button");
        const closeModalButton = document.createElement('span');


        //The way to prevent multiple modals from being created
        modalSpace.innerHTML = ''

        modalSpace.appendChild(popup)
        popup.appendChild(form);
        form.appendChild(closeModalButton)
        form.appendChild(formDescription);
        form.appendChild(catTitleContainer);
        catTitleContainer.appendChild(catTitleLabel);
        catTitleContainer.appendChild(catTitle);
        form.appendChild(catDescriptionContainer);
        catDescriptionContainer.appendChild(catDescriptionLabel)
        catDescriptionContainer.appendChild(catDescription);
        form.appendChild(catSubmitButton);


        domManager.bindAttributes(catTitle, domManager.attributes.catTitle);
        domManager.bindAttributes(catDescription, domManager.attributes.catDescription);
        domManager.bindAttributes(catDescriptionLabel, domManager.attributes.catDescriptionLabel)
        domManager.bindAttributes(catTitleLabel, domManager.attributes.catTitleLabel)
        domManager.bindAttributes(closeModalButton, domManager.attributes.closeModal)
        catSubmitButton.setAttribute('id', 'submit-cats')

        formDescription.textContent = "Please fill in the categories and text";
        catTitleLabel.textContent = "Enter the Category title:";
        catDescriptionLabel.textContent = "Please describe the Task Category:";
        closeModalButton.textContent = 'x';
        catSubmitButton.textContent = 'Submit'

        popup.showModal();

        closeModalButton.addEventListener("click", domManager.clearModal);
        catSubmitButton.addEventListener('click', domManager.createCat);
    },
    clearModal: function(){
        const modalSpace = document.querySelector(".modal-space");
        modalSpace.innerHTML = '';
    },
    createCat: function(e){
        e.preventDefault();

        const catTitle = document.querySelector("#cat-title").value;
        const catDescription = document.querySelector("#cat-description").value;

        const check1 = domManager.checkValidity(catTitle)
        const check2 = domManager.checkValidity(catDescription)

        if (check1 == true && check2 == true){
            taskMaster.taskManager.addCat(catTitle, catDescription)
            domManager.clearModal();
            domSidebar.pubCats();
        }
    },
    checkValidity: function(operand){
        const isValid = Object.values(domManager.conditions).every(condition => condition(operand));
        return isValid;
    },
};

const domSidebar = {
    pubCats: function (){
        const catsContainer = document.querySelector(".cats");
        //prevents duplications
        domMain.taskIndex = 0;
        catsContainer.innerHTML = '';
        Object.keys(taskMaster.projects).forEach(key => {
            let cat = document.createElement("div");
            cat.textContent = taskMaster.projects[key].catTitle;
            cat.setAttribute("class", taskMaster.projects[key].catTitle)
            catsContainer.appendChild(cat);
            cat.addEventListener("click", domMain.renderCat)
        });
    },
}

const domMain = {
    //depends on what cat user selects, the tasks get displayed
    renderCat: function(e){
        domMain.taskIndex *= 0;
        //communicate with domMain to show tasks
        let catTitle = e.target.getAttribute('class');
        let catDescription = taskMaster.projects[catTitle].catDescription
        domMain.displayCat(catTitle, catDescription)
    },
    renderDate: function(e){
        //replicate renderCat and throw it into displayDate
    },
    defaultLoad: function(cat){
        domMain.taskIndex *= 0;
        let catTitle = taskMaster.projects[cat].catTitle;
        let catDescription = taskMaster.projects[cat].catDescription;
        domMain.displayCat(catTitle, catDescription);
    },
    displayCat: function(catTitle, catDescription){
        const cat = document.querySelector(".cat");
        cat.textContent = catTitle;
        //subtle but important, helps to identify which cat does a task belong to later down the code
        cat.setAttribute("id", catTitle)

        //After a while, I concluded this is the best place to put this function:
        updateListener(taskMaster.projects);

        const catDetails = document.querySelector(".cat-description");
        catDetails.textContent = catDescription;

        domMain.createToolbar(catDetails, "cat");
        domMain.renderTasks(catTitle);
    },
    renderTasks: function(catTitle){
        const taskArray = taskMaster.projects[catTitle].tasks;
        domMain.displayTasks(taskArray, "normal");
    },
    displayTasks: function(taskArray, type){
        const taskContainer = document.querySelector(".task-container");

        taskContainer.innerHTML = '';
            editors.taskTracker *= 0

        taskArray.forEach((element) => {
            let taskTitle = document.createElement('div');
            let taskDescription = document.createElement('div');
            let detailsContainer = document.createElement("div");

            taskTitle.textContent = element.title
            taskDescription.textContent = element.description;

            taskContainer.appendChild(taskTitle);
            taskContainer.appendChild(detailsContainer);
            detailsContainer.appendChild(taskDescription);

            taskTitle.setAttribute("class", 'task-title');
            taskDescription.classList.add('task-description');
            taskDescription.classList.add(`${element.priority}`)
            detailsContainer.setAttribute("class", 'details-container')

            if (type === 'date'){
                domMain.createToolbar(taskDescription, 'tasks');
                return
            } else {
                domMain.renderSubtasks(element.subtasks, detailsContainer);
                //if you ever wonder why index starts at 3, follow this path
                domMain.createToolbar(taskDescription, 'tasks');
                this.createSubSection();
            };
        });
    },
    renderSubtasks: function(subtaskArray, location){
        let subtaskContainer = document.createElement("div");

        location.appendChild(subtaskContainer);

        subtaskContainer.classList.add( `subtask-container${domMain.taskIndex}`);
        subtaskContainer.setAttribute("id", `${domMain.taskIndex}`);
        //unique identifier of finding subtask within a task
        let indexOfSubtask = 0;

        subtaskArray.forEach((element) => {
            let subtaskDetails = document.createElement("div")
            let subtaskStatus = document.createElement("div");

            subtaskDetails.textContent = element.details;
            subtaskStatus.textContent = element.status;

            subtaskContainer.appendChild(subtaskStatus);
            subtaskContainer.appendChild(subtaskDetails);

            subtaskDetails.classList.add('subtask-details');
            subtaskDetails.classList.add(`index${editors.subtaskTracker}`);
            subtaskDetails.classList.add(`subtask${indexOfSubtask}`);
            domMain.createToolbar(subtaskDetails, "subtasks");

            subtaskStatus.setAttribute("class", 'subtask-status');
            indexOfSubtask += 1;
        });
    },
    createSubSection: function(){
        const taskContainer = document.querySelector(`.subtask-container${domMain.taskIndex}`);

        const addSubtask = document.createElement("div");

        addSubtask.textContent = '+ Add a subtask';

        addSubtask.classList.add("add-subtask");

        taskContainer.appendChild(addSubtask);
        domMain.taskIndex += 1;

        addSubtask.addEventListener("click", editors.addNewSubtask)
    },
    taskIndex: 0,
    taskPopup: function(){
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
        `
        domMain.clearModal(modalSpace);
        modalSpace.appendChild(modal);
        modal.innerHTML = modalTemplate;
        modal.showModal();

        const closeModal = document.querySelector("#clear-task-modal");
        const submitTasksButton = document.querySelector("#submit-tasks");
        const priority = document.querySelector("#priority");

        closeModal.addEventListener("click", domMain.clearModal)
        submitTasksButton.addEventListener("click", domMain.createTask)
        priority.addEventListener("click", priorityHandler.togglePriority);
    },
    clearModal: function(){
        const taskSpace = document.querySelector(".modal-space-tasks")
        taskSpace.innerHTML = '';
    },
    createTask: function(e){
        e.preventDefault();

        const taskTitle = document.querySelector("#task-title").value;
        const taskDescription = document.querySelector("#task-description").value;
        const taskDue = document.querySelector("#due-date").value;
        const taskPriority = document.querySelector("#priority").className;

        const check1 = domManager.checkValidity(taskTitle);
        const check2 = domManager.checkValidity(taskDescription);

        if (check1 == true && check2 == true){
            let catTitle = domMain.findOwnerCat()
            taskMaster.taskManager.addTask(catTitle, taskTitle, taskDescription, taskDue, taskPriority);
            domMain.clearModal();
            //prevents error 732
            domMain.taskIndex = 0;
            domMain.renderTasks(catTitle);
        }
    },
    findOwnerCat: function(){
        const cat = document.querySelector(".cat");
        return cat.getAttribute("id");
    },
    createToolbar: function(parentElement, type){
        const options = document.createElement("span");

        parentElement.appendChild(options);

        options.classList.add("options-on-hover");
        options.classList.add(type);
        options.addEventListener("click", editors.render);

        domMain.trackToolbar(options, type);

        if (type === 'subtasks') {
            options.textContent = '[edit]'
        } else {
            options.textContent = '...';
        }
    },
    //associateToolbar: tracks where it belongs
    trackToolbar: function(container, type) {
        if (type === 'subtasks') {
            container.setAttribute("id", `index${editors.subtaskTracker}`);
            editors.indexTracker(type);
        } else if (type === 'tasks'){
            container.setAttribute("id", `task-index${editors.taskTracker}`)
            editors.indexTracker(type);
        };
    }
};

const priorityHandler = {
    i: 0,
    indexTracker: function(){
        if (this.i == this.priorities.length - 1){
            this.i = 0;
        } else {
            this.i += 1;
        }
    },
    togglePriority: function(e){
        e.target.setAttribute("class", priorityHandler.priorities[priorityHandler.i])
        e.target.textContent = priorityHandler.priorities[priorityHandler.i]

        priorityHandler.indexTracker();
    },
    priorities: [
        "Urgent",
        "Overdue",
        "Completed",
        "Normal"
    ],
};

const editors = {
    //tracker to track which subtasks is edited
    subtaskTracker: 0,
    taskTracker: 0,
    indexTracker: function(type){
        if (type === 'subtasks'){
            this.subtaskTracker += 1;
        } else if ( type == 'tasks'){
            this.taskTracker += 1;
        }
    },
    render: function(e){
        let classArray = e.target.classList;
        editors.checkType(classArray, e);
    },
    checkType: function(classArray, e){
        //step 3 - find a way to re-use processElements
        if (classArray.contains("subtasks")){
            editors.editSubtask(e);
        } else if (classArray.contains("tasks")){
            editors.editTask(e);
        } else {
            editors.editCat(e);
        }
    },
    editSubtask: function(e){
        let targetIndex = e.target.getAttribute("id");
        let targetSubtask = document.querySelector(`.${targetIndex}`);

        editors.processElements(targetSubtask)
    },
    editTask: function(e){
        const target = e.target.getAttribute("id").split('task-index')[1];
        const cat = this.getCat();
        const taskPath = taskMaster.projects[cat].tasks[target];

        const location = e.target.parentElement;

        editors.popupTask(taskPath, location, target);
    },
    editCat: function(e){
        const cat = editors.getCat();
        const catPath = taskMaster.projects[cat];

        const location = e.target.parentElement;

        editors.popupCat(catPath, location);
    },
    processElements: function(target){
        let subtaskIndex = this.getSubtaskIndex(target);
        let taskIndex = this.getTaskIndex(target);
        let cat = this.getCat();

        this.popupSubtask(cat, subtaskIndex, taskIndex, target)
    },
    getSubtaskIndex: function(target){
        let subtaskIndex = target.classList[2].split('subtask')[1];
        return subtaskIndex;
    },
    getTaskIndex: function(target){
        let taskIndex = target.parentNode.getAttribute("id");
        return taskIndex;
    },
    getCat: function(){
        let cat = document.querySelector(".cat");
        let catId = cat.getAttribute("id");
        return catId;
    },
    //overlooked the modularization chance - this is applied for the task too
    currentSubtaskPath: (function(){
        let currentPath;
        let taskPath;
        let subtaskIndex;
        function setSubtaskPath(path){
            currentPath = path;
        };
        function getSubtaskPath(){
            return currentPath;
        };
        function setTaskPath(path){
            taskPath = path;
        };
        function getTaskPath(){
            return taskPath;
        };
        function setIndex(index){
            subtaskIndex = index;
        };
        function getIndex(){
            return subtaskIndex;
        };
        return {
            setSubtaskPath,
            getSubtaskPath,
            setTaskPath,
            getTaskPath,
            setIndex,
            getIndex
            };
    })(),
    popupSubtask: function(cat, subtaskIndex, taskIndex, location){
        const modal = document.createElement("dialog");
        const subtaskPath = taskMaster.projects[cat].tasks[taskIndex].subtasks[subtaskIndex];
        const taskPath = taskMaster.projects[cat].tasks[taskIndex];
        const subtask = subtaskPath.details;

        this.currentSubtaskPath.setSubtaskPath(subtaskPath);
        this.currentSubtaskPath.setTaskPath(taskPath);
        this.currentSubtaskPath.setIndex(subtaskIndex);

        modal.innerHTML = '';

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
        `

        modal.classList.add("subtask-editor");
        location.appendChild(modal);

        this.activateTemplate(modal, template)
        this.activateButtons();
    },
    popupTask: function(path, location, taskIndex){
        const modal = document.createElement("dialog");
        const taskDescription = path.description;
        const taskTitle = path.title;

        editors.currentSubtaskPath.setTaskPath(path);
        editors.currentSubtaskPath.setIndex(taskIndex);

        modal.innerHTML = '';

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
                    <button type="submit" id="delete-task-button">Delete Task</button>
                </div>
            </div>
        `

        modal.classList.add("task-editor");
        location.appendChild(modal);

        this.activateTemplate(modal, template);
        this.activateTaskButtons();
    },
    popupCat: function(path, location){
        const modal = document.createElement("dialog");
        const catTitle = path.catTitle;
        const catDescription = path.catDescription;

        modal.innerHTML = '';

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
    activateTemplate: function(modal, template){
        const form = document.createElement("form");
        modal.appendChild(form);
        form.innerHTML = template;
        modal.showModal();
    },
    activateTaskButtons: function(){
        const clearModalButton = document.querySelector(".clear-modal");
        const submitChangesButton = document.querySelector("#submit-task-button");
        const clearTaskButton = document.querySelector("#clear-task");
        const deleteTaskButton = document.querySelector("#delete-task-button");

        clearTaskButton.addEventListener("click", this.clearTask);
        submitChangesButton.addEventListener("click", this.submitTaskChanges);
        clearModalButton.addEventListener("click", this.clearTaskModal);
        deleteTaskButton.addEventListener("click", this.deleteTask)
    },
    activateButtons: function(){
        const clearModalButton = document.querySelector(".clear-modal");
        const submitChangesButton = document.querySelector("#edit-subtask-button");
        const clearSubtaskButton = document.querySelector("#clear-subtask");
        const deleteSubtask = document.querySelector("#delete-subtask-button")

        clearSubtaskButton.addEventListener("click", this.clearSubtask);
        submitChangesButton.addEventListener("click", this.submitSubtaskChanges);
        clearModalButton.addEventListener("click", this.clearSubtaskModal);
        deleteSubtask.addEventListener("click", this.deleteSubtask);
    },
    activateCatButtons: function(){
        const clearModalButton = document.querySelector(".clear-modal");
        const submitChangesButton = document.querySelector("#submit-cat-button");
        const clearCatButton = document.querySelector("#clear-cat");

        clearCatButton.addEventListener("click", this.clearCat);
        submitChangesButton.addEventListener("click", this.submitCatChanges);
        clearModalButton.addEventListener("click", this.clearCatModal);
    },
    clearSubtaskModal: function(){
        const subtaskEditor = document.querySelector(".subtask-editor");
        subtaskEditor.remove();
    },
    clearTaskModal: function(){
        const taskEditor = document.querySelector(".task-editor");
        taskEditor.remove();
    },
    clearCatModal: function(){
        const catEditor = document.querySelector(".cat-editor");
        catEditor.remove();
    },
    clearSubtask: function(e){
        e.preventDefault();
        const subtask = document.querySelector("#edit-subtask-details");
        subtask.textContent = '';
    },
    clearTask: function(e){
        e.preventDefault();
        const taskDescription = document.querySelector("#edit-task-description");
        taskDescription.textContent = '';
    },
    clearCat: function(e){
        e.preventDefault();
        const catDescription = document.querySelector("#edit-cat-description");
        catDescription.textContent = '';
    },
    deleteSubtask: function(e){
        e.preventDefault();
        let cat = domMain.findOwnerCat();
        let taskPath = editors.currentSubtaskPath.getTaskPath();
        let subtaskIndex = editors.currentSubtaskPath.getIndex();

        taskPath.subtasks.splice([subtaskIndex], 1);
        
        domMain.defaultLoad(cat);
    },
    deleteTask: function(e){
        e.preventDefault();
        let cat = domMain.findOwnerCat();
        let taskIndex = editors.currentSubtaskPath.getIndex();

        taskMaster.projects[cat].tasks.splice([taskIndex], 1);

        domMain.defaultLoad(cat);
    },
    submitSubtaskChanges: function(e){
        e.preventDefault();
        let currentSubtaskPath = editors.currentSubtaskPath.getSubtaskPath()
        let cat = domMain.findOwnerCat();

        let newSubtask = editors.getSubtaskInput();

        let validity = this.checkValidity(newSubtask);

        if (validity === true) {
            currentSubtaskPath.details = newSubtask;
            domMain.defaultLoad(cat)
        } else {
            errorHandler.editorError()
        }
    },
    submitTaskChanges: function(e){
        e.preventDefault();
        const newTaskDescription = editors.getTaskDescription();
        const newTaskTitle = editors.getTaskTitle();
        const currentPath = editors.currentSubtaskPath.getTaskPath();
        let cat = domMain.findOwnerCat();

        currentPath.description = newTaskDescription;
        currentPath.title = newTaskTitle;
        domMain.defaultLoad(cat);
    },
    submitCatChanges: function(e){
        e.preventDefault();
        const cat = domMain.findOwnerCat();
        const catPath = taskMaster.projects[cat];
        const newCatTitle = document.querySelector("#cat-input-title").value;
        const newCatDescription = document.querySelector("#edit-cat-description").value;

        if (newCatTitle === cat){
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
        };
    },
    getTaskDescription: function(){
        const taskDescription = document.querySelector("#edit-task-description").value;
        return taskDescription;
    },
    getTaskTitle: function(){
        const taskTitle = document.querySelector("#task-input-title").value;
        return taskTitle
    },
    getSubtaskInput: function(){
        const subtask = document.querySelector("#edit-subtask-details").value;
        return subtask;
    },
    getNewSubtaskInput: function(){
        const subtask = document.querySelector("#create-subtask-details").value;
        return subtask;
    },
    checkValidity: function(operand){
        const isValid = Object.values(domManager.conditions).every(condition => condition(operand));
        return isValid
    },
    addNewSubtask: function(e){
        let location = e.target.parentElement;
        let taskIndex = editors.getTaskIndex(e.target);
        let cat = editors.getCat();

        //this is communicating with line 225
        const modal = document.createElement("dialog");
        const subtaskPath = taskMaster.projects[cat].tasks[taskIndex].subtasks;

        editors.currentSubtaskPath.setSubtaskPath(subtaskPath);
        modal.innerHTML = '';

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
    activateNewSubtaskButtons: function(){
        const clearModalButton = document.querySelector(".clear-modal");
        const createSubtask = document.querySelector("#create-subtask-button");

        createSubtask.addEventListener("click", this.submitNewSubtask);
        clearModalButton.addEventListener("click", this.clearSubtaskModal);
    },
    submitNewSubtask: function(e){
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
    editorError: function(){
        const errorHandler = document.querySelector(".error-handler");

        errorHandler.textContent = "Please don't leave fields blank, or exceed the 45 character limit."
    },
};


domSidebar.pubCats();
export { domManager, domMain };

    /*
    To do:

    4 - Date handler: Around 50-60% done, but will have to be re-visited for MMM-DD format, since the tasks will look like this:

    [JAN/21] Conduct Market Research ...
    (task description and et all here)
        
    5 - Visual UI/UX and making the code here more approachable
    
    6 - a global object that sorts stuff by dates : or just an event listener that appends the correct DOM

    7 - JSONify everything

    8 - CAT remover last, doesn't make sense to leave users on a blank screen if they can delete from main; instead the only options users should have is to delete from the sidebar from the settings icon - nothing else. 

    It works also as an insurance, to prevent "oops I didnt know if I delete the category, I delete everything in the category"

    Bonus points: add WARNINGS
    */


    /*  BUG DOCUMENTATION:
    Old bug - possibly fixed now but I will keep this for documentation just in case:

    Fix bugs, error on line 471: i)subtaskPath is undefined (when creating a new cat and coming back - to try to delete one of the first subtasks)

    More info on 471: every other subtask returns the same error once activated. 

    ii) Uncaught TypeError: _task_master__WEBPACK_IMPORTED_MODULE_0__.projects[cat].tasks[taskIndex] is undefined
    dom-master.js:719:28 --> 

    happens when i delete subtasks on main, come to another category, and delete subtasks there.

    error 732 (719 but more lines of code were added) was caused whenever new task was created, and we attempted to create a new subtask under that new task. The issue was that the current system relies on DOM id's and DOM-set-index to get the index of the task/subtask.

    This has let to error 732, which was caused by the fact that the add-task method did not reset domMain.taskIndex, which made the DOM counter go above the actual task index.

    The fix was (and will be for future errors like this to do with line 732), is to trace it to the point the cats, tasks, and subtasks are reset - and reset the taskIndex at domMain as well

    */