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
    pubChangesToDom: function(obj){
        console.log(obj)
        //for each, send to DOM and add an event listener
    }
}

export { changeListener }