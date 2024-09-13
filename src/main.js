import './styles.css';
import { projects } from './components/task-master.js';
import {domManager, domMain} from './components/dom-master.js';
import { changeListener } from './components/sub-to-changes.js';
changeListener.loadChanges()

domManager.findDom();
//keep the default load as whatever for now, but change it to today or soon - looks better
domMain.defaultLoad("Work Tasks")

console.log(projects) 