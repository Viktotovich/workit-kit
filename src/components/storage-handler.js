import * as taskMaster from "./task-master";

const storageManager = {
    saveProjects: function(){
        const jsonObj = JSON.stringify(taskMaster.projects);
        localStorage.setItem('savedProjects', jsonObj);
    },
    loadProjects: function(){
        if (!localStorage.getItem('savedProjects')){
            console.log("what doink")
            this.saveProjects()
        } else {
            const localObj = localStorage.getItem('savedProjects');
            const parsedObj = JSON.parse(localObj);
            
            Object.keys(taskMaster.projects).forEach(key => delete taskMaster.projects[key]);
            Object.assign(taskMaster.projects, parsedObj);
        }
    },
    clearLocalStorage: function(){
        localStorage.clear();
    }
}


export {storageManager}