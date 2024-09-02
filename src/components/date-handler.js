const { endOfMonth, format } = require("date-fns");
//isToday doesnt work well - i need my own implementation of the same

const getDateInformation = {
    getEndOfMonth: function(){
        return format(endOfMonth(new Date()), 'MMM/dd');
    },
    formatDueDate: function(dueDate){
        const dateObj = new Date(Date.parse(dueDate));
        return format(dateObj, 'MMM/dd');
    },
    isToday: function(dateStr){
        const todayObj = new Date();
        const today = this.formatDueDate(todayObj);
        if (dateStr === today){
            return true;
        } else {
            return false;
        }
    }
};

const defaultDue = getDateInformation.getEndOfMonth();

export const dateSorter = {
    //isToday an array of Tasks
    todayArray: [],
    // up to week from now
    soonArray: [],
    //all before today / less than today
    overdueArray: [],
    //basically all
    anytimeArray: [],
    sortToday: function(catObj){
        const tasksArr = catObj.tasks;
        tasksArr.forEach(element => {
            let dateCheck = getDateInformation.isToday(element.due);
            if (dateCheck === true){
                console.log('something')
            };
        });
        
        //sort for each task, append each isToday to a new object called today
    }
}

//whatever date object styles I go to, addEventListeners to today, anytime, etc sidebar, and throw the object into defaultLoad(dateObj)

/* Also question: what do I do if someone wants to add a task for today? 

Let them, the task is appended to the today or whatever dateObj - DO NOT MAKE THE MISTAKE OF ASKING USERS TO SELECT DATE IN THE MODAL FOR TODAY OBJECT.

The task will belong to no cats, or in other words: it will be catless. (jokes aside: it will be under the date cat)
 */

export {getDateInformation, defaultDue};

/*
There should be an Object that has all the tasks, regardless of cats, based on their dates.

Today: whatever date === today;
Soon: whatever date up to 1 week from today;
Overdue: any date < today;
Anytime: View all projects basically
*/

/*
To Do (These were the benefits listed out before, but I changed them to things we can implement):
2- Quantify distances in date - 17th sept from today - it will help with the sorting (sorting in a sense: what belongs to today, soon, tommorow, etc).

3 - Call whatever does point 2 by the end of task-master; Tasks have to be fully rendered.

Bonus (if I feel like it's worth the scope creep):
4 - Sort tasks by dates ascending / descending (compareAsc)

And Most Importantly: Leave dom-master for now alone.

Note: 
(1) toJson() calls toIsoString()
(2) To get default to get called into getEndOfMonth in taskMaster, call a Task constructor with '', undefined, or NaN => putting undefined helps bandaid edge case errors to do with dates. ezpz

*/

//Once implemented, go back to task-editor and add the date as well