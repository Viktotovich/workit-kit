import './styles.css';
import { Task, Category, Subtask, projects } from './components/task-master.js';
import {domManager, domMain} from './components/dom-master.js';
import { getDateInformation } from './components/date-handler.js';

domManager.findDom();
//keep the default load as whatever for now, but change it to today or soon. Users have the ability to delete all cats except upcoming tasks, and that could potential wreck havoc when mixed with JSON Local storage
domMain.defaultLoad("Work Tasks")

console.log(projects)
