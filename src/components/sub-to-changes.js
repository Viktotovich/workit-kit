//pub/sub - this is listening to any time cats are rendered/re-rendered
import { projects } from './task-master';
import * as dateMaster from './date-handler';

const changeListener = {
    //we actually don't need to get the catObj
    pubChangesToDates: function(cats){
        Object.keys(cats).forEach(cat => {
            dateMaster.dateSorter.sortAll(projects[cat]);
        })
    },
    todayArray: [],
    soonArray: [],
    overdueArray: [],
    anytimeArray: [],
    saveTodayArray: function(arr){
        this.todayArray = arr;
    },
    saveSoonArray: function(arr){
        this.soonArray = arr;
    },
    saveOverdueArray: function(arr){
        this.overdueArray = arr;
    },
    saveAnytimeArray: function(arr){
        this.anytimeArray = arr;
    }
}

export { changeListener }