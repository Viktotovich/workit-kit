//pub/sub - this is listening to any time cats are rendered/re-rendered
import { projects, dateObjs } from './task-master';
import * as dateMaster from './date-handler';
import { storageManager } from './storage-handler';

const changeListener = {
    saveChanges: function(){
        storageManager.saveProjects();
    },
    loadChanges: function(){
        storageManager.loadProjects();
    },
    clearAll: function(){
        storageManager.clearLocalStorage();
    },
    //we actually don't need to get the catObj
    pubChangesToDates: function(cats){
        dateMaster.dateSorter.resetArrays();
        Object.keys(cats).forEach(cat => {
            dateMaster.dateSorter.sortAll(projects[cat]);
        });
    },
    saveTodayArray: function(arr){
        dateObjs.today = arr;
    },
    saveSoonArray: function(arr){
        dateObjs.soonArray = arr;
    },
    saveOverdueArray: function(arr){
        dateObjs.overdueArray = arr;
    },
    saveAnytimeArray: function(arr){
        dateObjs.anytimeArray = arr;
    },
    pubUnprocessedDates(date){
        const processedDate = dateMaster.getDateInformation.processDate(date);
        return processedDate;
    },
}

export { changeListener }