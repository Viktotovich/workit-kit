import './styles.css';
import { Task, Category, Subtask, projects } from './components/task-master.js';
import {domManager, domMain} from './components/dom-master.js';

domManager.findDom();
//keep the default load as whatever for now, but change it to today or soon - looks better
domMain.defaultLoad("Work Tasks")

console.log(projects)
