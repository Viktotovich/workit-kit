import { getDateInformation, defaultDue } from "./date-handler";

class Category {
    constructor(catTitle, catDescription){
        this.catTitle = catTitle;
        this.catDescription = catDescription;
        this.tasks = [];
    };
};

class Task {
    constructor(title, description, due, priority){
        this.title = title;
        this.description = description;
        this.due = this.processDate(due);
        this.priority = priority;
        this.subtasks = [];
    }

    processDate(date){
        if (date === '' || date === undefined || date === NaN){
            return defaultDue;
        } else {
            return getDateInformation.formatDueDate(date);
        }
    }
}

class Subtask {
    constructor(details, status = 'incomplete'){
        this.details = details,
        this.status = status
    }
}

//super duper crucial
const projects = {};
const dateObjs = {};

const taskManager = {
    addCat: function(catTitle, catDescription){
        const newcat = new Category(catTitle, catDescription);
        projects[catTitle] = newcat;
    },
    addTask: function(catTitle, taskTitle, taskDescription, taskDue = 'anytime', taskPriority = 'normal'){
        const newTask = new Task(taskTitle, taskDescription, taskDue, taskPriority);
        projects[catTitle].tasks.push(newTask)
    }
}

//Mock stuff to fill the display
const workCat = new Category("Work Tasks", "This category contains all tasks pertaining to work");

projects[workCat.catTitle] = workCat;

const exampleTasksObj = {
    addExampleTasks: ()=> {
        const exampleTask1 = new Task("Get Followers", "Run a social media campaign to generate new followers", '08/31/2024', 'urgent');

        //either move this to own object, or do something else
        exampleSubtasksObj.subtasks1(exampleTask1)

        const exampleTask2 = new Task("Market Research", "Conduct a market research on our client's company, to better understand the client Avatar", "08/20/2024", 'overdue');

        exampleSubtasksObj.subtasks2(exampleTask2);

        const exampleTask3 = new Task("Find a lead-magnet", 'Find or create a lead magnet that can help generate more traffic to our website', '09/03/2024', 'normal');

        const exampleTask4 = new Task("Instagram Posts", 'Start making instagram posts for our Instagram account V and Bruno', '', 'normal');

        workCat.tasks.push(exampleTask1, exampleTask2, exampleTask3, exampleTask4);
    }
};

const exampleSubtasksObj = {
    subtasks1: (exampleTask1) => {
        const subtask1 = new Subtask("Create a budget");
        const subtask2 = new Subtask("Determine project targets");
        const subtask3 = new Subtask("Choose a good framework to follow");

        exampleTask1.subtasks.push(subtask1, subtask2, subtask3);
    },
    subtasks2: (exampleTask2) => {
        const subtask1 = new Subtask("Create a blueprint of the client's business");
        const subtask2 = new Subtask("Video call the client and have a meeting");
        const subtask3 = new Subtask("Share the findings with Vlad");

        exampleTask2.subtasks.push(subtask1, subtask2, subtask3);
    },
}

exampleTasksObj.addExampleTasks()
export { Task, Category, Subtask, projects, taskManager, dateObjs};