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

export { Task, Category, Subtask};



/* How I want things to look like:
const projects = {
    myProjects: {
        catDescription: '',
        catTitle: '',
        tasks: [
            task1 = {
                name: 'example task',
                description: 'example task description',
                due: "12/08/2024",
                subtasks: [
                    subtask1 = {
                        description: '',
                        completed: 'yes'
                    },
                    subtask2 = {
                        description: '',
                        completed: 'no'
                    }
                ],
            },
            task2 = {
                name: 'example task',
                description: 'example task description',
                due: "12/08/2024",
                subtasks: [
                    subtask1 = {
                        name: xyz,
                        description: ''
                    },
                    subtask2 = {
                        name: zyx,
                        description: ''
                    }
                ],
            },
        ]
    },
    myWork: {
        catDescription: '',
        catTitle: '',
        tasks: [
            task1 = {
                name: 'example task',
                description: 'example task description',
                due: "12/08/2024",
                notes: "optional notes"
            },
            task2 = {
                name: 'example task',
                description: 'example task description',
                due: "12/08/2024",
                notes: "optional notes"
            },
        ]
    }
}

*/
