const { endOfMonth, format, isBefore, isAfter, add, endOfYesterday } = require("date-fns");
import { changeListener } from './sub-to-changes'

// Years must be displayed
const getDateInformation = {
    getEndOfMonth: function(){
        return format(endOfMonth(new Date()), 'MMM/dd/yyyy');
    },
    formatDueDate: function(dueDate){
        const dateObj = new Date(Date.parse(dueDate));
        return format(dateObj, 'MMM/dd/yyyy');
    },
    processDate: function(dueDate){
        const dateObj = new Date(Date.parse(dueDate));
        return format(dateObj, 'dd/MMM');
    },
    isToday: function(dateStr){
        const todayObj = new Date();
        const today = this.formatDueDate(todayObj);
        const userDate = this.formatDueDate(dateStr)
        if (userDate === today){
            return true;
        } else {
            return false;
        }
    },
    getToday: function(){
        const todayObj = new Date();
        const today = this.formatDueDate(todayObj);
        return today 
    },
    getWeekFromNow: function(){
        const today = this.getToday();
        const weekFromToday = add(today, {
            weeks: 1,
        });
        return weekFromToday
    },
};

const defaultDue = getDateInformation.getEndOfMonth();

//Due to the implementation 
export const dateSorter = {
    sortAll: function(catObj){
        this.resetArrays();
        this.sortAnytime(catObj);
        this.sortToday(catObj);
        this.sortOverdue(catObj);
        this.sortSoon(catObj);
        this.pubDateArrays();
    },
    resetArrays: function(){
        this.todayArray = [];
        this.soonArray = [];
        this.overdueArray = [];
        this.anytimeArray = [];
    },
    pubDateArrays: function(){
        changeListener.saveAnytimeArray(this.anytimeArray);
        changeListener.saveOverdueArray(this.overdueArray);
        changeListener.saveSoonArray(this.soonArray);
        changeListener.saveTodayArray(this.todayArray);
    },
    todayArray: [],
    soonArray: [],
    overdueArray: [],
    anytimeArray: [],
    sortToday: function(catObj){
        const tasksArr = catObj.tasks;
        tasksArr.forEach(element => {
            let dateCheck = getDateInformation.isToday(element.due);
            if (dateCheck === true){
                //works flawlessly
                this.todayArray.push(element);
            };
        });
    },
    sortOverdue: function(catObj){
        const tasksArr = catObj.tasks;
        const today = getDateInformation.getToday();

        tasksArr.forEach(element => {
            let dateCheck = isBefore(element.due, today);
            if (dateCheck === true){
                this.overdueArray.push(element);
            }
        });
    },
    sortAnytime: function(catObj){
        const tasksArr = catObj.tasks;

        tasksArr.forEach(element => {
            this.anytimeArray.push(element);
        });
    },
    sortSoon: function(catObj){
        const tasksArr = catObj.tasks;

        const weekFromToday = getDateInformation.getWeekFromNow();
        const yesterday = endOfYesterday();

        tasksArr.forEach(element => {
            let dateCheckBefore = isAfter(element.due, yesterday);
            let dateCheckAfter = isBefore(element.due, weekFromToday);

            if (dateCheckAfter === true && dateCheckBefore === true){
                this.soonArray.push(element);
            };
        });
    },
}

/* DO NOT MAKE THE MISTAKE OF ASKING USERS TO SELECT DATE IN THE MODAL FOR TODAY OBJECT. - on date object just leave the template the same
 */

export {getDateInformation, defaultDue};

/*
To Do:
Bonus (if I feel like it's worth the scope creep):
5 - Sort tasks by dates ascending / descending (compareAsc)

Note: 
(1) toJson() calls toIsoString()
(2) To get default to get called into getEndOfMonth in taskMaster, call a Task constructor with '', undefined, or NaN => putting undefined helps bandaid edge case errors to do with dates. ezpz

*/