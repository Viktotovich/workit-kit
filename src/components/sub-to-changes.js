//pub/sub - this is listening to any time cats are rendered/re-rendered
import { projects } from './task-master';
//But Why?

// 1 - Cleaner code, 2 - pubsub is a standard, 3 - no mess and less bugs when communicating between dom-master and date-hanger, 4 - much less lines since dom-master is overflowing at this point
import * as dateMaster from './date-handler';

const changeListener = {
    //we actually don't need to get the catObj
    pubChangesToDates: function(cats){
        Object.keys(cats).forEach(cat => {
            console.log(projects[cat])
            dateMaster.dateSorter.sortToday(projects[cat]);
        })
    },
    
}

export { changeListener }