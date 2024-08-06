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
        this.due = due;
        this.priority = priority;
        this.subtasks = [];
    }
}

class Subtask {
    constructor(details, status){
        this.details = details,
        this.status = 'incomplete'
    }
}

//super duper crucial
const projects = {};

//adding example tasks - without polluting names
(function(){
    const workCat = new Category("Work Tasks", "This category contains all tasks pertaining to work");

    projects.workCat = workCat;

    function exampleTasks() {
        const exampleTask1 = new Task("Get Followers", "Run a social media campaign to generate new followers", '31/08/2024', 'high');

        //either move this to own object, or do something else
        subtasksObj.exampleSubtasks1(exampleTask1)

        const exampleTask2 = new Task("Market Research", "Conduct a market research on our client's company, to better understand the client Avatar", "20/08/2024", 'high');

        subtasksObj.exampleSubtasks2(exampleTask2);

        const exampleTask3 = new Task("Find a lead-magnet", 'Find or create a lead magnet that can help generate more traffic to our website', '25/08/2024', 'low');

        const exampleTask4 = new Task("Instagram Posts", 'Start making instagram posts for our Instagram account V and Bruno', 'today', 'medium');

        workCat.tasks.push(exampleTask1, exampleTask2, exampleTask3, exampleTask4);
    };

    exampleTasks();
})();

const subtasksObj = {
    subtasks1: (exampleTask1) => {
        const subtask1 = new Subtask("Create a buget");
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

export { Task, Category, Subtask, projects};