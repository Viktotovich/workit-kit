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