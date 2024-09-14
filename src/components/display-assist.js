import * as taskMaster from "./task-master";
import { changeListener } from "./sub-to-changes";
import vAndBrunoLogo from '../assets/images/v-and-bruno.png';


const visualCues = {
    currentDateType: null,
    addToggleListener: function(domElement){
        domElement.addEventListener("click", this.statusToggle);
    },
    statusToggle: function(e){
        const list = e.target.classList;

        if (list.contains("incomplete")){
            list.remove("incomplete");
            list.add("complete");
            visualCues.processUpdate(e, "complete")
        } else {
            list.remove("complete");
            list.add("incomplete");
            visualCues.processUpdate(e, "incomplete");
        };
    },
    processUpdate: function(e, newStatus){
        changeListener.saveChanges();
        const targetSubtask = e.target;
        const subtaskIndex = this.getSubtaskIndex(targetSubtask);
        const taskIndex = this.getTaskIndexForToggle(targetSubtask);
        const cat = this.getCat();

        if (cat === 'obyect-vremeni'){
            this.publishUpdateDate(subtaskIndex, taskIndex, newStatus)
        } else {
            this.publishUpdate(cat, subtaskIndex, taskIndex, newStatus);
        }
    },
    publishUpdate: function(cat, subtaskIndex, taskIndex, newStatus){
        const subtaskPath = taskMaster.projects[cat].tasks[taskIndex].subtasks[subtaskIndex];

        subtaskPath.status = newStatus;
    },
    publishUpdateDate: function(subtaskIndex, indexOfTask, newStatus){
        //taskIndex got name polluted and caused a weird error, had to rename
        const path = taskMaster.dateObjs[this.currentDateType][indexOfTask].subtasks[subtaskIndex];

        path.status = newStatus;
    },
    getSubtaskIndex: function(target){
        let subtaskIndex = target.classList[2].split('subtask')[1];
        return subtaskIndex;
    },
    getTaskIndexForToggle: function(target){
        let taskIndex = target.parentNode.parentNode.getAttribute("id");
        return taskIndex;
    },
    getCat: function(){
        let cat = document.querySelector(".cat");
        let catId = cat.getAttribute("id");
        return catId;
    },
    getUrgency: function(urgency){
        if (urgency === 'normal'){
            return ''
        } else if (urgency === 'urgent'){
            return "[urgent]"
        } else {
            return "[completed]"
        }
    },
}

const logoDisplay = {
    initLogo: function(){
        const myIcon = new Image();
        const logoSpace = document.querySelector(".logo-container")
        const logoTitle = document.createElement("h1");
        const hiddenSpan = document.createElement("span");

        myIcon.src = vAndBrunoLogo;

        hiddenSpan.setAttribute("id", "activate-logo");
        myIcon.setAttribute("id", "v-and-bruno-logo");
        logoTitle.setAttribute("id", "v-and-bruno-title");

        logoTitle.textContent = 'V and Bruno';

        logoSpace.appendChild(myIcon);
        logoSpace.appendChild(hiddenSpan);
        logoSpace.appendChild(logoTitle);
    }
}



export {visualCues, logoDisplay}