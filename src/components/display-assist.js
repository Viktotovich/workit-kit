/*
This module does everything to assist CSS styles, the goals are:

1 - Change subtasks status upon a click: click = toggle between complete and incomplete

Target specifically <div class="subtask-status">incomplete</div>

*/
import * as taskMaster from "./task-master";

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
    publishUpdateDate: function(subtaskIndex, taskIndex, newStatus){
        const path = taskMaster.dateObjs[this.currentDateType][taskIndex].subtasks[subtaskIndex];

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
}

export {visualCues}