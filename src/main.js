import './styles.css';
import { Task, Category, Subtask } from './components/task-master.js';
import {domManager} from './components/dom-master'

const projects = {};
domManager();

//adding example tasks - without polluting names
(function(){
    const workCat = new Category("Work Tasks", "This category contains all tasks pertaining to work");

    projects.workCat = workCat;

    function exampleTasks() {
        const exampleTask1 = new Task("Get Followers", "Run a social media campaign to generate new followers", '31/08/2024', 'high');

        const exampleTask2 = new Task("Market Research", "Conduct a market research on our client's company, to better understand the client Avatar", "20/08/2024", 'high');

        const exampleTask3 = new Task("Find a lead-magnet", 'Find or create a lead magnet that can help generate more traffic to our website', '25/08/2024', 'low');

        const exampleTask4 = new Task("Instagram Posts", 'Start making instagram posts for our Instagram account V and Bruno', 'today', 'medium');

        workCat.tasks.push(exampleTask1, exampleTask2, exampleTask3, exampleTask4);
    };

    exampleTasks();
})();

console.log(projects.workCat)

