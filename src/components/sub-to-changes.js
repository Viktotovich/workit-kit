//pub/sub - this is listening to any time cats are rendered/re-rendered
import { projects, dateObjs } from './task-master';
import * as dateMaster from './date-handler';

const changeListener = {
    //we actually don't need to get the catObj
    pubChangesToDates: function(cats){
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
}

export { changeListener }