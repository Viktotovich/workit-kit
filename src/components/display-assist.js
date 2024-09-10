/*
This module does everything to assist CSS styles, the goals are:

1 - Change subtasks status upon a click: click = toggle between complete and incomplete

Target specifically <div class="subtask-status">incomplete</div>

Transform subtask status into [x] [ ], and the subtask itself to strike through. Find a good way to change text from normal to strikethrough or something: the <span> inside might pose a problem though
*/
import * as taskMaster from "./task-master";

const visualCues = {
    addToggleListener: function(domElement){
        domElement.addEventListener("click", this.statusToggle);
    },
    statusToggle: function(e){
        const list = e.target.classList;

        if (list.contains("incomplete")){
            list.remove("incomplete");
            list.add("complete");
            //visualCues.processUpdate(e, "complete")
        } else {
            list.remove("complete");
            list.add("incomplete");
            //visualCues.processUpdate(e, "incomplete");
        };
    },
}

export {visualCues}

/* Not happy with this:

    processUpdate: function(e, newStatus){
        let targetIndex = e.target.getAttribute("id");
        let target = document.querySelector(`.${targetIndex}`);
        console.log(targetIndex)
        console.log(e.target)
        let subtaskIndex = this.getSubtaskIndex(target);
        let taskIndex = this.getTaskIndex(target);
        let cat = this.getCat();

        if (cat === 'obyect-vremeni'){
            //
        } else {
            this.postUpdate(newStatus, subtaskIndex, taskIndex, cat);
        }
    },
    postUpdate: function(newStatus, subtaskIndex, taskIndex, cat){
        console.log(subtaskIndex)
        const subtaskPath = taskMaster.projects[cat].tasks[taskIndex].subtasks[subtaskIndex];

        subtaskPath.status = newStatus;
    },
    postUpdateDate: function(newStatus, subtaskIndex, taskIndex){
        //plaster currentDateType to pubSub and retreive it here
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
    */